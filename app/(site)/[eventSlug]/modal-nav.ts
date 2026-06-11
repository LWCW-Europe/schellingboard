"use client";

import type { useRouter } from "next/navigation";

/*
When we click on a session in the schedule, the app shows a modal with the session details.
Additionally, it pushes a new session-specific URL.
The reason for pushing rather than replacing is so that browser back button dismiss the modal.

What should happen when the user dimisses the modal by clicking the close button or
by clicking outside of the modal?
Same: `router.back()`.

However, suppose the session-specific page was opened directly via a link.
In that case, there is no "previous page" to go back to,
so the user should be taken to the schedule page instead,
which is the same as removing the session-specific query param from the URL.
*/

export function markOpenedByPush(): void {
  openedByPush = true;
}

export function dismissViewSession(router: ReturnType<typeof useRouter>): void {
  if (openedByPush) {
    router.back();
  } else {
    const params = new URLSearchParams(window.location.search);
    params.delete("viewSession");
    router.replace(`?${params.toString()}`, { scroll: false });
  }
}

// Using module-level variable rather than useState/useRef,
// because it has to survive across the parent re-render triggered by navigation,
// and it isn't part of any component's render output.
let openedByPush = false;
