import { describe, it, expect } from "vitest";
import { formatInLocalZone } from "@/utils/utils";

const INSTANT = new Date("2026-07-28T17:13:00.000Z");

describe("formatInLocalZone", () => {
  it("uses the event's zone before the viewer's is known", () => {
    expect(formatInLocalZone(INSTANT, "Europe/Berlin", null)).toBe(
      "19:13 - 28 Jul"
    );
  });

  it("names no zone when the viewer shares the event's offset", () => {
    expect(formatInLocalZone(INSTANT, "Europe/Berlin", "Europe/Berlin")).toBe(
      "19:13 - 28 Jul"
    );
  });

  it("stays quiet for a different zone on the same offset", () => {
    expect(formatInLocalZone(INSTANT, "Europe/Berlin", "Europe/Paris")).toBe(
      "19:13 - 28 Jul"
    );
  });

  it("shows the viewer's time and names the zone when offsets differ", () => {
    const shown = formatInLocalZone(INSTANT, "Europe/Berlin", "Europe/Sofia");
    expect(shown).toMatch(/^20:13 - 28 Jul \S/);
  });

  it("names the zone across a date boundary", () => {
    const shown = formatInLocalZone(
      new Date("2026-07-28T23:30:00.000Z"),
      "Europe/Berlin",
      "Pacific/Auckland"
    );
    expect(shown).toMatch(/^11:30 - 29 Jul \S/);
  });
});
