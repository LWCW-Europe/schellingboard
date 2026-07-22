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
import { POST } from "@/app/api/delete-session/route";
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

function makeDeleteReq(
  id: string,
  opts?: { editorGuestId?: string }
): NextRequest {
  return new NextRequest("http://test/api/delete-session", {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: opts?.editorGuestId
      ? { cookie: `${GUEST_COOKIE_NAME}=${openGuestValue(opts.editorGuestId)}` }
      : undefined,
  });
}

async function makeDeleteReqWithAuthCookie(
  id: string,
  editorGuestId: string
): Promise<NextRequest> {
  return new NextRequest("http://test/api/delete-session", {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: {
      cookie: `${GUEST_COOKIE_NAME}=${await verifiedGuestValue(editorGuestId)}`,
    },
  });
}

async function createScheduledSession(
  eventId: string,
  host: Guest,
  location: Location,
  day: Day,
  overrides?: Partial<SessionParams>
): Promise<string> {
  const payload: SessionParams = {
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
  const res = await addPOST(makeAddReq(payload));
  expect(res.ok).toBe(true);
  const sessions = await getRepositories().sessions.listByEvent(eventId);
  const title = overrides?.title ?? "Test Session";
  return sessions.find((s) => s.title === title)!.id;
}

describe("POST /api/delete-session", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("deleted session is absent from listByEvent", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    const location = await createLocation();
    const day = await createDay(event.id);

    const id = await createScheduledSession(event.id, guest, location, day);

    const res = await POST(makeDeleteReq(id, { editorGuestId: guest.id }));
    expect(res.ok).toBe(true);

    const sessions = await getRepositories().sessions.listByEvent(event.id);
    expect(sessions).toHaveLength(0);
  });

  it("rejects delete outside the scheduling phase", async () => {
    const event = await createEvent({ phase: "voting" });
    const guest = await createGuest({ eventId: event.id });
    const location = await createLocation();

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
      makeDeleteReq(created.id, { editorGuestId: guest.id })
    );
    expect(res.status).toBe(403);

    const still = await getRepositories().sessions.findById(created.id);
    expect(still).toBeDefined();
  });

  it("RSVPs for the deleted session are removed", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ name: "Host", eventId: event.id });
    const attendee = await createGuest({ name: "Attendee" });
    const location = await createLocation();
    const day = await createDay(event.id);

    const sessionId = await createScheduledSession(
      event.id,
      host,
      location,
      day
    );
    await getRepositories().rsvps.create({ sessionId, guestId: attendee.id });

    const before = await getRepositories().rsvps.listByGuest(attendee.id);
    expect(before).toHaveLength(1);

    const res = await POST(
      makeDeleteReq(sessionId, { editorGuestId: host.id })
    );
    expect(res.ok).toBe(true);

    const after = await getRepositories().rsvps.listByGuest(attendee.id);
    expect(after).toHaveLength(0);
  });

  it("rejects a non-host attempting to delete", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const nonHost = await createGuest({ eventId: event.id });
    const location = await createLocation();
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(makeDeleteReq(id, { editorGuestId: nonHost.id }));
    expect(res.status).toBe(403);

    const still = await getRepositories().sessions.findById(id);
    expect(still).toBeDefined();
  });

  it("rejects deleting with no acting guest at all", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation();
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(makeDeleteReq(id));
    expect(res.status).toBe(403);

    const still = await getRepositories().sessions.findById(id);
    expect(still).toBeDefined();
  });

  it("rejects a protected host without a verified session", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    await protectGuest(host.id);
    const location = await createLocation();
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(makeDeleteReq(id, { editorGuestId: host.id }));
    expect(res.status).toBe(403);

    const still = await getRepositories().sessions.findById(id);
    expect(still).toBeDefined();
  });

  it("accepts a protected host with a verified session", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    await protectGuest(host.id);
    const location = await createLocation();
    const day = await createDay(event.id);
    const id = await createScheduledSession(event.id, host, location, day);

    const res = await POST(await makeDeleteReqWithAuthCookie(id, host.id));
    expect(res.ok).toBe(true);

    const gone = await getRepositories().sessions.findById(id);
    expect(gone).toBeUndefined();
  });
});
