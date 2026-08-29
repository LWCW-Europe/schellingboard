"use client";

import {
  type TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type {
  AttendeeCard,
  DirectoryView,
} from "@/app/(site)/guests/directory-view";
import { ProfileBody } from "@/app/(site)/guests/profile-body";
import { listHref, profileHref } from "@/app/(site)/guests/profile-nav";
import {
  listProfileActivity,
  type ProfileActivity,
} from "@/app/(site)/guests/profile-activity";
import {
  catchSwipe,
  pressSlide,
  type Slide,
  startSwipe,
  swipeCommit,
  type SwipeEnds,
  swipeOffset,
  trackSwipe,
} from "@/app/(site)/guests/swipe";

/** How long the profile takes to finish a swipe the finger has let go of. */
const SETTLE_MS = 200;

type Drag = { guestId: string; width: number } & Slide;

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

  const ends: SwipeEnds = {
    canPrev: index > 0,
    canNext: index >= 0 && index < collection.length - 1,
  };

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

  const viewport = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [dragged, setDrag] = useState<Drag | null>(null);
  // A drag belongs to the profile it started on, and a finished one is left
  // standing until the URL it asked for arrives: dropping it on the timer
  // instead would snap back to the profile just swiped away for however many
  // frames the router takes to catch up.
  const drag = dragged?.guestId === guestId ? dragged : null;
  // …and dropped in the same breath as it does: a swipe left lying on the
  // profile it came from settles and navigates all over again the moment
  // anything — Prev, Back — comes back to that profile.
  if (dragged !== null && dragged.guestId !== guestId) setDrag(null);

  const onTouchStart = (e: ReactTouchEvent) => {
    // A second finger is a pinch, the enlarged photo owns the gesture, and a
    // profile outside the collection has nowhere to go.
    if (zoomed || index < 0 || e.touches.length !== 1) return;
    const point = e.touches[0];
    // A finger landing mid-settle picks the card up where it visibly is;
    // starting the gesture from rest would teleport it under the finger.
    const settling =
      dragged?.guestId === guestId && dragged.phase === "settling"
        ? dragged
        : null;
    const swipe = settling
      ? catchSwipe(point, rowOffset(settling))
      : startSwipe(point);
    if (!swipe) return;
    setDrag({
      guestId,
      phase: "tracking",
      swipe,
      width: viewport.current?.clientWidth ?? 0,
    });
  };

  // How far the settling card actually is, in px past the profile on screen:
  // the style declares where it is going, the computed matrix holds where the
  // frame has got to. The row also carries the mounted before-panel, which is
  // layout, not travel.
  const rowOffset = (settling: Extract<Drag, { phase: "settling" }>) => {
    const el = row.current;
    if (!el) return 0;
    const matrix = getComputedStyle(el).transform;
    const tx = matrix === "none" ? 0 : new DOMMatrixReadOnly(matrix).e;
    return tx + (ends.canPrev ? settling.width : 0);
  };

  const onTouchMove = (e: ReactTouchEvent) => {
    // Read off the event now: the updater below can run after React has moved
    // on from it, and a touch list is only good for the event it came with.
    const point =
      e.touches.length === 1
        ? { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
        : null;
    setDrag((prev) => {
      if (prev?.guestId !== guestId || prev.phase !== "tracking") return prev;
      if (!point) return null;
      return { ...prev, swipe: trackSwipe(prev.swipe, point) };
    });
  };

  const endTouch = () =>
    setDrag((prev) => {
      if (prev?.guestId !== guestId || prev.phase !== "tracking") return prev;
      const commit = swipeCommit(prev.swipe, prev.width, ends);
      const offset = -commit * prev.width;
      // Nothing left to animate, and no transition to wait for.
      if (swipeOffset(prev.swipe, ends) === offset) return null;
      return { guestId, width: prev.width, phase: "settling", offset, commit };
    });

  useEffect(() => {
    if (drag?.phase !== "settling") return;
    const timer = setTimeout(() => {
      if (drag.commit && collection[index + drag.commit]) goTo(drag.commit);
      else setDrag(null);
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [drag, goTo, collection, index]);

  const goToAnimated = useCallback(
    (offset: 1 | -1) => {
      // Arrows reach the ends even though the buttons there are disabled.
      if (!collection[index + offset]) return;

      const width = viewport.current?.clientWidth ?? 0;
      const press = pressSlide(
        dragged?.guestId === guestId ? dragged : null,
        offset,
        width
      );
      // Already sliding there: restarting would only snap the card backwards
      // and put off the arrival it is most of the way through.
      if (press.kind === "arrived") return;
      // Mid-slide the neighbours are on screen, so the transition retargets
      // from wherever the card is right now.
      if (press.kind === "slide") {
        setDrag({
          guestId,
          width,
          phase: "settling",
          offset: press.offset,
          commit: press.commit,
        });
        return;
      }

      // From rest they have to be mounted first: the neighbour mounts in one
      // frame and the slide starts in the next — a settle in the same breath
      // as the mount transitions from the pre-mount transform, so every press
      // slides the same way. Two rAFs, not one: a single one can still beat
      // the mounting frame's style pass. The guard keeps a stale callback from
      // clobbering whatever — a caught card, a retarget — happened meanwhile.
      setDrag({
        guestId,
        phase: "tracking",
        arming: true,
        swipe: { startX: 0, startY: 0, axis: "x", dx: 0 },
        width,
      });
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setDrag((prev) =>
            prev?.guestId === guestId &&
            prev.phase === "tracking" &&
            prev.arming
              ? {
                  guestId,
                  width,
                  phase: "settling",
                  offset: -offset * width,
                  commit: offset,
                }
              : prev
          );
        })
      );
    },
    [collection, index, guestId, dragged]
  );

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
      goToAnimated(e.key === "ArrowRight" ? 1 : -1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, goToAnimated, zoomed]);

  // The neighbours exist only for the length of a drag: mounting them for every
  // reader would render three profiles where one is being read, and rendering
  // them at the threshold instead would mean the swipe jumps rather than
  // follows the finger.
  const sliding =
    drag !== null && (drag.phase === "settling" || drag.swipe.axis === "x");
  const before = sliding && ends.canPrev ? collection[index - 1] : null;
  const after = sliding && ends.canNext ? collection[index + 1] : null;
  const width = drag?.width ?? 0;
  const offset =
    drag === null
      ? 0
      : drag.phase === "settling"
        ? drag.offset
        : swipeOffset(drag.swipe, ends);

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
            onClick={() => goToAnimated(-1)}
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
            onClick={() => goToAnimated(1)}
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

        {/* touch-pan-y hands vertical scrolling to the browser and keeps
            horizontal panning — the back gesture included — for this handler.
            It has to be CSS: React listens for touchmove passively, so
            preventDefault is not available to decide it per gesture. */}
        <div
          ref={viewport}
          className="flex min-h-0 flex-1 flex-col overflow-hidden touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={endTouch}
          onTouchCancel={endTouch}
        >
          {guest ? (
            // Sized by flex, never `h-full`: from sm up the panel is
            // content-height capped by max-height, so a percentage height in
            // here resolves to auto and the profile is clipped instead of
            // scrolled.
            <div
              ref={row}
              className="flex min-h-0 flex-1"
              style={{
                transform: `translateX(${(before ? -width : 0) + offset}px)`,
                transition:
                  drag?.phase === "settling"
                    ? `transform ${SETTLE_MS}ms ease-out`
                    : undefined,
              }}
            >
              {[before, guest, after]
                .filter((a): a is AttendeeCard => a !== null)
                .map((attendee) => {
                  const current = attendee.id === guestId;
                  return (
                    <div
                      key={attendee.id}
                      ref={current ? body : undefined}
                      // The neighbours are on screen only as the profile the
                      // finger is reaching for: not part of the page for a
                      // screen reader, and their links not tabbable.
                      aria-hidden={!current}
                      inert={!current}
                      className="w-full shrink-0 overflow-y-auto px-4 py-6 sm:px-6"
                    >
                      <ProfileBody
                        guest={attendee}
                        isOwnProfile={currentUserId === attendee.id}
                        isActive={current}
                        activity={current ? activity : null}
                        zoomed={current && zoomed}
                        onToggleZoom={() =>
                          setZoomedFor(zoomed ? null : guestId)
                        }
                      />
                    </div>
                  );
                })}
            </div>
          ) : (
            // Not a 404: this is where a stale link from an old session or
            // comment lands, and the list behind is more use than an error.
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <p className="text-fg-muted">This person is no longer listed.</p>
            </div>
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
