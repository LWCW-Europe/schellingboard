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
import type { Day, Guest, Location } from "@/db/repositories/interfaces";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function protectGuest(guestId: string): Promise<void> {
  await getRepositories().guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: null,
  });
}

function makeAddReq(payload: unknown): NextRequest {
  return new NextRequest("http://test/api/add-session", {
    method: "POST",
    body: JSON.stringify(payload),
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
    day,
    startTimeMinutes: 10 * 60,
    duration: 60,
    timezone: "UTC",
    ...overrides,
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
    const location = await createLocation();
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day, {
      startTimeMinutes: 10 * 60,
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
          ...basePayload(host, location, day, { startTimeMinutes: 12 * 60 }),
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
    const location = await createLocation();
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day, {
      startTimeMinutes: 10 * 60,
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
            startTimeMinutes: 12 * 60,
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
    const location = await createLocation();
    const day = await createDay(event.id);

    const id = await createScheduledSession(event.id, guest, location, day, {
      startTimeMinutes: 10 * 60,
    });
    const before = (await getRepositories().sessions.findById(id))!;

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(guest, location, day, { startTimeMinutes: 12 * 60 }),
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
    const location = await createLocation();
    const day = await createDay(event.id);

    await createScheduledSession(event.id, guest, location, day, {
      title: "Anchor",
      startTimeMinutes: 10 * 60,
    });
    const movingId = await createScheduledSession(
      event.id,
      guest,
      location,
      day,
      {
        title: "Moving",
        startTimeMinutes: 12 * 60,
      }
    );
    const originalTime = (await getRepositories().sessions.findById(movingId))!
      .startTime;

    const res = await POST(
      makeUpdateReq(
        {
          ...basePayload(guest, location, day, {
            title: "Moving",
            startTimeMinutes: 10 * 60 + 30,
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
    const location = await createLocation();
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
    const location = await createLocation();
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
            startTimeMinutes: 14 * 60,
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

  it("rejects a host who is not part of the event", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    const location = await createLocation();
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
    const location = await createLocation();
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
    const loc1 = await createLocation({ name: "Workshop Room", capacity: 20 });
    const loc2 = await createLocation({ name: "Garden Terrace", capacity: 50 });
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

  it("rejects a non-host attempting to edit", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const nonHost = await createGuest({ eventId: event.id });
    const location = await createLocation();
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
    const location = await createLocation();
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
    await protectGuest(host.id);
    const location = await createLocation();
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

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

  it("accepts a protected host with a verified session", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    await protectGuest(host.id);
    const location = await createLocation();
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

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
