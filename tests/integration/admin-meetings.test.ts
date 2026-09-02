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
import { createEvent } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import {
  updateEventMeetingsAction,
  createMeetingPointAction,
  updateMeetingPointAction,
  deleteMeetingPointAction,
  type EventMeetingsInput,
} from "@/app/actions/admin-meetings";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

const SETTINGS: Omit<EventMeetingsInput, "id"> = {
  meetingsEnabled: true,
  maxOpenMeetingRequests: "5",
};

describe("admin meetings settings", () => {
  beforeAll(() => setupTestDb());
  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("saves the whole section", async () => {
    const event = await createEvent();

    const result = await updateEventMeetingsAction({
      id: event.id,
      ...SETTINGS,
      maxOpenMeetingRequests: "3",
    });

    expect(result).toEqual({ ok: true });
    const saved = await getRepositories().events.findById(event.id);
    expect(saved?.meetingsEnabled).toBe(true);
    expect(saved?.maxOpenMeetingRequests).toBe(3);
  });

  it("turns meetings back off without discarding the rest of the section", async () => {
    const event = await createEvent();
    await updateEventMeetingsAction({ id: event.id, ...SETTINGS });

    await updateEventMeetingsAction({
      id: event.id,
      ...SETTINGS,
      meetingsEnabled: false,
    });

    const saved = await getRepositories().events.findById(event.id);
    expect(saved?.meetingsEnabled).toBe(false);
    expect(saved?.maxOpenMeetingRequests).toBe(5);
  });

  // The form hides everything below the switch when meetings are off, so
  // validating those fields then would reject a save the organizer cannot fix.
  it("switches meetings off even when the hidden fields are invalid", async () => {
    const event = await createEvent();
    await updateEventMeetingsAction({ id: event.id, ...SETTINGS });

    const result = await updateEventMeetingsAction({
      id: event.id,
      ...SETTINGS,
      meetingsEnabled: false,
      maxOpenMeetingRequests: "",
    });

    expect(result).toEqual({ ok: true });
    const saved = await getRepositories().events.findById(event.id);
    expect(saved?.meetingsEnabled).toBe(false);
    // The stored cap stands: nothing invalid reached the row.
    expect(saved?.maxOpenMeetingRequests).toBe(5);
  });

  it("leaves the event's other settings alone", async () => {
    const event = await createEvent();

    await updateEventMeetingsAction({ id: event.id, ...SETTINGS });

    const saved = await getRepositories().events.findById(event.id);
    expect(saved?.name).toBe(event.name);
    expect(saved?.slotIncrementMinutes).toBe(event.slotIncrementMinutes);
    expect(saved?.proposalPhaseStart?.toISOString()).toBe(
      event.proposalPhaseStart?.toISOString()
    );
  });

  it("rejects a request cap below one, which would block every request", async () => {
    const event = await createEvent();

    const result = await updateEventMeetingsAction({
      id: event.id,
      ...SETTINGS,
      maxOpenMeetingRequests: "0",
    });

    expect(result.ok).toBe(false);
  });

  it("reports an unknown event", async () => {
    const result = await updateEventMeetingsAction({
      id: "no-such-event",
      ...SETTINGS,
    });

    expect(result).toEqual({ ok: false, error: "Event not found" });
  });

  it("refuses a caller who is not an admin", async () => {
    const event = await createEvent();
    cookieJar.clear();

    const result = await updateEventMeetingsAction({
      id: event.id,
      ...SETTINGS,
    });

    expect(result).toEqual({ ok: false, error: "Unauthorized" });
    const saved = await getRepositories().events.findById(event.id);
    expect(saved?.meetingsEnabled).toBe(false);
  });
});

