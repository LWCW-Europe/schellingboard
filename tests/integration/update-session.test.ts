import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
}));

import { render } from "@react-email/render";
import { sendMail } from "@/utils/mailer";
import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createDay,
  createSession,
  slotStart,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import {
  GUEST_COOKIE_NAME,
  openGuestValue,
  verifiedGuestValue,
} from "../helpers/guest-cookie";
import { POST as addPOST } from "@/app/api/add-session/route";
import { POST } from "@/app/api/update-session/route";
import type { SessionParams } from "@/app/api/session-form-utils";
import type {
  Day,
  Guest,
  Location,
  Session,
} from "@/db/repositories/interfaces";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function protectGuest(guestId: string): Promise<void> {
  await getRepositories().guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: null,
  });
}

function makeAddReq(payload: unknown): NextRequest {
  // Creating requires a name to be selected; these fixtures only seed a
  // session, so act as its first host.
  const hostId = (payload as SessionParams).hosts[0].id;
  return new NextRequest("http://test/api/add-session", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { cookie: `${GUEST_COOKIE_NAME}=${openGuestValue(hostId)}` },
  });
}

function makeUpdateReq(
  payload: unknown,
  opts?: { editorGuestId?: string }
): NextRequest {
  return new NextRequest("http://test/api/update-session", {
    method: "POST",
    body: JSON.stringify(payload),
    // The guest cookie identifies the acting guest, like the site sets it.
    headers: opts?.editorGuestId
      ? { cookie: `${GUEST_COOKIE_NAME}=${openGuestValue(opts.editorGuestId)}` }
      : undefined,
  });
}

async function makeUpdateReqWithAuthCookie(
  payload: unknown,
  editorGuestId: string
): Promise<NextRequest> {
  return new NextRequest("http://test/api/update-session", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      cookie: `${GUEST_COOKIE_NAME}=${await verifiedGuestValue(editorGuestId)}`,
    },
  });
}

function basePayload(
  host: Guest,
  location: Location,
  day: Day,
  overrides?: Partial<SessionParams>
): Omit<SessionParams, "id"> {
  return {
    title: "Test Session",
    description: "",
    closed: false,
    hosts: [host],
    location,
    dayId: day.id,
    startTime: slotStart(day, 60),
    duration: 60,
    ...overrides,
  };
}

const HOUR_MS = 60 * 60 * 1000;

/**
 * A day whose booking window straddles the present: it opened three hours ago
 * and closes in three. Anchored to a whole hour so every slot in it stays on
 * the event's grid.
 */
async function createOngoingDay(eventId: string): Promise<Day> {
  const anchor = new Date();
  anchor.setMinutes(0, 0, 0);
  return createDay(eventId, {
    start: new Date(anchor.getTime() - 4 * HOUR_MS),
    end: new Date(anchor.getTime() + 4 * HOUR_MS),
    startBookings: new Date(anchor.getTime() - 3 * HOUR_MS),
    endBookings: new Date(anchor.getTime() + 3 * HOUR_MS),
  });
}

/** The payload the form posts when it re-sends a session's own times. */
function payloadFor(
  session: Session,
  host: Guest,
  location: Location,
  day: Day,
  overrides?: Partial<SessionParams>
): SessionParams {
  return {
    ...basePayload(host, location, day, {
      title: session.title,
      startTime: session.startTime!.toISOString(),
      duration:
        (session.endTime!.getTime() - session.startTime!.getTime()) / 60_000,
      ...overrides,
    }),
    id: session.id,
  };
}

/** Creates a session via add-session and returns its id. */
async function createScheduledSession(
  eventId: string,
  host: Guest,
  location: Location,
  day: Day,
  overrides?: Partial<SessionParams>
): Promise<string> {
  const res = await addPOST(
    makeAddReq(basePayload(host, location, day, overrides))
  );
  expect(res.ok).toBe(true);
  const sessions = await getRepositories().sessions.listByEvent(eventId);
  const title = overrides?.title ?? "Test Session";
  return sessions.find((s) => s.title === title)!.id;
}

