"use client";

import type { ReactNode } from "react";
import { openingModalFromRedirect } from "@/app/(site)/[eventSlug]/modal-nav";

/**
 * Submits openNotificationAction, which marks the row read and redirects to
 * what happened. Some of those destinations are modals, so the dismiss mode
 * has to be armed here (see modal-nav.ts, anchor MnpjIo7Y) — the redirect is a
 * client-side navigation, and without this the modal would still be carrying
 * whatever an earlier schedule or proposal click left behind.
 */
export function OpenNotificationButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      onClick={openingModalFromRedirect}
      className="w-full cursor-pointer text-left"
    >
      {children}
    </button>
  );
}
