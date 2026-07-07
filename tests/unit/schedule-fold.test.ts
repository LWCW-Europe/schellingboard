import { describe, it, expect } from "vitest";
import { getDefaultFoldedDayIds } from "@/utils/schedule-fold";

function day(id: string, start: string, end: string) {
  return { id, start: new Date(start), end: new Date(end) };
}

const now = new Date("2026-07-07T12:00:00Z");

describe("getDefaultFoldedDayIds", () => {
  it("folds days that have fully passed", () => {
    const days = [
      day("d1", "2026-07-05T09:00:00Z", "2026-07-05T18:00:00Z"),
      day("d2", "2026-07-06T09:00:00Z", "2026-07-06T18:00:00Z"),
      day("d3", "2026-07-08T09:00:00Z", "2026-07-08T18:00:00Z"),
    ];
    expect(getDefaultFoldedDayIds(days, now)).toEqual(new Set(["d1", "d2"]));
  });

  it("does not fold the day currently in progress", () => {
    const days = [
      day("d1", "2026-07-07T09:00:00Z", "2026-07-07T18:00:00Z"),
      day("d2", "2026-07-08T09:00:00Z", "2026-07-08T18:00:00Z"),
    ];
    expect(getDefaultFoldedDayIds(days, now)).toEqual(new Set());
  });

  it("folds nothing when all days are in the future", () => {
    const days = [day("d1", "2026-07-08T09:00:00Z", "2026-07-08T18:00:00Z")];
    expect(getDefaultFoldedDayIds(days, now)).toEqual(new Set());
  });

  it("folds nothing when the whole event has passed", () => {
    const days = [
      day("d1", "2026-07-01T09:00:00Z", "2026-07-01T18:00:00Z"),
      day("d2", "2026-07-02T09:00:00Z", "2026-07-02T18:00:00Z"),
    ];
    expect(getDefaultFoldedDayIds(days, now)).toEqual(new Set());
  });

  it("folds nothing for an empty day list", () => {
    expect(getDefaultFoldedDayIds([], now)).toEqual(new Set());
  });
});
