"use client";
import { useEffect, type RefObject } from "react";

// Movement below this many px stays a click; beyond it the press becomes a
// pan and the eventual click is swallowed.
const DRAG_THRESHOLD_PX = 5;

/**
 * Maps-style drag-to-pan: pressing the mouse anywhere on the container and
 * moving pans it in both axes. Presses on form controls are left alone, and
 * clicks (on sessions, links, …) keep working — only after a real drag is the
 * resulting click suppressed. Touch devices pan natively and are not handled.
 */
export function useDragToPan(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean
) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    let start: {
      x: number;
      y: number;
      left: number;
      top: number;
    } | null = null;
    let dragged = false;
    // Set on mouseup after a drag, so the click that follows (even one that
    // lands outside `el`, e.g. because the drag ended over the nav bar) is
    // swallowed. Cleared on a timeout rather than by that click itself, since
    // a click doesn't always follow (see mouseup below).
    let suppressNextClick = false;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if ((e.target as Element).closest("button, input, select, textarea")) {
        return;
      }
      start = {
        x: e.clientX,
        y: e.clientY,
        left: el.scrollLeft,
        top: el.scrollTop,
      };
      dragged = false;
      // Prevents text selection while panning; clicks still fire on mouseup.
      e.preventDefault();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!start) return;
      // Releasing the button outside the window never fires mouseup; without
      // this check the pan would resume following the (no longer pressed)
      // pointer when it re-enters. No click follows, so nothing to suppress.
      if ((e.buttons & 1) === 0) {
        start = null;
        dragged = false;
        el.classList.remove("cursor-grabbing");
        return;
      }
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!dragged && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
      dragged = true;
      el.classList.add("cursor-grabbing");
      el.scrollLeft = start.left - dx;
      el.scrollTop = start.top - dy;
    };
    const onMouseUp = () => {
      start = null;
      el.classList.remove("cursor-grabbing");
      if (dragged) {
        suppressNextClick = true;
        setTimeout(() => {
          suppressNextClick = false;
        }, 0);
      }
      dragged = false;
    };
    // After a drag the browser still fires a click on the common ancestor of
    // the mousedown/mouseup targets — swallow it so panning never activates
    // whatever the pointer happens to end up on.
    const onClickCapture = (e: MouseEvent) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("click", onClickCapture, true);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [ref, enabled]);
}
