import { describe, it, expect } from "vitest";
import {
  sessionOverlapsWindow,
  sessionContainedInWindow,
  sessionBookingWindowError,
} from "@/utils/day-window";
import type { Day } from "@/db/repositories/interfaces";

const winStart = new Date("2026-10-01T09:00:00Z");
const winEnd = new Date("2026-10-01T18:00:00Z");

describe("sessionOverlapsWindow", () => {
  it("is true for a fully contained session", () => {
    const s = {
      startTime: new Date("2026-10-01T10:00:00Z"),
      endTime: new Date("2026-10-01T11:00:00Z"),
    };
    expect(sessionOverlapsWindow(s, winStart, winEnd)).toBe(true);
  });

  it("is true for a session that starts inside but ends after the window", () => {
    const s = {
      startTime: new Date("2026-10-01T17:00:00Z"),
      endTime: new Date("2026-10-01T19:00:00Z"),
    };
    expect(sessionOverlapsWindow(s, winStart, winEnd)).toBe(true);
  });

  it("is true for a session that starts before but ends inside the window", () => {
    const s = {
      startTime: new Date("2026-10-01T08:00:00Z"),
      endTime: new Date("2026-10-01T10:00:00Z"),
    };
    expect(sessionOverlapsWindow(s, winStart, winEnd)).toBe(true);
  });

  it("is false for a session entirely outside the window", () => {
    const s = {
      startTime: new Date("2026-10-02T10:00:00Z"),
      endTime: new Date("2026-10-02T11:00:00Z"),
    };
    expect(sessionOverlapsWindow(s, winStart, winEnd)).toBe(false);
  });

  it("is false for an unscheduled session", () => {
    expect(sessionOverlapsWindow({}, winStart, winEnd)).toBe(false);
  });
});

describe("sessionContainedInWindow", () => {
  it("is true only when start and end both fall within the window", () => {
    const s = {
      startTime: new Date("2026-10-01T10:00:00Z"),
      endTime: new Date("2026-10-01T11:00:00Z"),
    };
    expect(sessionContainedInWindow(s, winStart, winEnd)).toBe(true);
  });

  it("is false for a session that ends after the window", () => {
    const s = {
      startTime: new Date("2026-10-01T17:00:00Z"),
      endTime: new Date("2026-10-01T19:00:00Z"),
    };
    expect(sessionContainedInWindow(s, winStart, winEnd)).toBe(false);
  });

  it("is false for an unscheduled session", () => {
    expect(sessionContainedInWindow({}, winStart, winEnd)).toBe(false);
  });
});

describe("sessionBookingWindowError", () => {
  // A party night: 09:00 → 03:00 the next morning, bookable until 02:30.
  const day: Day = {
    id: "d1",
    eventId: "e1",
    start: new Date("2026-10-01T09:00:00Z"),
    end: new Date("2026-10-02T03:00:00Z"),
    startBookings: new Date("2026-10-01T09:00:00Z"),
    endBookings: new Date("2026-10-02T02:30:00Z"),
  };
  const error = (start: string, end: string) =>
    sessionBookingWindowError(day, new Date(start), new Date(end), 30);

  it("accepts a slot inside the bookings window", () =>
    expect(error("2026-10-01T10:00:00Z", "2026-10-01T11:00:00Z")).toBeNull());

  it("accepts a slot after midnight, still within the day", () =>
    expect(error("2026-10-02T01:00:00Z", "2026-10-02T02:00:00Z")).toBeNull());

  it("accepts a session ending exactly when bookings close", () =>
    expect(error("2026-10-02T02:00:00Z", "2026-10-02T02:30:00Z")).toBeNull());

  it("rejects a start before the bookings window opens", () =>
    expect(error("2026-10-01T08:30:00Z", "2026-10-01T09:30:00Z")).toMatch(
      /booking window/
    ));

  it("rejects a start once the bookings window has closed", () =>
    expect(error("2026-10-02T02:30:00Z", "2026-10-02T03:00:00Z")).toMatch(
      /booking window/
    ));

  // The tail between endBookings and the day's end is the organizers' to fill.
  it("rejects a session running into the day's unbookable tail", () =>
    expect(error("2026-10-02T02:00:00Z", "2026-10-02T03:00:00Z")).toMatch(
      /booking window/
    ));

  it("rejects times off the day's slot grid", () =>
    expect(error("2026-10-01T10:10:00Z", "2026-10-01T11:10:00Z")).toMatch(
      /align/
    ));

  it("rejects an unparseable start", () =>
    expect(error("nonsense", "2026-10-01T11:00:00Z")).toMatch(/valid/));
});
