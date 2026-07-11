import { describe, it, expect } from "vitest";
import { isBookableSlot } from "@/utils/session-bookable";

const baseParams = {
  isBlank: true,
  locationBookable: true,
  blocker: false,
  startTime: new Date("2026-07-11T10:00:00Z").getTime(),
  now: new Date("2026-07-11T09:00:00Z").getTime(),
  startBookings: new Date("2026-07-11T00:00:00Z").getTime(),
  endBookings: new Date("2026-07-11T23:59:00Z").getTime(),
};

describe("isBookableSlot", () => {
  it("is bookable when the slot is blank, in a bookable location, and in the future", () => {
    expect(isBookableSlot(baseParams)).toBe(true);
  });

  it("is not bookable once the slot's start time has passed", () => {
    expect(
      isBookableSlot({ ...baseParams, now: baseParams.startTime + 1 })
    ).toBe(false);
  });

  it("is not bookable when the slot has a title", () => {
    expect(isBookableSlot({ ...baseParams, isBlank: false })).toBe(false);
  });

  it("is not bookable when the location isn't bookable", () => {
    expect(isBookableSlot({ ...baseParams, locationBookable: false })).toBe(
      false
    );
  });

  it("is not bookable when the slot is a blocker", () => {
    expect(isBookableSlot({ ...baseParams, blocker: true })).toBe(false);
  });

  it("is not bookable before the day's booking window opens", () => {
    expect(
      isBookableSlot({ ...baseParams, startBookings: baseParams.startTime + 1 })
    ).toBe(false);
  });

  it("is not bookable at or after the day's booking window closes", () => {
    expect(
      isBookableSlot({ ...baseParams, endBookings: baseParams.startTime })
    ).toBe(false);
  });
});
