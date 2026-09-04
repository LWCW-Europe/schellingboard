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
import type { DirectoryView } from "@/app/(site)/guests/directory-view";
import { ProfileBody } from "@/app/(site)/guests/profile-body";
import {
  guestIdFromPath,
  listHref,
  profileHref,
} from "@/app/(site)/guests/profile-nav";
import {
  listProfileActivity,
  type ProfileActivity,
} from "@/app/(site)/guests/profile-activity";
import {
  catchSwipe,
  type Slide,
  startSwipe,
  swipeCommit,
  type SwipeEnds,
  swipeOffset,
  trackSwipe,
} from "@/app/(site)/guests/swipe";

/** How long the profile takes to finish a swipe the finger has let go of. */
const SETTLE_MS = 200;

type Drag = { guestId: string } & Slide;

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
  guestId: initialGuestId,
  view,
  currentUserId,
}: {
  guestId: string;
  view: DirectoryView;
  currentUserId: string | null;
}) {
  // Which profile is on screen, ahead of the URL rather than read off it: a
  // slide has to know where it is going while it is going there. `advanceTo`
  // keeps the two in step, and the popstate listener below picks up the
  // navigations that move the URL on their own.
  const [guestId, setGuestId] = useState(initialGuestId);

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

  // Moving on updates the state and the URL together: the visible profile and
  // the one the URL names must never diverge, or a reload, share or Back lands
  // on a different profile than the one on screen.
  const advanceTo = useCallback(
    (id: string) => {
      setGuestId(id);
      window.history.pushState(null, "", profileHref(id, listQuery));
    },
    [listQuery]
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
  // The row's styling needs the viewport width even when nothing is being
  // dragged, so it lives as state instead of riding along on each Drag.
  const [width, setWidth] = useState(0);
  // Measured on mount and kept live: the panel resizes with the window, and
  // `clientWidth` is only readable off the DOM, not during render.
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  // Browser Back/Forward moves through the history, not through this state.
  // Reading through pushes one entry per profile, so going back has to land the
  // modal on the profile the URL names; pushState does not fire popstate, so
  // only genuine navigations sync here.
  useEffect(() => {
    const onPop = () => {
      const id = guestIdFromPath(window.location.pathname);
      if (!id) return;
      setGuestId(id);
      // A navigation is not a slide: what was in flight belongs to the profile
      // being left, and left standing it would play again the next time that
      // profile came round.
      setDrag(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // A drag belongs to the profile it lands on — guestId advances the moment
  // the gesture is spent, not when the slide finishes — so one left over from a
  // profile since navigated away from moves nothing.
  const drag = dragged?.guestId === guestId ? dragged : null;

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
    const swipe = settling ? catchSwipe(point, rowOffset()) : startSwipe(point);
    if (!swipe) return;
    setDrag({
      guestId,
      phase: "tracking",
      swipe,
    });
  };

  // How far the card actually is from home, in px: the style declares where it
  // is going, the computed matrix holds where the frame has got to. Positive is
  // rightwards, so it is the travel a finger taking over inherits.
  const rowOffset = () => {
    const el = row.current;
    if (!el) return 0;
    const matrix = getComputedStyle(el).transform;
    const tx = matrix === "none" ? 0 : new DOMMatrixReadOnly(matrix).e;
    return tx + index * width;
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

  const endTouch = () => {
    if (dragged?.guestId !== guestId || dragged.phase !== "tracking") return;
    const commit = swipeCommit(dragged.swipe, width, ends);
    // The target runs for its own neighbours: advancing now — before the slide
    // settles — means a drag that starts again immediately here already has
    // both before and after on screen around the profile it lands on.
    const target = collection[index + commit]?.id ?? guestId;
    // A tap or a scroll has nothing to animate, and a settle standing over the
    // profile being read would mount its neighbours for no reason.
    if (target === guestId && swipeOffset(dragged.swipe, ends) === 0) {
      setDrag(null);
      return;
    }
    if (target !== guestId) advanceTo(target);
    setDrag({ guestId: target, phase: "settling" });
  };

  useEffect(() => {
    if (drag?.phase !== "settling") return;
    const timer = setTimeout(() => {
      // guestId already advanced when the gesture let go; only the drag — and
      // with it the transition tag — is spent here.
      setDrag(null);
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [drag]);

  const goToAnimated = useCallback(
    (offset: 1 | -1) => {
      // Arrows reach the ends even though the buttons there are disabled.
      const target = collection[index + offset]?.id;
      if (!target) return;

      // The target takes over as current right away, so the neighbours are its
      // own: a drag that starts here gets both on screen, like a swipe.
      advanceTo(target);

      // Mid-slide the neighbours are already mounted, so the transition simply
      // retargets from wherever the card is. Nothing has "arrived" — the settle
      // still running landed on its target the moment it began, so a press the
      // same way again is the profile after it, not a repeat of a completed one.
      if (drag) {
        setDrag({ guestId: target, phase: "settling" });
        return;
      }

      // From rest they have to be mounted first: the neighbour mounts in one
      // frame, held the width away it is arriving from, and the slide home
      // starts in the next — a settle in the same breath as the mount has no
      // travel to transition and arrives without moving. Two rAFs, not one: a
      // single one can still beat the mounting frame's style pass. The guard
      // keeps a stale callback from clobbering whatever — a caught card, a
      // retarget — happened meanwhile.
      setDrag({
        guestId: target,
        phase: "tracking",
        arming: true,
        swipe: { startX: 0, startY: 0, axis: "x", dx: offset * width },
      });
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setDrag((prev) =>
            prev?.guestId === target && prev.phase === "tracking" && prev.arming
              ? { guestId: target, phase: "settling" }
              : prev
          );
        })
      );
    },
    [collection, index, drag, width, advanceTo]
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

  // The neighbours are on screen only for the sideways drag or the settle that
  // needs them: mounted there, a swipe follows the finger instead of jumping,
  // and away there is just the profile being read, so point queries on the
  // dialog hit one card's text, not the neighbours', and a scroll or a tap
  // renders one profile rather than three.
  const sliding =
    drag !== null && (drag.phase === "settling" || drag.swipe.axis === "x");
  const offset = drag?.phase === "tracking" ? swipeOffset(drag.swipe, ends) : 0;
  // The row is a window onto the collection, and the padding is what puts that
  // window where it belongs: profile `first` starts `first` widths along, so
  // every mounted profile sits at its own place in the strip whichever of them
  // are mounted. The transform is then travel and nothing else — it stays put
  // across the frame the window moves along in, which is the frame the settle
  // transition starts in.
  const first = sliding && ends.canPrev ? index - 1 : index;

  const position =
    index >= 0
      ? `${index + 1} of ${collection.length} attendee${
          collection.length === 1 ? "" : "s"
        }`
      : "";

  const pages = sliding
    ? collection.slice(first, index + 2)
    : guest
      ? [guest]
      : [];

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
                paddingInlineStart: `${first * width}px`,
                transform: `translateX(${offset - index * width}px)`,
                transition:
                  drag?.phase === "settling"
                    ? `transform ${SETTLE_MS}ms ease-out`
                    : undefined,
              }}
            >
              {pages.map((attendee) => {
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
                    // One viewport each, so the strip's places are a width
                    // apart. `w-full` covers the first frame, before there is a
                    // measurement to place anything by.
                    style={{ width: width || undefined }}
                  >
                    <ProfileBody
                      guest={attendee}
                      isOwnProfile={currentUserId === attendee.id}
                      isActive={current}
                      activity={current ? activity : null}
                      zoomed={current && zoomed}
                      onToggleZoom={() => setZoomedFor(zoomed ? null : guestId)}
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
