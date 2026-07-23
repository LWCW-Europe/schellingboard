"use client";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Kiosk mode (?kiosk=1) is for unattended large screens at the venue: a red
// line marks the current time on the grid and is scrolled into view at
// regular intervals. All normal interaction stays available so visitors
// without a phone can still RSVP or add sessions from the display.

/** How often the schedule is scrolled back to the now line. */
const SCROLL_INTERVAL_MS = 3 * 60 * 1000;
/** First scroll after load, once the grid and now line have rendered. */
const INITIAL_SCROLL_DELAY_MS = 1000;
/** Someone is using the display — don't yank the schedule away from them. */
const INTERACTION_IDLE_MS = 60 * 1000;
/** How often the event data is refetched so the display never goes stale. */
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

/** Cookie that lets kiosk mode survive navigation once ?kiosk=1 has set it. */
const KIOSK_COOKIE_NAME = "kiosk";
const KIOSK_COOKIE_MAX_AGE_SEC = 365 * 24 * 60 * 60;

function hasKioskCookie(): boolean {
  return document.cookie
    .split("; ")
    .some((entry) => entry.split("=")[0] === KIOSK_COOKIE_NAME);
}

// The cookie is only ever written by this hook (never by another tab we need
// to react to live), so subscribing is a no-op; the value is re-read on every
// render a ?kiosk change or navigation already triggers.
const subscribeKioskCookie = () => () => {};

/**
 * Kiosk mode is entered via ?kiosk=1 and left via ?kiosk=0; a cookie makes it
 * stick across navigation the rest of the time, so a kiosk display doesn't
 * fall out of kiosk mode just because a visitor clicked a link.
 */
export function useKioskMode(): boolean {
  const searchParams = useSearchParams();
  const param = searchParams?.get("kiosk") ?? null;

  useEffect(() => {
    if (param === "0") {
      document.cookie = `${KIOSK_COOKIE_NAME}=; path=/; max-age=0`;
    } else if (param != null) {
      document.cookie = `${KIOSK_COOKIE_NAME}=1; path=/; max-age=${KIOSK_COOKIE_MAX_AGE_SEC}`;
    }
  }, [param]);

  // The cookie can't be read during render on the server, so report false for
  // SSR and the first hydration pass; useSyncExternalStore then re-reads it on
  // the client. Only consulted when the URL carries no ?kiosk parameter.
  const cookieEnabled = useSyncExternalStore(
    subscribeKioskCookie,
    hasKioskCookie,
    () => false
  );

  if (param === "0") return false;
  if (param != null) return true;
  return cookieEnabled;
}

/**
 * Renderless controller for the kiosk behaviors that act on the page as a
 * whole: periodic data refresh, keeping the screen awake, and scrolling the
 * schedule back to the now line.
 */
export function KioskController() {
  const router = useRouter();

  // Kiosk screens stay open for days while organizers move sessions around;
  // without this the display would show the schedule as of page load.
  useEffect(() => {
    const id = setInterval(() => router.refresh(), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [router]);

  // Keep the screen awake where the Wake Lock API is available; elsewhere the
  // device's display settings have to allow for it.
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    let disposed = false;
    const acquire = () => {
      navigator.wakeLock
        ?.request("screen")
        .then((sentinel) => {
          if (disposed) void sentinel.release().catch(() => undefined);
          else lock = sentinel;
        })
        .catch(() => undefined); // unsupported or denied — not fatal
    };
    acquire();
    // The lock is released whenever the tab is hidden; take it again.
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") acquire();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void lock?.release().catch(() => undefined);
    };
  }, []);

  // Periodically bring the now line back into view: scroll the grid — pinned
  // below the toolbar, it is the page's only scroll surface — so the line
  // sits a third from the top. Paused while someone is interacting with the
  // display.
  useEffect(() => {
    let lastInteraction = -Infinity;
    const markInteraction = () => {
      lastInteraction = Date.now();
    };
    const interactionEvents = [
      "pointerdown",
      "wheel",
      "touchstart",
      "keydown",
    ] as const;
    for (const name of interactionEvents) {
      document.addEventListener(name, markInteraction, { passive: true });
    }

    const scrollToNow = () => {
      if (Date.now() - lastInteraction < INTERACTION_IDLE_MS) return;
      const container = document.querySelector(
        '[data-testid="schedule-scroll"]'
      );
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
    };

    const initial = setTimeout(scrollToNow, INITIAL_SCROLL_DELAY_MS);
    const interval = setInterval(scrollToNow, SCROLL_INTERVAL_MS);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
      for (const name of interactionEvents) {
        document.removeEventListener(name, markInteraction);
      }
    };
  }, []);

  return null;
}
