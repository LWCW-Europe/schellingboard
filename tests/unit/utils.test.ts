import { describe, it, expect } from "vitest";
import {
  durationMinusBreak,
  formatDuration,
  eventNameToSlug,
  dateOnDay,
  getPercentThroughDay,
  getNumHalfHours,
  getStartTimePlusBreak,
  votesApiUrl,
} from "@/utils/utils";
import type { Day, Session } from "@/db/repositories/interfaces";

// ── durationMinusBreak ───────────────────────────────────────────────────────

describe("durationMinusBreak", () => {
  it("60 min, 10 break → 50", () =>
    expect(durationMinusBreak(60, 10)).toBe(50));
  it("30 min, 5 break → 25", () => expect(durationMinusBreak(30, 5)).toBe(25));
  it("90 min, 10 break → 80", () =>
    expect(durationMinusBreak(90, 10)).toBe(80));
  it("0 break → unchanged", () => expect(durationMinusBreak(60, 0)).toBe(60));
  it("clamps to 0 when break ≥ duration", () =>
    expect(durationMinusBreak(10, 10)).toBe(0));
});

// ── formatDuration ───────────────────────────────────────────────────────────

describe("formatDuration", () => {
  it("45 short format → '45m'", () => expect(formatDuration(45)).toBe("45m"));
  it("45 long format → '45 minutes'", () =>
    expect(formatDuration(45, true)).toBe("45 minutes"));

  it("60 short format → '1h'", () => expect(formatDuration(60)).toBe("1h"));
  it("60 long format → '1 hour'", () =>
    expect(formatDuration(60, true)).toBe("1 hour"));

  it("90 short format → '1h 30m'", () =>
    expect(formatDuration(90)).toBe("1h 30m"));
  it("90 long format → '1 hour 30 minutes'", () =>
    expect(formatDuration(90, true)).toBe("1 hour 30 minutes"));

  it("120 short format → '2h'", () => expect(formatDuration(120)).toBe("2h"));
  it("120 long format → '2 hours'", () =>
    expect(formatDuration(120, true)).toBe("2 hours"));
});

// ── eventNameToSlug ──────────────────────────────────────────────────────────

describe("eventNameToSlug", () => {
  it("replaces spaces with hyphens", () =>
    expect(eventNameToSlug("My Event")).toBe("My-Event"));

  it("multiple spaces", () =>
    expect(eventNameToSlug("Foo Bar Baz")).toBe("Foo-Bar-Baz"));

  it("keeps hyphens already in the name", () =>
    expect(eventNameToSlug("My-Event 2026")).toBe("My-Event-2026"));
});

// ── votesApiUrl ──────────────────────────────────────────────────────────────

describe("votesApiUrl", () => {
  it("builds the votes query for plain values", () =>
    expect(votesApiUrl("guest1", "My-Event")).toBe(
      "/api/votes?user=guest1&event=My-Event"
    ));

  it("encodes reserved URL characters so the slug survives query parsing", () => {
    // "Food & Drinks" slugifies to "Food-&-Drinks"; unencoded, the server
    // would parse event as "Food-" and drop "-Drinks" into a bogus param.
    const url = votesApiUrl("guest1", "Food-&-Drinks");
    const params = new URL(url, "http://test").searchParams;
    expect(params.get("event")).toBe("Food-&-Drinks");
    expect(params.get("user")).toBe("guest1");
  });
});

// ── dateOnDay ────────────────────────────────────────────────────────────────

const DAY: Day = {
  id: "d1",
  start: new Date("2025-06-15T08:00:00Z"),
  end: new Date("2025-06-15T18:00:00Z"),
  startBookings: new Date("2025-06-15T09:00:00Z"),
  endBookings: new Date("2025-06-15T17:00:00Z"),
  eventId: "111",
};

describe("dateOnDay", () => {
  it("returns true when date equals day start", () =>
    expect(dateOnDay(new Date("2025-06-15T08:00:00Z"), DAY)).toBe(true));

  it("returns true when date is within the day", () =>
    expect(dateOnDay(new Date("2025-06-15T12:00:00Z"), DAY)).toBe(true));

  it("returns true when date equals day end", () =>
    expect(dateOnDay(new Date("2025-06-15T18:00:00Z"), DAY)).toBe(true));

  it("returns false when date is before the day", () =>
    expect(dateOnDay(new Date("2025-06-15T07:59:59Z"), DAY)).toBe(false));

  it("returns false when date is after the day", () =>
    expect(dateOnDay(new Date("2025-06-15T18:00:01Z"), DAY)).toBe(false));
});

// ── getPercentThroughDay ─────────────────────────────────────────────────────

describe("getPercentThroughDay", () => {
  const start = new Date("2025-06-15T08:00:00Z");
  const end = new Date("2025-06-15T18:00:00Z");

  it("returns 0% at the start", () =>
    expect(getPercentThroughDay(start, start, end)).toBe(0));

  it("returns 100% at the end", () =>
    expect(getPercentThroughDay(end, start, end)).toBe(100));

  it("returns 50% at the midpoint", () => {
    const mid = new Date("2025-06-15T13:00:00Z");
    expect(getPercentThroughDay(mid, start, end)).toBe(50);
  });
});

// ── getNumHalfHours ──────────────────────────────────────────────────────────

describe("getNumHalfHours", () => {
  it("0 when start equals end", () => {
    const t = new Date("2025-06-15T10:00:00Z");
    expect(getNumHalfHours(t, t)).toBe(0);
  });

  it("1 for a 30-minute window", () => {
    const start = new Date("2025-06-15T10:00:00Z");
    const end = new Date("2025-06-15T10:30:00Z");
    expect(getNumHalfHours(start, end)).toBe(1);
  });

  it("4 for a 2-hour window", () => {
    const start = new Date("2025-06-15T10:00:00Z");
    const end = new Date("2025-06-15T12:00:00Z");
    expect(getNumHalfHours(start, end)).toBe(4);
  });
});

// ── getStartTimePlusBreak ────────────────────────────────────────────────────

function makeSession(startTime: Date, endTime: Date): Session {
  return {
    id: "s1",
    title: "",
    description: "",
    capacity: 0,
    attendeeScheduled: true,
    blocker: false,
    closed: false,
    hosts: [],
    locations: [],
    numRsvps: 0,
    startTime,
    endTime,
    eventId: "111",
  };
}

describe("getStartTimePlusBreak", () => {
  it("adds a 10 minute break to the start", () => {
    const start = new Date("2025-06-15T10:00:00Z");
    const end = new Date("2025-06-15T11:00:00Z");
    const adjusted = getStartTimePlusBreak(makeSession(start, end), 10);
    expect(adjusted.toJSDate().getTime()).toBe(
      new Date("2025-06-15T10:10:00Z").getTime()
    );
  });

  it("adds a 5 minute break to the start", () => {
    const start = new Date("2025-06-15T10:00:00Z");
    const end = new Date("2025-06-15T11:30:00Z");
    const adjusted = getStartTimePlusBreak(makeSession(start, end), 5);
    expect(adjusted.toJSDate().getTime()).toBe(
      new Date("2025-06-15T10:05:00Z").getTime()
    );
  });
});
