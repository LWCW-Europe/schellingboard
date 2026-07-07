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
import { createEvent, createDay, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import {
  createDayAction,
  updateDayAction,
  deleteDayAction,
} from "@/app/actions/admin-days";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("days repo", () => {
  beforeAll(() => setupTestDb());
  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });
  afterEach(() => vi.unstubAllEnvs());

  describe("update", () => {
    it("updates day fields", async () => {
      const event = await createEvent();
      const day = await createDay(event.id);
      const newStart = new Date("2026-10-01T08:00:00Z");
      const updated = await getRepositories().days.update(day.id, {
        start: newStart,
      });
      expect(updated?.start.toISOString()).toBe(newStart.toISOString());
      const fetched = await getRepositories().days.findById(day.id);
      expect(fetched?.start.toISOString()).toBe(newStart.toISOString());
    });

    it("returns undefined for unknown id", async () => {
      const result = await getRepositories().days.update("no-such-id", {
        start: new Date(),
      });
      expect(result).toBeUndefined();
    });

    it("preserves unpatched fields", async () => {
      const event = await createEvent();
      const day = await createDay(event.id);
      const origEnd = day.end;
      await getRepositories().days.update(day.id, {
        start: new Date("2026-10-01T08:00:00Z"),
      });
      const fetched = await getRepositories().days.findById(day.id);
      expect(fetched?.end.toISOString()).toBe(origEnd.toISOString());
    });
  });

  describe("delete", () => {
    it("deletes the day", async () => {
      const event = await createEvent();
      const day = await createDay(event.id);
      await getRepositories().days.delete(day.id);
      expect(await getRepositories().days.findById(day.id)).toBeUndefined();
    });

    it("cascade-deletes sessions within the day window", async () => {
      const event = await createEvent();
      const day = await createDay(event.id, {
        start: new Date("2026-10-01T09:00:00Z"),
        end: new Date("2026-10-01T18:00:00Z"),
      });
      // Session fully within the day window
      const session = await createSession(event.id);
      await getRepositories().sessions.update(session.id, {
        startTime: new Date("2026-10-01T10:00:00Z"),
        endTime: new Date("2026-10-01T11:00:00Z"),
      });

      await getRepositories().days.delete(day.id);

      expect(
        await getRepositories().sessions.findById(session.id)
      ).toBeUndefined();
    });

    it("cascade-deletes sessions that only partially overlap the day window", async () => {
      const event = await createEvent();
      const day = await createDay(event.id, {
        start: new Date("2026-10-01T09:00:00Z"),
        end: new Date("2026-10-01T18:00:00Z"),
      });
      // Session starts inside the window but runs past the day end.
      const session = await createSession(event.id);
      await getRepositories().sessions.update(session.id, {
        startTime: new Date("2026-10-01T17:00:00Z"),
        endTime: new Date("2026-10-01T19:00:00Z"),
      });

      await getRepositories().days.delete(day.id);

      expect(
        await getRepositories().sessions.findById(session.id)
      ).toBeUndefined();
    });

    it("does not delete sessions outside the day window", async () => {
      const event = await createEvent();
      const day = await createDay(event.id, {
        start: new Date("2026-10-01T09:00:00Z"),
        end: new Date("2026-10-01T18:00:00Z"),
      });
      // Session on a different day
      const session = await createSession(event.id);
      await getRepositories().sessions.update(session.id, {
        startTime: new Date("2026-10-02T10:00:00Z"),
        endTime: new Date("2026-10-02T11:00:00Z"),
      });

      await getRepositories().days.delete(day.id);

      expect(
        await getRepositories().sessions.findById(session.id)
      ).toBeDefined();
    });

    it("does not delete sessions without scheduled times", async () => {
      const event = await createEvent();
      const day = await createDay(event.id);
      const session = await createSession(event.id); // no startTime/endTime

      await getRepositories().days.delete(day.id);

      expect(
        await getRepositories().sessions.findById(session.id)
      ).toBeDefined();
    });
  });
});

