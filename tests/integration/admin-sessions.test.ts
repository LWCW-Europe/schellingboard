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

import { revalidatePath } from "next/cache";
import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createDay,
  createEvent,
  createGuest,
  createLocation,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import {
  adminCreateSessionAction,
  adminUpdateSessionAction,
  adminDeleteSessionAction,
} from "@/app/actions/admin-sessions";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("adminCreateSessionAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("creates a session with all fields, hosts and locations", async () => {
    const event = await createEvent();
    const host = await createGuest({ name: "Host One" });
    const loc = await createLocation({ name: "Room A" });

    const result = await adminCreateSessionAction({
      eventId: event.id,
      title: "Lunch",
      description: "Meal time",
      startTime: "2030-01-01T12:30:00.000Z",
      endTime: "2030-01-01T14:00:00.000Z",
      capacity: 0,
      adminManaged: true,
      blocker: true,
      closed: false,
      hostIds: [host.id],
      locationIds: [loc.id],
    });
    expect(result.ok).toBe(true);

    const sessions = await getRepositories().sessions.listByEvent(event.id);
    expect(sessions).toHaveLength(1);
    const created = sessions[0];
    expect(created.title).toBe("Lunch");
    expect(created.description).toBe("Meal time");
    expect(created.capacity).toBe(0);
    expect(created.adminManaged).toBe(true);
    expect(created.blocker).toBe(true);
    expect(created.closed).toBe(false);
    expect(created.startTime?.toISOString()).toBe("2030-01-01T12:30:00.000Z");
    expect(created.endTime?.toISOString()).toBe("2030-01-01T14:00:00.000Z");
    expect(created.hosts.map((h) => h.id)).toEqual([host.id]);
    expect(created.locations.map((l) => l.id)).toEqual([loc.id]);
  });

  it("creates an unscheduled session without hosts or locations", async () => {
    const event = await createEvent();

    const result = await adminCreateSessionAction({
      eventId: event.id,
      title: "Untimed",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 10,
      adminManaged: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(result.ok).toBe(true);

    const sessions = await getRepositories().sessions.listByEvent(event.id);
    expect(sessions).toHaveLength(1);
    expect(sessions[0].startTime).toBeUndefined();
    expect(sessions[0].endTime).toBeUndefined();
    expect(sessions[0].hosts).toHaveLength(0);
    expect(sessions[0].locations).toHaveLength(0);
  });

  it("rejects an empty title", async () => {
    const event = await createEvent();

    const result = await adminCreateSessionAction({
      eventId: event.id,
      title: "   ",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 0,
      adminManaged: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(!result.ok && result.error).toBe("Title is required");
  });

  it("rejects when only one of startTime/endTime is set or the range is invalid", async () => {
    const event = await createEvent();
    const base = {
      eventId: event.id,
      title: "Title",
      description: "",
      capacity: 0,
      adminManaged: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    };

    const startOnly = await adminCreateSessionAction({
      ...base,
      startTime: "2030-01-01T10:00:00.000Z",
      endTime: null,
    });
    expect(!startOnly.ok && startOnly.error).toBe(
      "Start and end time must both be set or both empty"
    );

    const reversed = await adminCreateSessionAction({
      ...base,
      startTime: "2030-01-01T11:00:00.000Z",
      endTime: "2030-01-01T10:00:00.000Z",
    });
    expect(!reversed.ok && reversed.error).toBe(
      "End time must be after start time"
    );

    expect(await getRepositories().sessions.listByEvent(event.id)).toHaveLength(
      0
    );
  });

  it("rejects a capacity that is not a non-negative whole number", async () => {
    const event = await createEvent();

    for (const capacity of [-1, 2.5, Number.NaN]) {
      const result = await adminCreateSessionAction({
        eventId: event.id,
        title: "Title",
        description: "",
        startTime: null,
        endTime: null,
        capacity,
        adminManaged: true,
        blocker: false,
        closed: false,
        hostIds: [],
        locationIds: [],
      });
      expect(!result.ok && result.error).toBe(
        "Capacity must be a non-negative whole number"
      );
    }
  });

  it("rejects times that are misaligned with the day's slot grid", async () => {
    const event = await createEvent({ slotIncrementMinutes: 30 });
    await createDay(event.id, {
      start: new Date("2030-01-01T08:00:00.000Z"),
      end: new Date("2030-01-01T18:00:00.000Z"),
      startBookings: new Date("2030-01-01T09:00:00.000Z"),
      endBookings: new Date("2030-01-01T17:00:00.000Z"),
    });
    const base = {
      eventId: event.id,
      title: "Title",
      description: "",
      capacity: 0,
      adminManaged: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    };

    const misalignedStart = await adminCreateSessionAction({
      ...base,
      startTime: "2030-01-01T10:07:00.000Z",
      endTime: "2030-01-01T11:00:00.000Z",
    });
    expect(!misalignedStart.ok && misalignedStart.error).toBe(
      "Session times must align to the event's 30-minute slots; misaligned sessions do not appear in the schedule grid"
    );

    const misalignedEnd = await adminCreateSessionAction({
      ...base,
      startTime: "2030-01-01T10:00:00.000Z",
      endTime: "2030-01-01T11:10:00.000Z",
    });
    expect(!misalignedEnd.ok && misalignedEnd.error).toBe(
      "Session times must align to the event's 30-minute slots; misaligned sessions do not appear in the schedule grid"
    );

    expect(await getRepositories().sessions.listByEvent(event.id)).toHaveLength(
      0
    );
  });

  it("accepts aligned times and times outside any day window", async () => {
    const event = await createEvent({ slotIncrementMinutes: 30 });
    await createDay(event.id, {
      start: new Date("2030-01-01T08:00:00.000Z"),
      end: new Date("2030-01-01T18:00:00.000Z"),
      startBookings: new Date("2030-01-01T09:00:00.000Z"),
      endBookings: new Date("2030-01-01T17:00:00.000Z"),
    });
    const base = {
      eventId: event.id,
      description: "",
      capacity: 0,
      adminManaged: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    };

    const aligned = await adminCreateSessionAction({
      ...base,
      title: "Aligned",
      startTime: "2030-01-01T10:30:00.000Z",
      endTime: "2030-01-01T11:30:00.000Z",
    });
    expect(aligned.ok).toBe(true);

    // No day window covers this date, so there is no grid to align to
    // (mirrors slotIncrementChangeError, which also skips such sessions).
    const offDay = await adminCreateSessionAction({
      ...base,
      title: "Off day",
      startTime: "2030-02-01T10:07:00.000Z",
      endTime: "2030-02-01T11:07:00.000Z",
    });
    expect(offDay.ok).toBe(true);
  });

  it("errors for an unknown event", async () => {
    const result = await adminCreateSessionAction({
      eventId: "no-such-event",
      title: "Title",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 0,
      adminManaged: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(!result.ok && result.error).toBe("Event not found");
  });

  it("returns an error instead of throwing when a host or location does not exist", async () => {
    const event = await createEvent();

    const result = await adminCreateSessionAction({
      eventId: event.id,
      title: "Title",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 0,
      adminManaged: true,
      blocker: false,
      closed: false,
      hostIds: ["no-such-guest"],
      locationIds: [],
    });
    expect(!result.ok && result.error).toBe("Failed to create session");

    // the transaction rolled back, nothing was created
    expect(await getRepositories().sessions.listByEvent(event.id)).toHaveLength(
      0
    );
  });

  it("revalidates the public event layout so attendees see the new session", async () => {
    const event = await createEvent();
    vi.mocked(revalidatePath).mockClear();

    const result = await adminCreateSessionAction({
      eventId: event.id,
      title: "Title",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 0,
      adminManaged: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(result.ok).toBe(true);

    expect(revalidatePath).toHaveBeenCalledWith(`/${event.slug}`, "layout");
  });

  it("rejects when not authenticated", async () => {
    const event = await createEvent();
    cookieJar.clear();

    const result = await adminCreateSessionAction({
      eventId: event.id,
      title: "Title",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 0,
      adminManaged: true,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(!result.ok && result.error).toBe("Unauthorized");
  });
});

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
      adminManaged: true,
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
    expect(updated?.adminManaged).toBe(true);
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
      adminManaged: false,
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

  it("rejects when only one of startTime/endTime is set", async () => {
    const event = await createEvent();
    const session = await createSession(event.id, {
      startTime: new Date("2030-01-01T10:00:00.000Z"),
      endTime: new Date("2030-01-01T11:00:00.000Z"),
    });

    const base = {
      id: session.id,
      title: "Title",
      description: "",
      capacity: 30,
      adminManaged: false,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    };

    const startOnly = await adminUpdateSessionAction({
      ...base,
      startTime: "2030-01-01T10:00:00.000Z",
      endTime: null,
    });
    expect(!startOnly.ok && startOnly.error).toBe(
      "Start and end time must both be set or both empty"
    );

    const endOnly = await adminUpdateSessionAction({
      ...base,
      startTime: null,
      endTime: "2030-01-01T11:00:00.000Z",
    });
    expect(!endOnly.ok && endOnly.error).toBe(
      "Start and end time must both be set or both empty"
    );

    // session is unchanged
    const updated = await getRepositories().sessions.findById(session.id);
    expect(updated?.startTime?.toISOString()).toBe("2030-01-01T10:00:00.000Z");
    expect(updated?.endTime?.toISOString()).toBe("2030-01-01T11:00:00.000Z");
  });

  it("rejects when endTime is not after startTime", async () => {
    const event = await createEvent();
    const session = await createSession(event.id);

    const base = {
      id: session.id,
      title: "Title",
      description: "",
      capacity: 30,
      adminManaged: false,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    };

    const reversed = await adminUpdateSessionAction({
      ...base,
      startTime: "2030-01-01T11:00:00.000Z",
      endTime: "2030-01-01T10:00:00.000Z",
    });
    expect(!reversed.ok && reversed.error).toBe(
      "End time must be after start time"
    );

    const equal = await adminUpdateSessionAction({
      ...base,
      startTime: "2030-01-01T10:00:00.000Z",
      endTime: "2030-01-01T10:00:00.000Z",
    });
    expect(!equal.ok && equal.error).toBe("End time must be after start time");
  });

  it("rejects unparseable time values", async () => {
    const event = await createEvent();
    const session = await createSession(event.id);

    const result = await adminUpdateSessionAction({
      id: session.id,
      title: "Title",
      description: "",
      startTime: "not-a-date",
      endTime: "2030-01-01T11:00:00.000Z",
      capacity: 30,
      adminManaged: false,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(!result.ok && result.error).toBe("Invalid start or end time");
  });

  it("rejects a capacity that is not a non-negative whole number", async () => {
    const event = await createEvent();
    const session = await createSession(event.id, { capacity: 10 });

    const base = {
      id: session.id,
      title: "Title",
      description: "",
      startTime: null,
      endTime: null,
      adminManaged: false,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    };

    for (const capacity of [-1, 2.5, Number.NaN]) {
      const result = await adminUpdateSessionAction({ ...base, capacity });
      expect(!result.ok && result.error).toBe(
        "Capacity must be a non-negative whole number"
      );
    }

    // session is unchanged
    const updated = await getRepositories().sessions.findById(session.id);
    expect(updated?.capacity).toBe(10);
  });

  it("rejects times that are misaligned with the day's slot grid", async () => {
    const event = await createEvent({ slotIncrementMinutes: 30 });
    await createDay(event.id, {
      start: new Date("2030-01-01T08:00:00.000Z"),
      end: new Date("2030-01-01T18:00:00.000Z"),
      startBookings: new Date("2030-01-01T09:00:00.000Z"),
      endBookings: new Date("2030-01-01T17:00:00.000Z"),
    });
    const session = await createSession(event.id, {
      startTime: new Date("2030-01-01T10:00:00.000Z"),
      endTime: new Date("2030-01-01T11:00:00.000Z"),
    });

    const result = await adminUpdateSessionAction({
      id: session.id,
      title: "Title",
      description: "",
      startTime: "2030-01-01T10:07:00.000Z",
      endTime: "2030-01-01T11:07:00.000Z",
      capacity: 0,
      adminManaged: false,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(!result.ok && result.error).toBe(
      "Session times must align to the event's 30-minute slots; misaligned sessions do not appear in the schedule grid"
    );

    // session is unchanged
    const updated = await getRepositories().sessions.findById(session.id);
    expect(updated?.startTime?.toISOString()).toBe("2030-01-01T10:00:00.000Z");
    expect(updated?.endTime?.toISOString()).toBe("2030-01-01T11:00:00.000Z");
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
      adminManaged: false,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(!result.ok && result.error).toBe("Title is required");
  });

  it("returns an error instead of throwing when a host or location does not exist", async () => {
    const event = await createEvent();
    const session = await createSession(event.id, { title: "Old title" });

    const base = {
      id: session.id,
      title: "New title",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 30,
      adminManaged: false,
      blocker: false,
      closed: false,
    };

    const badHost = await adminUpdateSessionAction({
      ...base,
      hostIds: ["no-such-guest"],
      locationIds: [],
    });
    expect(!badHost.ok && badHost.error).toBe("Failed to update session");

    const badLocation = await adminUpdateSessionAction({
      ...base,
      hostIds: [],
      locationIds: ["no-such-location"],
    });
    expect(!badLocation.ok && badLocation.error).toBe(
      "Failed to update session"
    );

    // the transaction rolled back, session is unchanged
    const updated = await getRepositories().sessions.findById(session.id);
    expect(updated?.title).toBe("Old title");
  });

  it("revalidates the public event layout so attendees see the change", async () => {
    const event = await createEvent();
    const session = await createSession(event.id);
    vi.mocked(revalidatePath).mockClear();

    const result = await adminUpdateSessionAction({
      id: session.id,
      title: "New title",
      description: "",
      startTime: null,
      endTime: null,
      capacity: 30,
      adminManaged: false,
      blocker: false,
      closed: false,
      hostIds: [],
      locationIds: [],
    });
    expect(result.ok).toBe(true);

    expect(revalidatePath).toHaveBeenCalledWith(`/${event.slug}`, "layout");
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
      adminManaged: false,
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
      adminManaged: false,
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

  it("revalidates the public event layout so attendees see the removal", async () => {
    const event = await createEvent();
    const session = await createSession(event.id);
    vi.mocked(revalidatePath).mockClear();

    const result = await adminDeleteSessionAction({ id: session.id });
    expect(result.ok).toBe(true);

    expect(revalidatePath).toHaveBeenCalledWith(`/${event.slug}`, "layout");
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
