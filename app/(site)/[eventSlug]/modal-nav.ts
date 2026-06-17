"use client";

import type { MouseEvent } from "react";
import type { useRouter } from "next/navigation";

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

To summarize:
* When linking the details modal from its owning page (proposal from the proposals list,
  session from the schedule), use `<Link {...viewFooLinkFromOwner(...)}>`. It intercepts the
  navigation to set dismiss mode to "back".
* When linking from a different page, use `<Link {...viewFooLinkFromElsewhere(...)}>`. There is no
  in-place open and no history entry of ours to pop, so it sets the dismiss mode to "replace".

*/

export function viewSessionLinkFromOwner(
  currentSearchParams: URLSearchParams,
  eventSlug: string,
  sessionId: string
) {
  const params = new URLSearchParams(currentSearchParams);
  params.set("viewSession", sessionId);
  const href = `/${eventSlug}?${params.toString()}`;
  return {
    href,
    prefetch: false,
    scroll: false,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainLeftClick(e)) return;
      e.preventDefault();
      // Why window.history.pushState/replaceState instead of next/navigation's router?
      // We want the modal to open instantly, without an RSC roundtrip.
      // https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api
      window.history.pushState(null, "", href);
      sessionDismissMode = "back";
    },
  };
}

export function viewSessionLinkFromElsewhere(
  eventSlug: string,
  sessionId: string
) {
  return {
    href: `/${eventSlug}?viewSession=${sessionId}`,
    onClick: () => {
      sessionDismissMode = "replace";
    },
  };
}

export function viewProposalLinkFromOwner(
  eventSlug: string,
  proposalId: string
) {
  const href = `/${eventSlug}/proposals?viewProposal=${proposalId}`;
  return {
    href,
    prefetch: false,
    scroll: false,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainLeftClick(e)) return;
      proposalDismissMode = "back";
      // no pushState here — unlike session modal, proposal modal is RSC-rendered, so we want normal navigation
    },
  };
}

export function viewProposalLinkFromElsewhere(
  eventSlug: string,
  proposalId: string
) {
  return {
    href: `/${eventSlug}/proposals?viewProposal=${proposalId}`,
    onClick: () => {
      proposalDismissMode = "replace";
    },
  };
}

export function dismissViewProposal(router: ReturnType<typeof useRouter>) {
  if (proposalDismissMode === "back") {
    router.back();
    return;
  }
  const params = new URLSearchParams(window.location.search);
  params.delete("viewProposal");
  const query = params.toString();
  const url = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  router.replace(url, { scroll: false });
}

export function dismissViewSession() {
  if (sessionDismissMode === "back") {
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

// Mirror next/link's own modifier-key check so plain clicks are handled in
// place, but Cmd/Ctrl/Shift/middle clicks fall through to the browser's normal
// "open in new tab/window" behavior.
function isPlainLeftClick(e: MouseEvent<HTMLAnchorElement>) {
  return (
    !e.defaultPrevented &&
    e.button === 0 &&
    !e.metaKey &&
    !e.ctrlKey &&
    !e.shiftKey &&
    !e.altKey
  );
}

// Using module-level variables rather than useState/useRef,
// because it has to survive across the parent re-render triggered by navigation,
// and it isn't part of any component's render output.
//
// Every opener (viewFooLinkFromOwner / viewFooLinkFromElsewhere) writes the mode,
// so the value is never inherited from an unrelated earlier modal. The default
// applies only to direct/deep-link opens, where "replace" is intended.
let sessionDismissMode: "back" | "replace" = "replace";
let proposalDismissMode: "back" | "replace" = "replace";
