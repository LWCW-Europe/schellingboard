import { describe, it, expect } from "vitest";
import { meetingSlotsForDay } from "@/utils/meeting-slots";

const DAY = {
  start: new Date("2026-09-11T07:00:00.000Z"),
  end: new Date("2026-09-11T16:00:00.000Z"),
};

const times = (slots: { start: Date; end: Date }[]) =>
  slots.map((s) => `${s.start.toISOString()}/${s.end.toISOString()}`);

describe("meetingSlotsForDay", () => {
  it("fills the whole day", () => {
    const slots = meetingSlotsForDay(DAY, 30);

    expect(slots).toHaveLength(18);
    expect(slots[0].start.toISOString()).toBe("2026-09-11T07:00:00.000Z");
    expect(slots[0].end.toISOString()).toBe("2026-09-11T07:30:00.000Z");
    expect(slots.at(-1)?.end.toISOString()).toBe("2026-09-11T16:00:00.000Z");
  });

  it("steps by the event's schedule increment", () => {
    const slots = meetingSlotsForDay(DAY, 60);

    expect(slots).toHaveLength(9);
    expect(slots[1].start.toISOString()).toBe("2026-09-11T08:00:00.000Z");
  });

  // The grid is anchored at the day's start, which is what makes a coarser
  // increment dangerous rather than harmless: half the old rows land on it.
  it("anchors on the day's start, whatever the increment", () => {
    const half = meetingSlotsForDay(DAY, 30).map((s) => s.start.getTime());
    const whole = meetingSlotsForDay(DAY, 60).map((s) => s.start.getTime());

    expect(whole.every((t) => half.includes(t))).toBe(true);
  });

  it("drops a trailing slot the day cannot fit whole", () => {
    const slots = meetingSlotsForDay(
      {
        start: new Date("2026-09-11T07:00:00.000Z"),
        end: new Date("2026-09-11T08:20:00.000Z"),
      },
      30
    );

    expect(times(slots)).toEqual([
      "2026-09-11T07:00:00.000Z/2026-09-11T07:30:00.000Z",
      "2026-09-11T07:30:00.000Z/2026-09-11T08:00:00.000Z",
    ]);
  });

  // A day may run Friday 09:00 to Saturday 03:00; slots simply carry on.
  it("runs straight through a day that crosses midnight", () => {
    const slots = meetingSlotsForDay(
      {
        start: new Date("2026-09-11T20:00:00.000Z"),
        end: new Date("2026-09-12T01:00:00.000Z"),
      },
      60
    );

    expect(slots).toHaveLength(5);
    expect(slots.at(-1)?.end.toISOString()).toBe("2026-09-12T01:00:00.000Z");
  });

  it("offers nothing for a day shorter than one slot", () => {
    const slots = meetingSlotsForDay(
      {
        start: new Date("2026-09-11T07:00:00.000Z"),
        end: new Date("2026-09-11T07:20:00.000Z"),
      },
      30
    );

    expect(slots).toEqual([]);
  });
});
