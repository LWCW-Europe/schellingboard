import { describe, it, expect } from "vitest";

import {
  startSwipe,
  swipeCommit,
  swipeOffset,
  trackSwipe,
  type Swipe,
} from "@/app/(site)/guests/swipe";

const BOTH_WAYS = { canPrev: true, canNext: true };
const WIDTH = 400;

function drag(from: [number, number], ...to: [number, number][]): Swipe {
  const start = startSwipe({ clientX: from[0], clientY: from[1] });
  if (!start) throw new Error("gesture was refused");
  return to.reduce(
    (swipe, [clientX, clientY]) => trackSwipe(swipe, { clientX, clientY }),
    start
  );
}

describe("profile swipe", () => {
  it("ignores gestures starting at the left edge, where the back gesture lives", () => {
    expect(startSwipe({ clientX: 8, clientY: 300 })).toBeNull();
    expect(startSwipe({ clientX: 40, clientY: 300 })).not.toBeNull();
  });

  it("commits to one axis and stays there, so a scroll never becomes a drag", () => {
    // Mostly vertical at the moment the lock is decided…
    const scroll = drag([200, 300], [206, 314], [80, 320]);
    expect(scroll.axis).toBe("y");
    // …so the later horizontal sweep moves nothing and navigates nowhere.
    expect(swipeOffset(scroll, BOTH_WAYS)).toBe(0);
    expect(swipeCommit(scroll, WIDTH, BOTH_WAYS)).toBe(0);
  });

  it("waits for the finger to leave the deadzone before deciding", () => {
    const undecided = drag([200, 300], [204, 302]);
    expect(undecided.axis).toBe("undecided");
    expect(swipeOffset(undecided, BOTH_WAYS)).toBe(0);
  });

  it("tracks the finger once locked horizontally", () => {
    const swipe = drag([200, 300], [186, 302], [80, 306]);
    expect(swipe.axis).toBe("x");
    expect(swipeOffset(swipe, BOTH_WAYS)).toBe(-120);
  });

  it("moves on past a quarter of the width, and snaps back below it", () => {
    const short = drag([200, 300], [180, 300], [130, 300]);
    expect(swipeCommit(short, WIDTH, BOTH_WAYS)).toBe(0);

    const next = drag([200, 300], [180, 300], [80, 300]);
    expect(swipeCommit(next, WIDTH, BOTH_WAYS)).toBe(1);

    const prev = drag([200, 300], [220, 300], [320, 300]);
    expect(swipeCommit(prev, WIDTH, BOTH_WAYS)).toBe(-1);
  });

  it("rubber-bands at the ends of the collection instead of moving on", () => {
    const past = drag([200, 300], [180, 300], [-100, 300]);
    const ends = { canPrev: true, canNext: false };
    const offset = swipeOffset(past, ends);
    expect(offset).toBeLessThan(0);
    expect(offset).toBeGreaterThan(-300 / 2);
    expect(swipeCommit(past, WIDTH, ends)).toBe(0);
    // The other direction is unaffected: only the missing end resists.
    expect(swipeOffset(past, BOTH_WAYS)).toBe(-300);
  });
});
