import { describe, it, expect } from "vitest";

import { formatRelativeTime } from "@/utils/relative-time";

const NOW = new Date("2026-03-15T12:00:00Z");
const ago = (ms: number) => new Date(NOW.getTime() - ms);

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("formatRelativeTime", () => {
  it("collapses anything under a minute to 'just now'", () => {
    expect(formatRelativeTime(ago(20 * SECOND), NOW)).toBe("just now");
  });

  it("counts minutes, hours and days", () => {
    expect(formatRelativeTime(ago(5 * MINUTE), NOW)).toBe("5 minutes ago");
    expect(formatRelativeTime(ago(3 * HOUR), NOW)).toBe("3 hours ago");
    expect(formatRelativeTime(ago(3 * DAY), NOW)).toBe("3 days ago");
  });

  it("names yesterday, last month and last year", () => {
    expect(formatRelativeTime(ago(DAY), NOW)).toBe("yesterday");
    expect(formatRelativeTime(ago(45 * DAY), NOW)).toBe("last month");
    expect(formatRelativeTime(ago(400 * DAY), NOW)).toBe("last year");
  });

  it("treats a timestamp in the future as just now", () => {
    // The two clocks involved (the server that wrote it, the server that
    // renders) can disagree; "in 2 minutes" would be nonsense to the reader.
    expect(formatRelativeTime(ago(-2 * MINUTE), NOW)).toBe("just now");
  });
});
