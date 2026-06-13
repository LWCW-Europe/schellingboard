import { describe, it, expect } from "vitest";
import {
  sessionOverlapsWindow,
  sessionContainedInWindow,
} from "@/utils/day-window";

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