describe("day actions", () => {
  beforeAll(() => setupTestDb());
  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });
  afterEach(() => vi.unstubAllEnvs());

  describe("createDayAction", () => {
    it("creates a day for an event", async () => {
      const event = await createEvent();
      const result = await createDayAction({
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T18:00",
        startBookings: "2026-10-01T09:00",
        endBookings: "2026-10-01T17:30",
      });
      expect(result.ok).toBe(true);
      const days = await getRepositories().days.listByEvent(event.id);
      expect(days).toHaveLength(1);
      expect(days[0].start.toISOString()).toBe("2026-10-01T09:00:00.000Z");
    });

    it("rejects without admin cookie", async () => {
      cookieJar.clear();
      const event = await createEvent();
      const result = await createDayAction({
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T18:00",
        startBookings: "2026-10-01T09:00",
        endBookings: "2026-10-01T17:30",
      });
      expect(!result.ok && result.error).toBe("Unauthorized");
    });

    it("rejects when end is before start", async () => {
      const event = await createEvent();
      const result = await createDayAction({
        eventId: event.id,
        start: "2026-10-01T18:00",
        end: "2026-10-01T09:00",
        startBookings: "2026-10-01T09:00",
        endBookings: "2026-10-01T17:30",
      });
      expect(!result.ok && result.error).toMatch(/end.*after.*start/i);
    });

    it("rejects when bookings window is outside day window", async () => {
      const event = await createEvent();
      const result = await createDayAction({
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T18:00",
        startBookings: "2026-10-01T08:00",
        endBookings: "2026-10-01T19:00",
      });
      expect(!result.ok && result.error).toMatch(/bookings.*within.*day/i);
    });

    it("rejects when new day overlaps an existing day", async () => {
      const event = await createEvent();
      await createDay(event.id, {
        start: new Date("2026-10-01T09:00:00Z"),
        end: new Date("2026-10-01T18:00:00Z"),
      });
      const result = await createDayAction({
        eventId: event.id,
        start: "2026-10-01T12:00",
        end: "2026-10-01T20:00",
        startBookings: "2026-10-01T12:00",
        endBookings: "2026-10-01T19:00",
      });
      expect(!result.ok && result.error).toMatch(/overlap/i);
    });

    it("allows non-overlapping days for the same event", async () => {
      const event = await createEvent();
      await createDay(event.id, {
        start: new Date("2026-10-01T09:00:00Z"),
        end: new Date("2026-10-01T18:00:00Z"),
      });
      const result = await createDayAction({
        eventId: event.id,
        start: "2026-10-02T09:00",
        end: "2026-10-02T18:00",
        startBookings: "2026-10-02T09:00",
        endBookings: "2026-10-02T17:30",
      });
      expect(result.ok).toBe(true);
    });
  });

  describe("updateDayAction", () => {
    it("updates a day", async () => {
      const event = await createEvent();
      const day = await createDay(event.id);
      const result = await updateDayAction({
        id: day.id,
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T18:00",
        startBookings: "2026-10-01T09:00",
        endBookings: "2026-10-01T17:30",
      });
      expect(result.ok).toBe(true);
      const updated = await getRepositories().days.findById(day.id);
      expect(updated?.start.toISOString()).toBe("2026-10-01T09:00:00.000Z");
    });

    it("errors for unknown id", async () => {
      const event = await createEvent();
      const result = await updateDayAction({
        id: "no-such-id",
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T18:00",
        startBookings: "2026-10-01T09:00",
        endBookings: "2026-10-01T17:30",
      });
      expect(!result.ok && result.error).toBe("Day not found");
    });

    it("cannot move a day to a different event", async () => {
      const event1 = await createEvent();
      const event2 = await createEvent();
      const day = await createDay(event1.id);
      const result = await updateDayAction({
        id: day.id,
        eventId: event2.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T18:00",
        startBookings: "2026-10-01T09:00",
        endBookings: "2026-10-01T17:30",
      });
      expect(result.ok).toBe(true);
      const fetched = await getRepositories().days.findById(day.id);
      expect(fetched?.eventId).toBe(event1.id);
    });

    it("rejects when updated day overlaps another existing day", async () => {
      const event = await createEvent();
      await createDay(event.id, {
        start: new Date("2026-10-02T09:00:00Z"),
        end: new Date("2026-10-02T18:00:00Z"),
      });
      const day = await createDay(event.id, {
        start: new Date("2026-10-01T09:00:00Z"),
        end: new Date("2026-10-01T18:00:00Z"),
      });
      const result = await updateDayAction({
        id: day.id,
        eventId: event.id,
        start: "2026-10-02T12:00",
        end: "2026-10-02T20:00",
        startBookings: "2026-10-02T12:00",
        endBookings: "2026-10-02T19:00",
      });
      expect(!result.ok && result.error).toMatch(/overlap/i);
    });

    it("rejects shrinking a day that would push a scheduled session outside it", async () => {
      const event = await createEvent();
      const day = await createDay(event.id, {
        start: new Date("2026-10-01T09:00:00Z"),
        end: new Date("2026-10-01T18:00:00Z"),
      });
      const session = await createSession(event.id, {
        title: "Outside Session",
      });
      await getRepositories().sessions.update(session.id, {
        startTime: new Date("2026-10-01T16:00:00Z"),
        endTime: new Date("2026-10-01T17:00:00Z"),
      });

      const result = await updateDayAction({
        id: day.id,
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T12:00",
        startBookings: "2026-10-01T09:00",
        endBookings: "2026-10-01T11:30",
      });

      expect(result.ok).toBe(false);
      expect(!result.ok && result.error).toMatch(/Outside Session/);
      // The day must be left untouched.
      const fetched = await getRepositories().days.findById(day.id);
      expect(fetched?.end.toISOString()).toBe("2026-10-01T18:00:00.000Z");
    });

    it("allows resizing a day when its scheduled sessions stay inside it", async () => {
      const event = await createEvent();
      const day = await createDay(event.id, {
        start: new Date("2026-10-01T09:00:00Z"),
        end: new Date("2026-10-01T18:00:00Z"),
      });
      const session = await createSession(event.id);
      await getRepositories().sessions.update(session.id, {
        startTime: new Date("2026-10-01T10:00:00Z"),
        endTime: new Date("2026-10-01T11:00:00Z"),
      });

      const result = await updateDayAction({
        id: day.id,
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T12:00",
        startBookings: "2026-10-01T09:00",
        endBookings: "2026-10-01T11:30",
      });

      expect(result.ok).toBe(true);
    });

    it("allows updating a day without it overlapping itself", async () => {
      const event = await createEvent();
      const day = await createDay(event.id, {
        start: new Date("2026-10-01T09:00:00Z"),
        end: new Date("2026-10-01T18:00:00Z"),
      });
      const result = await updateDayAction({
        id: day.id,
        eventId: event.id,
        start: "2026-10-01T08:00",
        end: "2026-10-01T19:00",
        startBookings: "2026-10-01T08:00",
        endBookings: "2026-10-01T18:30",
      });
      expect(result.ok).toBe(true);
    });
  });

  describe("deleteDayAction", () => {
    it("deletes a day", async () => {
      const event = await createEvent();
      const day = await createDay(event.id);
      const result = await deleteDayAction({ id: day.id, eventId: event.id });
      expect(result.ok).toBe(true);
      expect(await getRepositories().days.findById(day.id)).toBeUndefined();
    });

    it("rejects without admin cookie", async () => {
      cookieJar.clear();
      const event = await createEvent();
      const day = await createDay(event.id);
      const result = await deleteDayAction({ id: day.id, eventId: event.id });
      expect(!result.ok && result.error).toBe("Unauthorized");
    });

    it("errors for unknown id", async () => {
      const event = await createEvent();
      const result = await deleteDayAction({
        id: "no-such-id",
        eventId: event.id,
      });
      expect(!result.ok && result.error).toBe("Day not found");
    });
  });

  describe("slot alignment", () => {
    it("rejects a day window that is not a multiple of the increment", async () => {
      const event = await createEvent({ slotIncrementMinutes: 45 });
      // 8h day: 480 minutes is not a multiple of 45.
      const result = await createDayAction({
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T17:00",
        startBookings: "2026-10-01T09:00",
        endBookings: "2026-10-01T17:00",
      });
      expect(!result.ok && result.error).toMatch(/align/i);
    });

    it("rejects a bookings window off the slot grid", async () => {
      const event = await createEvent({ slotIncrementMinutes: 45 });
      const result = await createDayAction({
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T18:00",
        startBookings: "2026-10-01T09:30",
        endBookings: "2026-10-01T17:15",
      });
      expect(!result.ok && result.error).toMatch(/align/i);
    });

    it("accepts a day aligned to 45-minute slots", async () => {
      const event = await createEvent({ slotIncrementMinutes: 45 });
      const result = await createDayAction({
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T18:00",
        startBookings: "2026-10-01T09:45",
        endBookings: "2026-10-01T17:15",
      });
      expect(result.ok).toBe(true);
    });

    it("rejects a resize that would misalign an existing day", async () => {
      const event = await createEvent({ slotIncrementMinutes: 45 });
      const day = await createDay(event.id, {
        start: new Date("2026-10-01T09:00:00Z"),
        end: new Date("2026-10-01T18:00:00Z"),
        startBookings: new Date("2026-10-01T09:00:00Z"),
        endBookings: new Date("2026-10-01T17:15:00Z"),
      });
      const result = await updateDayAction({
        id: day.id,
        eventId: event.id,
        start: "2026-10-01T09:00",
        end: "2026-10-01T17:00",
        startBookings: "2026-10-01T09:00",
        endBookings: "2026-10-01T16:30",
      });
      expect(!result.ok && result.error).toMatch(/align/i);
    });
  });
});