describe("admin meeting points", () => {
  beforeAll(() => setupTestDb());
  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("adds a point with its description", async () => {
    const event = await createEvent();

    const result = await createMeetingPointAction({
      eventId: event.id,
      name: "Coffee bar",
      description: "Ground floor, next to reception",
    });

    expect(result).toEqual({ ok: true });
    const points = await getRepositories().meetingPoints.listByEvent(event.id);
    expect(points).toHaveLength(1);
    expect(points[0].name).toBe("Coffee bar");
    expect(points[0].description).toBe("Ground floor, next to reception");
  });

  it("keeps new points in the order they were added", async () => {
    const event = await createEvent();

    await createMeetingPointAction({ eventId: event.id, name: "Coffee bar" });
    await createMeetingPointAction({ eventId: event.id, name: "Lawn" });
    await createMeetingPointAction({ eventId: event.id, name: "Library" });

    const points = await getRepositories().meetingPoints.listByEvent(event.id);
    expect(points.map((p) => p.name)).toEqual([
      "Coffee bar",
      "Lawn",
      "Library",
    ]);
  });

  it("trims the name and requires one", async () => {
    const event = await createEvent();

    const blank = await createMeetingPointAction({
      eventId: event.id,
      name: "   ",
    });
    expect(blank.ok).toBe(false);

    await createMeetingPointAction({ eventId: event.id, name: "  Lawn  " });
    const points = await getRepositories().meetingPoints.listByEvent(event.id);
    expect(points.map((p) => p.name)).toEqual(["Lawn"]);
  });

  it("defaults a missing description to empty", async () => {
    const event = await createEvent();

    await createMeetingPointAction({ eventId: event.id, name: "Lawn" });

    const points = await getRepositories().meetingPoints.listByEvent(event.id);
    expect(points[0].description).toBe("");
  });

  it("renames a point", async () => {
    const event = await createEvent();
    await createMeetingPointAction({ eventId: event.id, name: "Coffee bar" });
    const [point] = await getRepositories().meetingPoints.listByEvent(event.id);

    const result = await updateMeetingPointAction({
      id: point.id,
      eventId: event.id,
      name: "Café",
      description: "By the entrance",
    });

    expect(result).toEqual({ ok: true });
    const [saved] = await getRepositories().meetingPoints.listByEvent(event.id);
    expect(saved.name).toBe("Café");
    expect(saved.description).toBe("By the entrance");
  });

  it("deletes a point", async () => {
    const event = await createEvent();
    await createMeetingPointAction({ eventId: event.id, name: "Coffee bar" });
    const [point] = await getRepositories().meetingPoints.listByEvent(event.id);

    const result = await deleteMeetingPointAction({
      id: point.id,
      eventId: event.id,
    });

    expect(result).toEqual({ ok: true });
    expect(
      await getRepositories().meetingPoints.listByEvent(event.id)
    ).toHaveLength(0);
  });

  // The id alone would let an admin edit any event's point from any event's
  // page; the actions are scoped to the event whose section is open.
  it("won't touch a point belonging to another event", async () => {
    const event = await createEvent();
    const other = await createEvent();
    await createMeetingPointAction({ eventId: other.id, name: "Coffee bar" });
    const [point] = await getRepositories().meetingPoints.listByEvent(other.id);

    const renamed = await updateMeetingPointAction({
      id: point.id,
      eventId: event.id,
      name: "Hijacked",
    });
    const deleted = await deleteMeetingPointAction({
      id: point.id,
      eventId: event.id,
    });

    expect(renamed.ok).toBe(false);
    expect(deleted.ok).toBe(false);
    const [saved] = await getRepositories().meetingPoints.listByEvent(other.id);
    expect(saved.name).toBe("Coffee bar");
  });

  it("reports an unknown event", async () => {
    const result = await createMeetingPointAction({
      eventId: "no-such-event",
      name: "Coffee bar",
    });

    expect(result).toEqual({ ok: false, error: "Event not found" });
  });

  it("refuses a caller who is not an admin", async () => {
    const event = await createEvent();
    cookieJar.clear();

    const result = await createMeetingPointAction({
      eventId: event.id,
      name: "Coffee bar",
    });

    expect(result).toEqual({ ok: false, error: "Unauthorized" });
    expect(
      await getRepositories().meetingPoints.listByEvent(event.id)
    ).toHaveLength(0);
  });
});
