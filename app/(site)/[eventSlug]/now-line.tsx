"use client";

// The red line marking the current time on the schedule grid. A day draws one
// segment per grid column — the time gutter plus every location — which line
// up into a single line across the day.

export function NowLine(props: {
  /** Offset from the top of the day's slot grid, from `getNowOffsetPx`. */
  offsetPx: number;
  /**
   * Marks the gutter's segment: the one "jump to now" scrolls to, and the one
   * tests address. It sticks to the left edge, so it is on screen however far
   * the grid is scrolled sideways — and being the only segment carrying the
   * id keeps the target unambiguous.
   */
  anchor?: boolean;
}) {
  return (
    <div
      data-testid={props.anchor ? "now-line" : undefined}
      aria-hidden="true"
      className="absolute inset-x-0 z-10 h-0.5 bg-danger pointer-events-none"
      style={{ top: props.offsetPx }}
    />
  );
}

/**
 * Scrolls the schedule so the now line sits a third from the top — far enough
 * down to keep the last session or two in sight, high enough for what is still
 * to come. A no-op when the line isn't rendered (the event isn't running) or
 * the schedule isn't the current view.
 */
export function scrollNowLineIntoView() {
  // The grid — pinned below the toolbar — is the page's only scroll surface.
  const container = document.querySelector('[data-testid="schedule-scroll"]');
  const line = document.querySelector('[data-testid="now-line"]');
  if (!container || !line) return;
  const containerTop = container.getBoundingClientRect().top;
  container.scrollTo({
    top:
      container.scrollTop +
      line.getBoundingClientRect().top -
      containerTop -
      container.clientHeight / 3,
    behavior: "smooth",
  });
}
