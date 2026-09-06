"use client";
import { useEffect, useRef, type RefObject } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const AXIS_PX = 8;
// Far enough that only a pull meant as one reaches it: panning the grid around
// starts the same way, and must never end in a reload.
const TRIGGER_PX = 90;
// The badge follows at half speed and stops here, short of the finger, so a
// pull that has arrived still looks like it has more to give.
const MAX_TRAVEL_PX = 64;

/**
 * The schedule's own pull-to-refresh. Its frame locks window scrolling (see
 * EventDisplay), and the browser's native gesture goes with it — there is no
 * scrollable body left for it to attach to — so the inner scroller grows one.
 */
export function PullToRefresh({
  scrollerRef,
}: {
  scrollerRef: RefObject<HTMLElement | null>;
}) {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const badge = badgeRef.current;
    if (!scroller || !badge) return;

    let start: { x: number; y: number } | null = null;
    let pulling = false;
    let pulled = 0;

    const onTouchStart = (e: TouchEvent) => {
      start =
        e.touches.length === 1 && scroller.scrollTop <= 0
          ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
          : null;
      pulling = false;
      pulled = 0;
      badge.style.transition = "none";
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!start) return;
      if (e.touches.length !== 1) {
        start = null;
        return;
      }
      const dx = e.touches[0].clientX - start.x;
      const dy = e.touches[0].clientY - start.y;
      if (!pulling) {
        if (Math.hypot(dx, dy) < AXIS_PX) return;
        if (dy <= Math.abs(dx) || scroller.scrollTop > 0) {
          start = null;
          return;
        }
        pulling = true;
      }
      pulled = dy;
      // Clamped: the finger can come back up past where it started, and a
      // badge driven straight off a negative dy flies off the top instead.
      const shown = Math.max(dy, 0);
      badge.style.transform = `translate(-50%, ${Math.min(shown / 2, MAX_TRAVEL_PX)}px)`;
      badge.style.opacity = String(Math.min(shown / TRIGGER_PX, 1));
      badge.toggleAttribute("data-armed", shown >= TRIGGER_PX);
      // Or the scroller rubber-bands away under the badge.
      if (e.cancelable) e.preventDefault();
    };

    const onTouchEnd = () => {
      const reload = pulling && pulled >= TRIGGER_PX;
      start = null;
      pulling = false;
      badge.style.transition = "transform 200ms ease-out, opacity 200ms";
      if (!reload) {
        badge.style.transform = "translate(-50%, 0)";
        badge.style.opacity = "0";
        badge.removeAttribute("data-armed");
        return;
      }
      badge.toggleAttribute("data-refreshing", true);
      badge.style.transform = `translate(-50%, ${MAX_TRAVEL_PX}px)`;
      location.reload();
    };

    const onTouchCancel = () => {
      pulled = 0;
      onTouchEnd();
    };

    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd);
    scroller.addEventListener("touchcancel", onTouchCancel);
    return () => {
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [scrollerRef]);

  return (
    <div
      ref={badgeRef}
      aria-hidden
      style={{ opacity: 0, transform: "translate(-50%, 0)" }}
      className="group pointer-events-none absolute left-1/2 top-1 z-30 rounded-full border border-line bg-surface-raised p-2 text-fg-subtle shadow-sm data-[armed]:text-brand-fg data-[refreshing]:text-brand-fg"
    >
      <ArrowPathIcon className="h-5 w-5 group-data-[refreshing]:animate-spin" />
    </div>
  );
}
