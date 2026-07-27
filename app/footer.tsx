"use client";
import { getAppVersion } from "@/utils/git";

// `inline` renders the footer as normal content inside the schedule's fixed
// frame (see EventDisplay) instead of as the site-wide bar: at the end of the
// grid's scroll container, or as the bottom row of the frame in the text and
// RSVP views. The bar spans the full — possibly horizontally overflowing —
// grid width, while the text stays pinned to the visible area.
export default function Footer({ inline }: { inline?: boolean }) {
  const appVersion = getAppVersion();

  const content = (
    // Wrapping matters on narrow phones: the version can be a long dev string
    // (`a1b2c3d4-dirty`), and three links plus it no longer fit on one line.
    <div className="px-3 flex flex-wrap gap-x-2 justify-between items-center text-xs text-gray-500">
      <span className="flex gap-1">
        <span className="hidden sm:block">Version: </span>
        {appVersion}
      </span>
      <div className="flex flex-wrap justify-end items-center gap-1">
        <span className="hidden sm:block">Powered by</span>
        <a
          href="https://schellingboard.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          SchellingBoard
        </a>
        <span>·</span>
        <a
          href="https://docs.schellingboard.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Help
        </a>
        <span>·</span>
        <a
          href="https://github.com/LWCW-Europe/schellingboard/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Report a Bug
        </a>
      </div>
    </div>
  );

  return inline ? (
    <footer className="bg-gray-50 border-t border-gray-200 py-2">
      <div className="sticky left-0 max-w-[100dvw]">{content}</div>
    </footer>
  ) : (
    <footer className="lg:fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 py-2 z-20 mt-auto">
      {content}
    </footer>
  );
}
