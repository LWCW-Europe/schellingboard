"use client";

import type { MouseEvent } from "react";

/*
When we click on a session in the schedule, the app shows a modal with the session details.
Additionally, it pushes a new session-specific URL.
The reason for pushing rather than replacing is so that browser back button dismiss the modal.

What should happen when the user dimisses the modal by clicking the close button or
by clicking outside of the modal?
Same: browser back, via History API.

However, suppose the session-specific page was opened directly via a link.
In that case, there is no "previous page" to go back to,
so the user should be taken to the schedule page instead,
which is the same as removing the session-specific query param from the URL.
*/

export type ViewSessionLinkProps = {
  href: string;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  prefetch: false;
  scroll: false;
};

export function viewSessionLinkProps(
  currentSearchParams: URLSearchParams,
  eventSlug: string,
  sessionId: string
): ViewSessionLinkProps {
  const params = new URLSearchParams(currentSearchParams);
  params.set("viewSession", sessionId);
  const href = `/${eventSlug}?${params.toString()}`;
  return {
    href,
    prefetch: false,
    scroll: false,
    onClick: (e) => {
      // Mirror next/link's own modifier-key check so plain clicks open the
      // modal in place, but Cmd/Ctrl/Shift/middle clicks fall through to the
      // browser's normal "open in new tab/window" behavior.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      e.preventDefault();
      // Why window.history.pushState/replaceState instead of next/navigation's router?
      // We want the modal to open instantly, without an RSC roundtrip.
      // https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api
      window.history.pushState(null, "", href);
      openedByPush = true;
    },
  };
}

export function dismissViewSession(): void {
  if (openedByPush) {
    window.history.back();
    return;
  }
  const params = new URLSearchParams(window.location.search);
  params.delete("viewSession");
  const query = params.toString();
  const url = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState(null, "", url);
}

// Using module-level variable rather than useState/useRef,
// because it has to survive across the parent re-render triggered by navigation,
// and it isn't part of any component's render output.
let openedByPush = false;
