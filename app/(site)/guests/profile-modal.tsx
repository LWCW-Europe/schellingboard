"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { DirectoryView } from "@/app/(site)/guests/directory-view";
import { ProfileBody } from "@/app/(site)/guests/profile-body";
import { listHref, profileHref } from "@/app/(site)/guests/profile-nav";
import {
  listProfileActivity,
  type ProfileActivity,
} from "@/app/(site)/guests/profile-activity";

/**
 * A guest's profile, read over the list it was opened from. Always a modal:
 * there is one URL per profile and the list behind it never unmounts, so
 * closing lands exactly where reading started.
 *
 * Prev/Next walk the collection the list is showing — or, for a profile the
 * active filters exclude or one opened from a session or a comment, everyone in
 * alphabetical order. The position label names whichever it is, so the
 * collection is never invisible state.
 */
export function ProfileModal({
  guestId,
  view,
  currentUserId,
}: {
  guestId: string;
  view: DirectoryView;
  currentUserId: string | null;
}) {
  const { matches, everyone, listQuery } = view;
  const collection = matches.some((a) => a.id === guestId) ? matches : everyone;
  const index = collection.findIndex((a) => a.id === guestId);
  const guest = index >= 0 ? collection[index] : null;

  // Whose photo is enlarged, rather than a plain flag: a profile is read at the
  // size it was opened at, not the size the last one was left at.
  const [zoomedFor, setZoomedFor] = useState<string | null>(null);
  const zoomed = zoomedFor === guestId;
  const activity = useProfileActivity(guestId);

  const goTo = useCallback(
    (offset: number) => {
      const next = collection[index + offset];
      if (!next) return;
      window.history.pushState(null, "", profileHref(next.id, listQuery));
    },
    [collection, index, listQuery]
  );

  // Pushes the list rather than going back, unlike the session and proposal
  // modals (anchor: MnpjIo7Y): reading through leaves one entry per profile, so
  // there is no single entry to pop — `history.back()` would reopen the profile
  // read before this one.
  const close = useCallback(() => {
    window.history.pushState(null, "", listHref(listQuery));
  }, [listQuery]);

  // One scroll container serves every profile, so without this the next one
  // opens at the offset the last one was left at — halfway down a stranger.
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [guestId]);

  useEffect(() => {
    // Duplication, anchor: waggHhba
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Escape unwinds one layer at a time: the enlarged photo first, so it
        // never closes the profile out from under someone looking closely.
        if (zoomed) setZoomedFor(null);
        else close();
        return;
      }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      // A modified arrow is somebody else's shortcut — browser back/forward,
      // word jump, selection — and stealing it would break navigating away
      // from the profile entirely.
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      // Arrow keys belong to whatever is being typed into, and to the enlarged
      // photo — moving on from there would be a jarring double jump.
      if (zoomed || isTextEntry(e.target)) return;
      e.preventDefault();
      goTo(e.key === "ArrowRight" ? 1 : -1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, goTo, zoomed]);

  const position =
    index >= 0
      ? `${index + 1} of ${collection.length} attendee${
          collection.length === 1 ? "" : "s"
        }`
      : "";

  return (
    // items-start, not items-center: a centred panel that sizes to its content
    // puts Prev/Next at a different height for every profile, so they jump
    // under the pointer while reading through. Pinned to the top they never
    // move, and only the bottom edge follows the profile's length.
    <div
      className="fixed inset-0 z-50 flex justify-center sm:items-start sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-label={guest ? guest.name : "Profile"}
    >
      <div className="fixed inset-0 bg-overlay" onClick={close} />
      {/* A full-screen sheet on a phone, a dialog below the top edge from sm
          up — max-h-full is the padded box, so it never runs off screen. */}
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-surface-raised shadow-xl sm:mx-4 sm:h-auto sm:max-h-full sm:max-w-4xl sm:rounded-lg">
        {/* The bar stays put while the profile scrolls: there is no Escape key
            on a phone, so after a dozen profiles the close button is the only
            cheap way out and it must never be scrolled off. */}
        <div className="flex shrink-0 items-center gap-2 border-b border-line-subtle px-2 py-2 sm:px-4">
          <NavButton
            label="Previous attendee"
            disabled={index <= 0}
            onClick={() => goTo(-1)}
          >
            <ChevronLeftIcon className="h-5 w-5 stroke-2" aria-hidden="true" />
            <span className="hidden sm:inline">Prev</span>
          </NavButton>
          {/* Announced, or arrow-key traversal is silent for a screen reader.
              The name rides along: the position alone says a profile changed
              without saying whose it now is, and a changed dialog label is not
              reliably announced on its own. */}
          <span
            aria-live="polite"
            className="flex-1 text-center text-sm text-fg-muted"
          >
            <span className="sr-only">{guest ? `${guest.name}, ` : ""}</span>
            {position}
          </span>
          <NavButton
            label="Next attendee"
            disabled={index < 0 || index >= collection.length - 1}
            onClick={() => goTo(1)}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRightIcon className="h-5 w-5 stroke-2" aria-hidden="true" />
          </NavButton>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="rounded-md p-1.5 text-fg-subtle hover:bg-surface-sunken hover:text-fg-muted"
          >
            <XMarkIcon className="h-6 w-6 stroke-2" aria-hidden="true" />
          </button>
        </div>

        <div
          ref={body}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6"
        >
          {guest ? (
            <ProfileBody
              guest={guest}
              isOwnProfile={currentUserId === guest.id}
              activity={activity}
              zoomed={zoomed}
              onToggleZoom={() => setZoomedFor(zoomed ? null : guestId)}
            />
          ) : (
            // Not a 404: this is where a stale link from an old session or
            // comment lands, and the list behind is more use than an error.
            <p className="text-fg-muted">This person is no longer listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-fg-muted hover:bg-surface-sunken hover:text-fg disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-fg-muted"
    >
      {children}
    </button>
  );
}

/** Hosting and Proposals, fetched per profile; null while in flight. */
function useProfileActivity(guestId: string): ProfileActivity | null {
  // Stored with the guest it belongs to, so moving on shows the skeleton again
  // without an effect having to blank it first — and so a reply for a profile
  // already moved on from can never land on the current one. Reading through
  // with the arrow keys outruns the network easily.
  const [loaded, setLoaded] = useState<{
    guestId: string;
    activity: ProfileActivity;
  } | null>(null);

  useEffect(() => {
    let live = true;
    void listProfileActivity(guestId).then((activity) => {
      if (live) setLoaded({ guestId, activity });
    });
    return () => {
      live = false;
    };
  }, [guestId]);

  return loaded?.guestId === guestId ? loaded.activity : null;
}

function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}
