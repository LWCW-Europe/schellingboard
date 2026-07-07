import { describe, it, expect } from "vitest";
import {
  SLOT_INCREMENT_OPTIONS,
  SLOT_HEIGHT_PX,
  isValidSlotIncrement,
  getNumSlots,
  getNowOffsetPx,
  isSlotAligned,
  slotDurationOptions,
  snapDurationToSlots,
} from "@/utils/slots";

// ── isValidSlotIncrement ─────────────────────────────────────────────────────

describe("isValidSlotIncrement", () => {
  it("accepts each allowed option", () => {
    for (const inc of SLOT_INCREMENT_OPTIONS) {
      expect(isValidSlotIncrement(inc)).toBe(true);
    }
  });

  it("rejects other values", () => {
    expect(isValidSlotIncrement(20)).toBe(false);
    expect(isValidSlotIncrement(0)).toBe(false);
    expect(isValidSlotIncrement(-30)).toBe(false);
    expect(isValidSlotIncrement(90)).toBe(false);
  });
});

// ── getNumSlots ──────────────────────────────────────────────────────────────

describe("getNumSlots", () => {
  const at = (h: number, m = 0) => new Date(Date.UTC(2026, 8, 1, h, m));

  it("2 hours at 30 min → 4 slots", () => {
    expect(getNumSlots(at(9), at(11), 30)).toBe(4);
  });

  it("2 hours at 15 min → 8 slots", () => {
    expect(getNumSlots(at(9), at(11), 15)).toBe(8);
  });

  it("9:00–18:00 at 45 min → 12 slots", () => {
    expect(getNumSlots(at(9), at(18), 45)).toBe(12);
  });

  it("zero-length window → 0 slots", () => {
    expect(getNumSlots(at(9), at(9), 30)).toBe(0);
  });

  it("rounds a misaligned window up so it still renders", () => {
    expect(getNumSlots(at(9), at(17), 45)).toBe(11); // 480 min / 45 = 10.67
  });
});

// ── getNowOffsetPx ───────────────────────────────────────────────────────────

describe("getNowOffsetPx", () => {
  const at = (h: number, m = 0) => new Date(Date.UTC(2026, 8, 1, h, m));
  const day = { start: at(9), end: at(18) };

  it("day start → 0", () => {
    expect(getNowOffsetPx(day, at(9), 30)).toBe(0);
  });

  it("one slot in → one slot height", () => {
    expect(getNowOffsetPx(day, at(9, 30), 30)).toBe(SLOT_HEIGHT_PX);
    expect(getNowOffsetPx(day, at(9, 15), 15)).toBe(SLOT_HEIGHT_PX);
  });

  it("interpolates within a slot", () => {
    expect(getNowOffsetPx(day, at(9, 15), 30)).toBe(SLOT_HEIGHT_PX / 2);
  });

  it("before the day window → null", () => {
    expect(getNowOffsetPx(day, at(8, 59), 30)).toBeNull();
  });

  it("at or after the day end → null", () => {
    expect(getNowOffsetPx(day, at(18), 30)).toBeNull();
    expect(getNowOffsetPx(day, at(23), 30)).toBeNull();
  });
});

// ── isSlotAligned ────────────────────────────────────────────────────────────

describe("isSlotAligned", () => {
  const anchor = new Date(Date.UTC(2026, 8, 1, 9, 0));
  const at = (h: number, m = 0) => new Date(Date.UTC(2026, 8, 1, h, m));

  it("anchor itself is aligned", () => {
    expect(isSlotAligned(anchor, anchor, 45)).toBe(true);
  });

  it("whole multiples of the increment are aligned", () => {
    expect(isSlotAligned(at(9, 45), anchor, 45)).toBe(true);
    expect(isSlotAligned(at(11, 15), anchor, 45)).toBe(true);
    expect(isSlotAligned(at(10, 0), anchor, 30)).toBe(true);
  });

  it("off-grid times are not aligned", () => {
    expect(isSlotAligned(at(9, 30), anchor, 45)).toBe(false);
    expect(isSlotAligned(at(10, 10), anchor, 30)).toBe(false);
  });
});

// ── slotDurationOptions ──────────────────────────────────────────────────────

describe("slotDurationOptions", () => {
  it("multiples of 30 up to 120", () => {
    expect(slotDurationOptions(30, 120)).toEqual([30, 60, 90, 120]);
  });

  it("multiples of 45 up to 120 stop at 90", () => {
    expect(slotDurationOptions(45, 120)).toEqual([45, 90]);
  });

  it("max below the increment still offers one slot", () => {
    expect(slotDurationOptions(45, 30)).toEqual([45]);
  });
});

// ── snapDurationToSlots ──────────────────────────────────────────────────────

describe("snapDurationToSlots", () => {
  it("exact multiples pass through", () => {
    expect(snapDurationToSlots(90, 45, 180)).toBe(90);
    expect(snapDurationToSlots(60, 30, 120)).toBe(60);
  });

  it("snaps to the nearest option: 60 → 45 with 45-min slots", () => {
    expect(snapDurationToSlots(60, 45, 180)).toBe(45);
  });

  it("snaps to the nearest option: 70 → 90 with 45-min slots", () => {
    expect(snapDurationToSlots(70, 45, 180)).toBe(90);
  });

  it("ties round up: 45 → 60 with 30-min slots", () => {
    expect(snapDurationToSlots(45, 30, 120)).toBe(60);
  });

  it("clamps to the largest option when the duration exceeds it", () => {
    expect(snapDurationToSlots(500, 45, 120)).toBe(90);
  });

  it("clamps up to one slot for tiny durations", () => {
    expect(snapDurationToSlots(5, 45, 180)).toBe(45);
  });
});
