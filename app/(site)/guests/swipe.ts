/**
 * The finger side of reading through profiles: a horizontal drag moves to the
 * neighbouring profile, and everything else is left to the browser.
 *
 * Kept as plain values so the awkward parts — deciding a scroll from a swipe,
 * and refusing to move past the ends — are decided once and testable without a
 * touchscreen.
 */

export type SwipePoint = { clientX: number; clientY: number };

/** Which neighbours exist, so the ends of the collection can resist. */
export type SwipeEnds = { canPrev: boolean; canNext: boolean };

export type Swipe = {
  startX: number;
  startY: number;
  axis: "undecided" | "x" | "y";
  /** Undamped travel from the start of the gesture; positive is rightwards. */
  dx: number;
};

/**
 * iOS Safari's back gesture starts here, and a profile that slid sideways under
 * a browser-back would be two navigations at once.
 */
const EDGE_GUARD_PX = 25;

/** How far the finger must travel before the gesture is called a direction. */
const LOCK_PX = 10;

/** Share of the width that has to be dragged for the next profile to stick. */
const COMMIT_FRACTION = 0.25;

/** At the ends there is nothing to drag in, so the drag only hints at that. */
const RUBBER_BAND = 0.3;

export function startSwipe(point: SwipePoint): Swipe | null {
  if (point.clientX < EDGE_GUARD_PX) return null;
  return {
    startX: point.clientX,
    startY: point.clientY,
    axis: "undecided",
    dx: 0,
  };
}

export function trackSwipe(swipe: Swipe, point: SwipePoint): Swipe {
  const dx = point.clientX - swipe.startX;
  const dy = point.clientY - swipe.startY;
  // Decided once and then kept: re-deciding mid-gesture means every diagonal
  // scroll flickers between scrolling and dragging.
  const axis =
    swipe.axis !== "undecided"
      ? swipe.axis
      : Math.max(Math.abs(dx), Math.abs(dy)) < LOCK_PX
        ? "undecided"
        : Math.abs(dx) > Math.abs(dy)
          ? "x"
          : "y";
  return { ...swipe, axis, dx };
}

/** How far the profile has followed the finger, in pixels. */
export function swipeOffset(swipe: Swipe, ends: SwipeEnds): number {
  if (swipe.axis !== "x") return 0;
  return pulling(swipe, ends) ? swipe.dx : swipe.dx * RUBBER_BAND;
}

/** Which way to move on when the finger lifts: -1 previous, 1 next, 0 stay. */
export function swipeCommit(
  swipe: Swipe,
  width: number,
  ends: SwipeEnds
): -1 | 0 | 1 {
  if (swipe.axis !== "x" || !pulling(swipe, ends)) return 0;
  if (Math.abs(swipe.dx) < width * COMMIT_FRACTION) return 0;
  return swipe.dx < 0 ? 1 : -1;
}

/** Whether there is a profile in the direction the finger is going. */
function pulling(swipe: Swipe, ends: SwipeEnds): boolean {
  return swipe.dx < 0 ? ends.canNext : ends.canPrev;
}

/** One card's slide between profiles: following a finger, or finishing one. */
export type Slide =
  | { phase: "tracking"; swipe: Swipe; arming?: true }
  | { phase: "settling"; offset: number; commit: -1 | 0 | 1 };

/**
 * What a Prev/Next press means for a slide that may already be running.
 * Already headed there: nothing — restarting would snap the card backwards
 * and delay the arrival it is most of the way through. Moving otherwise:
 * retarget from wherever the card is, which the neighbours being on screen
 * allows. From rest: mount the neighbours first.
 */
export function pressSlide(
  slide: Slide | null,
  dir: 1 | -1,
  width: number
):
  | { kind: "arrived" }
  | { kind: "slide"; offset: number; commit: -1 | 0 | 1 }
  | { kind: "arm" } {
  if (slide?.phase === "settling" && slide.commit === dir)
    return { kind: "arrived" };
  if (slide) return { kind: "slide", offset: -dir * width, commit: dir };
  return { kind: "arm" };
}

/**
 * A finger landing on a card that is settling takes the gesture over from
 * where the card visibly is, instead of snapping it back to rest. Seeded
 * with the travel it inherits, and locked to the x axis: telling a scroll
 * from a swipe is a decision for gestures that start at rest.
 */
export function catchSwipe(point: SwipePoint, offsetPx: number): Swipe {
  return {
    startX: point.clientX - offsetPx,
    startY: point.clientY,
    axis: "x",
    dx: offsetPx,
  };
}
