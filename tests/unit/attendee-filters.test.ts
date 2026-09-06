import { describe, it, expect } from "vitest";

import {
  parseAttendeeFilters,
  serializeAttendeeFilters,
} from "@/utils/attendee-filters";

describe("attendee filters", () => {
  it("reads several active filters from one param", () => {
    expect(parseAttendeeFilters("isHost,hasProfile")).toEqual([
      "isHost",
      "hasProfile",
    ]);
  });

  it("drops unknown and duplicate values instead of rejecting the URL", () => {
    expect(parseAttendeeFilters("hasProfile,bogus,hasProfile")).toEqual([
      "hasProfile",
    ]);
    expect(parseAttendeeFilters(undefined)).toEqual([]);
  });

  it("serializes in a fixed order, so the same view is always the same URL", () => {
    expect(
      serializeAttendeeFilters(["openToMeetings", "hasProfile", "isHost"])
    ).toBe("isHost,hasProfile,openToMeetings");
    expect(serializeAttendeeFilters(["hasProfile", "isHost"])).toBe(
      "isHost,hasProfile"
    );
    expect(serializeAttendeeFilters([])).toBe(null);
  });
});
