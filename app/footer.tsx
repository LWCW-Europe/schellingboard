"use client";
import { ThemeSelect } from "./theme-select";
import { WhatsNew } from "./whats-new";

// Flexbox centres each item's *box*, but Montserrat's font box is top-heavy
// (12px ascent to 3px descent at our 12px size), so the glyphs land 1.5px
// below the centre of the taller theme switch beside them. Nudge them back on
// to its optical centre; a transform, so a wrapped footer keeps its height.
const OPTICAL_CENTRE = "-translate-y-[1.5px]";

// `inline` renders the footer as normal content inside the schedule's fixed
// frame (see EventDisplay) instead of as the site-wide bar: at the end of the
// grid's scroll container, or as the bottom row of the frame in the text and
// RSVP views. The bar spans the full — possibly horizontally overflowing —
// grid width, while the text stays pinned to the visible area.
export default function Footer({ inline }: { inline?: boolean }) {
  const content = (
    // Wrapping matters on narrow phones: the version can be a long dev string
    // (`a1b2c3d4-dirty`), and three links plus it no longer fit on one line.
    <div className="px-3 flex flex-wrap gap-x-2 gap-y-1 justify-between items-center text-xs text-fg-subtle">
      <WhatsNew className={OPTICAL_CENTRE} />
      {/* The only control that is on every page, which is why the theme lives
          here: the settings page needs a name to have been picked first. */}
      <ThemeSelect />
      <div
        className={`flex flex-wrap justify-end items-center gap-1 ${OPTICAL_CENTRE}`}
      >
        <span className="hidden sm:block">Powered by</span>
        <a
          href="https://schellingboard.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link hover:underline"
        >
          SchellingBoard
        </a>
        <span>·</span>
        <a
          href="https://docs.schellingboard.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link hover:underline"
        >
          Help
        </a>
        <span>·</span>
        <a
          href="https://github.com/LWCW-Europe/schellingboard/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link hover:underline"
        >
          Report a Bug
        </a>
      </div>
    </div>
  );

  return inline ? (
    <footer className="bg-surface-sunken border-t border-line-subtle py-2">
      <div className="sticky left-0 max-w-[100dvw]">{content}</div>
    </footer>
  ) : (
    <footer className="lg:fixed bottom-0 left-0 right-0 bg-surface-sunken border-t border-line-subtle py-2 z-20 mt-auto">
      {content}
    </footer>
  );
}