describe("POST /api/update-session", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    vi.mocked(sendMail).mockReset();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("emails RSVP'd guests when the session time changes", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const rsvper = await createGuest({
      email: "rsvper@test.example",
      eventId: event.id,
    });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day, {
      startTime: slotStart(day, 60),
    });
    await getRepositories().rsvps.create({
      sessionId: id,
      guestId: rsvper.id,
    });
    // Creating the event might have sent email, which we don't want to test.
    vi.mocked(sendMail).mockClear();

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(host, location, day, {
            startTime: slotStart(day, 180),
          }),
          id,
        },
        // The host makes the change, so only the RSVP'd guest is emailed.
        { editorGuestId: host.id }
      )
    );
    expect(res.ok).toBe(true);
    expect(sendMail).toHaveBeenCalledOnce();
    expect(vi.mocked(sendMail).mock.calls[0][0].to).toBe("rsvper@test.example");
  });

  it("emails a guest promoted to host as a host, not as an attendee", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const rsvper = await createGuest({
      email: "promoted@test.example",
      eventId: event.id,
    });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day, {
      startTime: slotStart(day, 60),
    });
    await getRepositories().rsvps.create({
      sessionId: id,
      guestId: rsvper.id,
    });
    // Creating the event might have sent email, which we don't want to test.
    vi.mocked(sendMail).mockClear();

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(host, location, day, {
            startTime: slotStart(day, 180),
            hosts: [host, rsvper],
          }),
          id,
        },
        { editorGuestId: host.id }
      )
    );
    expect(res.ok).toBe(true);
    // Their RSVP was removed with the promotion, so they are told as a
    // co-host and as a host of a changed session — never as an attendee.
    const messages = vi.mocked(sendMail).mock.calls.map((c) => c[0]);
    expect(messages).toHaveLength(2);
    for (const message of messages) {
      expect(message.to).toBe("promoted@test.example");
      expect(await render(message.body)).not.toContain("RSVP’d to");
    }
  });

  it("changes time without conflict; re-fetched session reflects new time", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);

    const id = await createScheduledSession(event.id, guest, location, day, {
      startTime: slotStart(day, 60),
    });
    const before = (await getRepositories().sessions.findById(id))!;

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(guest, location, day, {
            startTime: slotStart(day, 180),
          }),
          id,
        },
        { editorGuestId: guest.id }
      )
    );
    expect(res.ok).toBe(true);

    const after = (await getRepositories().sessions.findById(id))!;
    expect(after.startTime!.getTime()).toBeGreaterThan(
      before.startTime!.getTime()
    );
  });

  it("rejects move to colliding slot; session remains unchanged", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);

    await createScheduledSession(event.id, guest, location, day, {
      title: "Anchor",
      startTime: slotStart(day, 60),
    });
    const movingId = await createScheduledSession(
      event.id,
      guest,
      location,
      day,
      {
        title: "Moving",
        startTime: slotStart(day, 180),
      }
    );
    const originalTime = (await getRepositories().sessions.findById(movingId))!
      .startTime;

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(guest, location, day, {
            title: "Moving",
            startTime: slotStart(day, 90),
          }),
          id: movingId,
        },
        { editorGuestId: guest.id }
      )
    );
    expect(res.ok).toBe(false);

    const unchanged = (await getRepositories().sessions.findById(movingId))!;
    expect(unchanged.startTime!.getTime()).toBe(originalTime!.getTime());
  });

  it("does not collide with itself when re-saved with the same slot", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);

    const id = await createScheduledSession(event.id, guest, location, day);

    const res = await POST(
      makeUpdateReq(
        { ...basePayload(guest, location, day), id },
        { editorGuestId: guest.id }
      )
    );
    expect(res.ok).toBe(true);
  });

  it("rejects update outside the scheduling phase", async () => {
    const event = await createEvent({ phase: "voting" });
    const guest = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);

    // Create an editable (attendee-scheduled, non-blocker) session directly,
    // bypassing add-session's phase gate.
    const created = await getRepositories().sessions.create({
      title: "Existing",
      description: "",
      closed: false,
      hostIds: [guest.id],
      locationIds: [location.id],
      startTime: new Date(Date.now() + 60 * 60 * 1000),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      capacity: 30,
      adminManaged: false,
      blocker: false,
      eventId: event.id,
    });

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(guest, location, day, {
            title: "Renamed",
            startTime: slotStart(day, 300),
          }),
          id: created.id,
        },
        { editorGuestId: guest.id }
      )
    );
    expect(res.status).toBe(403);

    const unchanged = (await getRepositories().sessions.findById(created.id))!;
    expect(unchanged.title).toBe("Existing");
  });

  it("rejects moving a session outside the day's booking window", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day, {
      startTime: slotStart(day, 60),
    });

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(host, location, day, {
            // Long past the last bookable slot.
            startTime: slotStart(day, 12 * 60),
          }),
          id,
        },
        { editorGuestId: host.id }
      )
    );
    expect(res.status).toBe(400);

    const unchanged = (await getRepositories().sessions.findById(id))!;
    expect(unchanged.startTime!.toISOString()).toBe(slotStart(day, 60));
  });

  it("rejects stretching a session beyond the event's maximum duration", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day, {
      startTime: slotStart(day, 60),
    });

    const res = await POST(
      makeUpdateReq(
        {
          // Three hours, where the event's maximum is two.
          ...basePayload(host, location, day, { duration: 180 }),
          id,
        },
        { editorGuestId: host.id }
      )
    );
    expect(res.status).toBe(400);
    // Named, so the rejection can't be mistaken for the booking-window rule.
    expect(await res.json()).toEqual({
      error: "Sessions can last at most 120 minutes",
    });

    const unchanged = (await getRepositories().sessions.findById(id))!;
    expect(unchanged.endTime!.getTime() - unchanged.startTime!.getTime()).toBe(
      60 * 60 * 1000
    );
  });

  it("rejects a day id that is not one", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(host, location, day, {
            dayId: {} as unknown as string,
          }),
          id,
        },
        { editorGuestId: host.id }
      )
    );
    expect(res.status).toBe(400);
  });

  it("turns a non-host away before judging the times they sent", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const stranger = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(host, location, day, {
            startTime: slotStart(day, 12 * 60),
          }),
          id,
        },
        { editorGuestId: stranger.id }
      )
    );
    expect(res.status).toBe(403);
    // Named, so it can't pass on one of the handler's other 403s.
    expect(await res.json()).toEqual({
      error: "Only a host may edit this session",
    });
  });

  it("rejects a host who is not part of the event", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);

    const id = await createScheduledSession(event.id, guest, location, day);
    const outsider = await createGuest(); // not assigned to the event

    const res = await POST(
      makeUpdateReq(
        { ...basePayload(outsider, location, day), id },
        { editorGuestId: guest.id }
      )
    );
    expect(res.status).toBe(403);

    const unchanged = (await getRepositories().sessions.findById(id))!;
    expect(unchanged.hosts[0].id).toBe(guest.id);
  });

  it("removes a guest's RSVP when they are added as a host, leaving other RSVPs untouched", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const rsvper = await createGuest({ eventId: event.id });
    const otherRsvper = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);
    await getRepositories().rsvps.create({
      sessionId: id,
      guestId: rsvper.id,
    });
    await getRepositories().rsvps.create({
      sessionId: id,
      guestId: otherRsvper.id,
    });

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(host, location, day, { hosts: [host, rsvper] }),
          id,
        },
        { editorGuestId: host.id }
      )
    );
    expect(res.ok).toBe(true);
    const remaining = await getRepositories().rsvps.listBySession(id);
    expect(remaining.map((r) => r.guestId)).toEqual([otherRsvper.id]);
  });

  it("updates location, hosts, and capacity; re-fetched session reflects each", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host1 = await createGuest({ name: "Host 1", eventId: event.id });
    const host2 = await createGuest({ name: "Host 2", eventId: event.id });
    const loc1 = await createLocation({
      name: "Workshop Room",
      capacity: 20,
      eventId: event.id,
    });
    const loc2 = await createLocation({
      name: "Garden Terrace",
      capacity: 50,
      eventId: event.id,
    });
    const day = await createDay(event.id);

    const id = await createScheduledSession(event.id, host1, loc1, day);

    const res = await POST(
      makeUpdateReq(
        { ...basePayload(host2, loc2, day), id },
        { editorGuestId: host1.id }
      )
    );
    expect(res.ok).toBe(true);

    const updated = (await getRepositories().sessions.findById(id))!;
    expect(updated.hosts[0].id).toBe(host2.id);
    expect(updated.locations[0].id).toBe(loc2.id);
    expect(updated.capacity).toBe(50);
  });

  it("takes capacity from the stored location, not the payload", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ capacity: 10, eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(
      makeUpdateReq(
        { ...basePayload(host, { ...location, capacity: 9999 }, day), id },
        { editorGuestId: host.id }
      )
    );
    expect(res.ok).toBe(true);

    const updated = (await getRepositories().sessions.findById(id))!;
    expect(updated.capacity).toBe(10);
  });

  it("saves the max attendee count the host chose", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ capacity: 30, eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(
      makeUpdateReq(
        { ...basePayload(host, location, day, { capacity: 8 }), id },
        { editorGuestId: host.id }
      )
    );
    expect(res.ok).toBe(true);

    const updated = (await getRepositories().sessions.findById(id))!;
    expect(updated.capacity).toBe(8);
  });

  it("rejects a negative max attendee count and leaves the session alone", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ capacity: 30, eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(
      makeUpdateReq(
        { ...basePayload(host, location, day, { capacity: -1 }), id },
        { editorGuestId: host.id }
      )
    );
    expect(res.status).toBe(400);

    const unchanged = (await getRepositories().sessions.findById(id))!;
    expect(unchanged.capacity).toBe(30);
  });

  it("rejects moving the session to a location that is not part of the event", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const outsideLocation = await createLocation({ name: "Outside Room" });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(
      makeUpdateReq(
        { ...basePayload(host, outsideLocation, day), id },
        { editorGuestId: host.id }
      )
    );
    expect(res.status).toBe(403);

    const unchanged = (await getRepositories().sessions.findById(id))!;
    expect(unchanged.locations[0].id).toBe(location.id);
  });

  it("rejects moving the session to a location attendees may not self-book", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const staffOnly = await createLocation({
      name: "Staff Room",
      bookable: false,
      eventId: event.id,
    });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(
      makeUpdateReq(
        { ...basePayload(host, staffOnly, day), id },
        { editorGuestId: host.id }
      )
    );
    expect(res.status).toBe(403);

    const unchanged = (await getRepositories().sessions.findById(id))!;
    expect(unchanged.locations[0].id).toBe(location.id);
  });

  it("rejects a non-host attempting to edit", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const nonHost = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(
      makeUpdateReq(
        { ...basePayload(host, location, day, { title: "Renamed" }), id },
        { editorGuestId: nonHost.id }
      )
    );
    expect(res.status).toBe(403);

    const unchanged = (await getRepositories().sessions.findById(id))!;
    expect(unchanged.title).toBe("Test Session");
  });

  it("rejects editing with no acting guest at all", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(
      makeUpdateReq({
        ...basePayload(host, location, day, { title: "Renamed" }),
        id,
      })
    );
    expect(res.status).toBe(403);

    const unchanged = (await getRepositories().sessions.findById(id))!;
    expect(unchanged.title).toBe("Test Session");
  });

  it("rejects a protected host without a verified session", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);
    // Protect only once the fixture exists: creating needs a selected name
    // too, so a protected host can't seed one with an open cookie.
    await protectGuest(host.id);

    const res = await POST(
      makeUpdateReq(
        { ...basePayload(host, location, day, { title: "Renamed" }), id },
        { editorGuestId: host.id }
      )
    );
    expect(res.status).toBe(403);

    const unchanged = (await getRepositories().sessions.findById(id))!;
    expect(unchanged.title).toBe("Test Session");
  });

  it("lets a host retitle a session that has already started", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createOngoingDay(event.id);
    const started = await createSession(event.id, {
      title: "Underway",
      hostIds: [host.id],
      locationIds: [location.id],
      startTime: new Date(slotStart(day, 120)),
      endTime: new Date(slotStart(day, 180)),
    });

    const res = await POST(
      makeUpdateReq(
        payloadFor(started, host, location, day, { title: "Fixed" }),
        {
          editorGuestId: host.id,
        }
      )
    );
    expect(res.ok).toBe(true);

    const updated = (await getRepositories().sessions.findById(started.id))!;
    expect(updated.title).toBe("Fixed");
  });

  it("rejects moving a session that has already started", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createOngoingDay(event.id);
    const started = await createSession(event.id, {
      title: "Underway",
      hostIds: [host.id],
      locationIds: [location.id],
      startTime: new Date(slotStart(day, 120)),
      endTime: new Date(slotStart(day, 180)),
    });

    const res = await POST(
      makeUpdateReq(
        payloadFor(started, host, location, day, {
          startTime: slotStart(day, 240),
        }),
        { editorGuestId: host.id }
      )
    );
    expect(res.status).toBe(403);

    const unchanged = (await getRepositories().sessions.findById(started.id))!;
    expect(unchanged.startTime!.toISOString()).toBe(slotStart(day, 120));
  });

  it("lets a host stretch a session that has already started", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createOngoingDay(event.id);
    const started = await createSession(event.id, {
      title: "Underway",
      hostIds: [host.id],
      locationIds: [location.id],
      startTime: new Date(slotStart(day, 120)),
      endTime: new Date(slotStart(day, 180)),
    });

    const res = await POST(
      makeUpdateReq(
        payloadFor(started, host, location, day, { duration: 120 }),
        {
          editorGuestId: host.id,
        }
      )
    );
    expect(res.ok).toBe(true);

    const updated = (await getRepositories().sessions.findById(started.id))!;
    expect(updated.endTime!.toISOString()).toBe(slotStart(day, 240));
  });

  // An organizer can place a session where no host could book one — before the
  // day's bookings open, longer than the maximum, in a room nobody may
  // self-book — and still leave it to an attendee to host. Keeping what they
  // chose is not an edit; changing it is judged like any other booking.
  describe("a placement the host could not have booked", () => {
    it("keeps a start outside the day's bookable hours", async () => {
      const event = await createEvent({ phase: "scheduling" });
      const host = await createGuest({ eventId: event.id });
      const location = await createLocation({ eventId: event.id });
      const day = await createDay(event.id);
      const placed = await createSession(event.id, {
        title: "Early Bird",
        hostIds: [host.id],
        locationIds: [location.id],
        startTime: new Date(slotStart(day, -60)),
        endTime: new Date(slotStart(day, 0)),
      });

      const res = await POST(
        makeUpdateReq(
          payloadFor(placed, host, location, day, { title: "Sunrise Yoga" }),
          { editorGuestId: host.id }
        )
      );
      expect(res.ok).toBe(true);

      const updated = (await getRepositories().sessions.findById(placed.id))!;
      expect(updated.title).toBe("Sunrise Yoga");
      expect(updated.startTime!.toISOString()).toBe(slotStart(day, -60));
    });

    it("rejects moving it to another hour the host cannot book", async () => {
      const event = await createEvent({ phase: "scheduling" });
      const host = await createGuest({ eventId: event.id });
      const location = await createLocation({ eventId: event.id });
      const day = await createDay(event.id);
      const placed = await createSession(event.id, {
        title: "Early Bird",
        hostIds: [host.id],
        locationIds: [location.id],
        startTime: new Date(slotStart(day, -60)),
        endTime: new Date(slotStart(day, 0)),
      });

      const res = await POST(
        makeUpdateReq(
          payloadFor(placed, host, location, day, {
            startTime: slotStart(day, -120),
          }),
          { editorGuestId: host.id }
        )
      );
      expect(res.status).toBe(400);

      const unchanged = (await getRepositories().sessions.findById(placed.id))!;
      expect(unchanged.startTime!.toISOString()).toBe(slotStart(day, -60));
    });

    it("lets the host move it to an hour they could have booked", async () => {
      const event = await createEvent({ phase: "scheduling" });
      const host = await createGuest({ eventId: event.id });
      const location = await createLocation({ eventId: event.id });
      const day = await createDay(event.id);
      const placed = await createSession(event.id, {
        title: "Early Bird",
        hostIds: [host.id],
        locationIds: [location.id],
        startTime: new Date(slotStart(day, -60)),
        endTime: new Date(slotStart(day, 0)),
      });

      const res = await POST(
        makeUpdateReq(
          payloadFor(placed, host, location, day, {
            startTime: slotStart(day, 60),
          }),
          { editorGuestId: host.id }
        )
      );
      expect(res.ok).toBe(true);

      const updated = (await getRepositories().sessions.findById(placed.id))!;
      expect(updated.startTime!.toISOString()).toBe(slotStart(day, 60));
    });

    it("judges the new end without holding the old start against it", async () => {
      const event = await createEvent({ phase: "scheduling" });
      const host = await createGuest({ eventId: event.id });
      const location = await createLocation({ eventId: event.id });
      const day = await createDay(event.id);
      const placed = await createSession(event.id, {
        title: "Early Bird",
        hostIds: [host.id],
        locationIds: [location.id],
        startTime: new Date(slotStart(day, -60)),
        endTime: new Date(slotStart(day, 0)),
      });

      const res = await POST(
        makeUpdateReq(
          payloadFor(placed, host, location, day, { duration: 120 }),
          { editorGuestId: host.id }
        )
      );
      expect(res.ok).toBe(true);

      const updated = (await getRepositories().sessions.findById(placed.id))!;
      expect(updated.startTime!.toISOString()).toBe(slotStart(day, -60));
      expect(updated.endTime!.toISOString()).toBe(slotStart(day, 60));
    });

    it("keeps a run longer than the event's maximum", async () => {
      const event = await createEvent({ phase: "scheduling" });
      const host = await createGuest({ eventId: event.id });
      const location = await createLocation({ eventId: event.id });
      const day = await createDay(event.id);
      const placed = await createSession(event.id, {
        title: "All Morning",
        hostIds: [host.id],
        locationIds: [location.id],
        startTime: new Date(slotStart(day, 0)),
        endTime: new Date(slotStart(day, 180)),
      });

      const res = await POST(
        makeUpdateReq(
          payloadFor(placed, host, location, day, {
            title: "All Morning Long",
          }),
          { editorGuestId: host.id }
        )
      );
      expect(res.ok).toBe(true);

      const updated = (await getRepositories().sessions.findById(placed.id))!;
      expect(updated.title).toBe("All Morning Long");
      expect(updated.endTime!.toISOString()).toBe(slotStart(day, 180));
    });

    it("rejects re-stretching it to another over-long run", async () => {
      const event = await createEvent({ phase: "scheduling" });
      const host = await createGuest({ eventId: event.id });
      const location = await createLocation({ eventId: event.id });
      const day = await createDay(event.id);
      const placed = await createSession(event.id, {
        title: "All Morning",
        hostIds: [host.id],
        locationIds: [location.id],
        startTime: new Date(slotStart(day, 0)),
        endTime: new Date(slotStart(day, 180)),
      });

      const res = await POST(
        makeUpdateReq(
          payloadFor(placed, host, location, day, { duration: 150 }),
          {
            editorGuestId: host.id,
          }
        )
      );
      expect(res.status).toBe(400);

      const unchanged = (await getRepositories().sessions.findById(placed.id))!;
      expect(unchanged.endTime!.toISOString()).toBe(slotStart(day, 180));
    });

    it("keeps a room attendees cannot book", async () => {
      const event = await createEvent({ phase: "scheduling" });
      const host = await createGuest({ eventId: event.id });
      const staffOnly = await createLocation({
        name: "Staff Room",
        bookable: false,
        eventId: event.id,
      });
      const day = await createDay(event.id);
      const placed = await createSession(event.id, {
        title: "Briefing",
        hostIds: [host.id],
        locationIds: [staffOnly.id],
        startTime: new Date(slotStart(day, 60)),
        endTime: new Date(slotStart(day, 120)),
      });

      const res = await POST(
        makeUpdateReq(
          payloadFor(placed, host, staffOnly, day, { title: "Staff briefing" }),
          { editorGuestId: host.id }
        )
      );
      expect(res.ok).toBe(true);

      const updated = (await getRepositories().sessions.findById(placed.id))!;
      expect(updated.title).toBe("Staff briefing");
      expect(updated.locations[0].id).toBe(staffOnly.id);
    });

    it("rejects moving it into another room attendees cannot book", async () => {
      const event = await createEvent({ phase: "scheduling" });
      const host = await createGuest({ eventId: event.id });
      const staffOnly = await createLocation({
        name: "Staff Room",
        bookable: false,
        eventId: event.id,
      });
      const backstage = await createLocation({
        name: "Backstage",
        bookable: false,
        eventId: event.id,
      });
      const day = await createDay(event.id);
      const placed = await createSession(event.id, {
        title: "Briefing",
        hostIds: [host.id],
        locationIds: [staffOnly.id],
        startTime: new Date(slotStart(day, 60)),
        endTime: new Date(slotStart(day, 120)),
      });

      const res = await POST(
        makeUpdateReq(payloadFor(placed, host, backstage, day), {
          editorGuestId: host.id,
        })
      );
      expect(res.status).toBe(403);

      const unchanged = (await getRepositories().sessions.findById(placed.id))!;
      expect(unchanged.locations[0].id).toBe(staffOnly.id);
    });
  });

  it("still refuses to edit an organizer-managed session", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const keynote = await createSession(event.id, {
      title: "Keynote",
      hostIds: [host.id],
      locationIds: [location.id],
      startTime: new Date(slotStart(day, 60)),
      endTime: new Date(slotStart(day, 120)),
      adminManaged: true,
    });

    const res = await POST(
      makeUpdateReq(
        payloadFor(keynote, host, location, day, { title: "Talk" }),
        {
          editorGuestId: host.id,
        }
      )
    );
    expect(res.status).toBe(400);

    const unchanged = (await getRepositories().sessions.findById(keynote.id))!;
    expect(unchanged.title).toBe("Keynote");
  });

  it("still refuses to edit a blocker", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const lunch = await createSession(event.id, {
      title: "Lunch Break",
      hostIds: [host.id],
      locationIds: [location.id],
      startTime: new Date(slotStart(day, 60)),
      endTime: new Date(slotStart(day, 120)),
      blocker: true,
    });

    const res = await POST(
      makeUpdateReq(
        payloadFor(lunch, host, location, day, { title: "Brunch" }),
        {
          editorGuestId: host.id,
        }
      )
    );
    expect(res.status).toBe(400);

    const unchanged = (await getRepositories().sessions.findById(lunch.id))!;
    expect(unchanged.title).toBe("Lunch Break");
  });

  it("accepts a protected host with a verified session", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);
    // Protect only once the fixture exists: creating needs a selected name
    // too, so a protected host can't seed one with an open cookie.
    await protectGuest(host.id);

    const res = await POST(
      await makeUpdateReqWithAuthCookie(
        { ...basePayload(host, location, day, { title: "Renamed" }), id },
        host.id
      )
    );
    expect(res.ok).toBe(true);

    const updated = (await getRepositories().sessions.findById(id))!;
    expect(updated.title).toBe("Renamed");
  });
});
