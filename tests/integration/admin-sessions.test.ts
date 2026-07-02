import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

const cookieJar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => {
        const value = cookieJar.get(name);
        return value === undefined ? undefined : { name, value };
      },
    }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import {
  adminUpdateSessionAction,
  adminDeleteSessionAction,
} from "@/app/actions/admin-sessions";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("adminUpdateSessionAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("updates title, description, capacity, flags, time, host and location", async () => {
    const event = await createEvent();
    const h1 = await createGuest({ name: "Host One" });
    const h2 = await createGuest({ name: "Host Two" });
    const loc = await createLocation({ name: "Room A" });
    const session = await createSession(event.id, {
      title: "Old title",
      hostIds: [h1.id],
    });

    const result = await adminUpdateSessionAction({
      id: session.id,
      title: "New title",
      description: "New description",
      startTime: "2030-01-01T10:00:00.000Z",
      endTime: "2030-01-01T11:00:00.000Z",
      capacity: 42,
      attendeeScheduled: false,
      blocker: true,
      closed: true,
      hostIds: [h2.id],
      locationIds: [loc.id],
    });
    expect(result.ok).toBe(true);

    const updated = await getRepositories().sessions.findById(session.id);
    expect(updated?.title).toBe("New title");
    expect(updated?.description).toBe("New description");
    expect(updated?.capacity).toBe(42);
    expect(updated?.attendeeScheduled).toBe(false);
    expect(updated?.blocker).toBe(true);
    expect(updated?.closed).toBe(true);
    expect(updated?.startTime?.toISOString()).toBe("2030-01-01T10:00:00.000Z");
    expect(updated?.endTime?.toISOString()).toBe("2030-01-01T11:00:00.000Z");
    expect(updated?.hosts.map((h) => h.id)).toEqual([h2.id]);
    expect(updated?.locations.map((l) => l.id)).toEqual([loc.id]);
  });

  it("clears the time when startTime and endTime are null", async () => {
    const event = await createEvent();
    const session = await createSession(event.id, {
      startTime: new Date("2030-01-01T10:00:00.000Z"),
      endTime: new Date("2030-01-01T11:00:00.000Z"),
    });

    const result = await adminUpdateSessionAction({
      id: session.id,
      title: "Keeps title",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 30,
      attendeeScheduled: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(result.ok).toBe(true);

    const updated = await getRepositories().sessions.findById(session.id);
    expect(updated?.startTime).toBeUndefined();
    expect(updated?.endTime).toBeUndefined();
  });

  it("rejects an empty title", async () => {
    const event = await createEvent();
    const session = await createSession(event.id);

    const result = await adminUpdateSessionAction({
      id: session.id,
      title: "   ",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 30,
      attendeeScheduled: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(!result.ok && result.error).toBe("Title is required");
  });

  it("rejects when not authenticated", async () => {
    const event = await createEvent();
    const session = await createSession(event.id);
    cookieJar.clear();

    const result = await adminUpdateSessionAction({
      id: session.id,
      title: "x",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 30,
      attendeeScheduled: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(!result.ok && result.error).toBe("Unauthorized");
  });

  it("errors for an unknown session", async () => {
    const result = await adminUpdateSessionAction({
      id: "no-such-session",
      title: "x",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 30,
      attendeeScheduled: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(!result.ok && result.error).toBe("Session not found");
  });
});

describe("adminDeleteSessionAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("deletes the session with its RSVPs, host links and location links", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    const host = await createGuest({ name: "Host" });
    const attendee = await createGuest({ name: "Attendee" });
    const loc = await createLocation();
    const session = await createSession(event.id, {
      hostIds: [host.id],
      locationIds: [loc.id],
    });
    await repos.rsvps.create({ sessionId: session.id, guestId: attendee.id });

    const result = await adminDeleteSessionAction({ id: session.id });
    expect(result.ok).toBe(true);

    expect(await repos.sessions.findById(session.id)).toBeUndefined();
    expect(await repos.rsvps.listBySession(session.id)).toHaveLength(0);
    // host and location are global records, untouched
    expect(await repos.guests.findById(host.id)).toBeDefined();
    expect(await repos.locations.findById(loc.id)).toBeDefined();
  });

  it("rejects when not authenticated", async () => {
    const event = await createEvent();
    const session = await createSession(event.id);
    cookieJar.clear();

    const result = await adminDeleteSessionAction({ id: session.id });
    expect(!result.ok && result.error).toBe("Unauthorized");
  });

  it("errors for an unknown session", async () => {
    const result = await adminDeleteSessionAction({ id: "no-such-session" });
    expect(!result.ok && result.error).toBe("Session not found");
  });
});
