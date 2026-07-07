import { describe, it, expect } from "vitest";
import { utcToZonedInput, zonedInputToUtc } from "@/utils/admin-datetime";

// ── utcToZonedInput ──────────────────────────────────────────────────────────

describe("utcToZonedInput", () => {
  it("converts a full UTC ISO string into the zone's datetime-local value", () =>
    expect(utcToZonedInput("2026-10-01T09:00:00.000Z", "Europe/Berlin")).toBe(
      "2026-10-01T11:00"
    ));

  it("keeps UTC values unchanged for the UTC zone", () =>
    expect(utcToZonedInput("2026-10-01T09:00:00.000Z", "UTC")).toBe(
      "2026-10-01T09:00"
    ));

  it("handles negative offsets crossing a date boundary", () =>
    expect(
      utcToZonedInput("2026-10-01T02:00:00.000Z", "America/New_York")
    ).toBe("2026-09-30T22:00"));

  it("applies DST-aware offsets (Berlin winter = +1)", () =>
    expect(utcToZonedInput("2026-01-15T09:00:00.000Z", "Europe/Berlin")).toBe(
      "2026-01-15T10:00"
    ));

  it("returns empty string for null/empty input", () => {
    expect(utcToZonedInput(null, "Europe/Berlin")).toBe("");
    expect(utcToZonedInput("", "Europe/Berlin")).toBe("");
  });

  it("falls back to UTC for an invalid timezone", () =>
    expect(utcToZonedInput("2026-10-01T09:00:00.000Z", "Not/AZone")).toBe(
      "2026-10-01T09:00"
    ));
});

// ── zonedInputToUtc ──────────────────────────────────────────────────────────

describe("zonedInputToUtc", () => {
  it("converts a zoned datetime-local value to a UTC datetime-local value", () =>
    expect(zonedInputToUtc("2026-10-01T11:00", "Europe/Berlin")).toBe(
      "2026-10-01T09:00"
    ));

  it("keeps UTC values unchanged for the UTC zone", () =>
    expect(zonedInputToUtc("2026-10-01T09:00", "UTC")).toBe(
      "2026-10-01T09:00"
    ));

  it("handles negative offsets crossing a date boundary", () =>
    expect(zonedInputToUtc("2026-09-30T22:00", "America/New_York")).toBe(
      "2026-10-01T02:00"
    ));

  it("returns empty string for empty input", () =>
    expect(zonedInputToUtc("", "Europe/Berlin")).toBe(""));

  it("returns empty string for an unparseable value", () =>
    expect(zonedInputToUtc("not-a-date", "Europe/Berlin")).toBe(""));

  it("falls back to UTC for an invalid timezone (round-trips with utcToZonedInput)", () =>
    expect(zonedInputToUtc("2026-10-01T09:00", "Not/AZone")).toBe(
      "2026-10-01T09:00"
    ));

  it("round-trips through utcToZonedInput across DST boundaries", () => {
    const utcIso = "2026-03-29T05:30:00.000Z";
    const zoned = utcToZonedInput(utcIso, "Europe/Berlin");
    expect(zonedInputToUtc(zoned, "Europe/Berlin")).toBe("2026-03-29T05:30");
  });
});
