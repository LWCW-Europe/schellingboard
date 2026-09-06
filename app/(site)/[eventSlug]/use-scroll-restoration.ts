"use client";
import { useLayoutEffect, type RefObject } from "react";

const STORAGE_PREFIX = "schedule-scroll:";

/**
 * Keeps a scroll container's position across remounts within the tab. The
 * schedule unmounts whenever the reader leaves it (to add or edit a session,
 * say) and mounts fresh on their return, which would otherwise land them at
 * the top-left corner of a large grid. Restored in a layout effect so the
 * corner never flashes by. sessionStorage rather than localStorage so a new
 * tab still starts at the top.
 */
export function useScrollRestoration(
  ref: RefObject<HTMLElement | null>,
  key: string
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const storageKey = STORAGE_PREFIX + key;

    const saved = readPosition(storageKey);
    if (saved) {
      el.scrollLeft = saved.left;
      el.scrollTop = saved.top;
    }

    const onScroll = () =>
      writePosition(storageKey, { left: el.scrollLeft, top: el.scrollTop });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref, key]);
}

type Position = { left: number; top: number };

// Storage can be missing or refuse writes (private mode, quota, disabled by
// policy); losing the reader's place is a fine outcome, throwing is not.
function readPosition(key: string): Position | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as Position).left === "number" &&
      typeof (parsed as Position).top === "number"
    ) {
      return parsed as Position;
    }
    return null;
  } catch {
    return null;
  }
}

function writePosition(key: string, position: Position) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(position));
  } catch {
    // ignored, see above
  }
}
