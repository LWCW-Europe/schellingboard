"use client";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { DateTime } from "luxon";
import { Modal } from "./components/modal";
import { InlineMarkdown } from "./(site)/markdown";
import { releaseNotes, SHOWN_RELEASES } from "./release-notes";
import { getAppVersion } from "@/utils/git";

const CHANGELOG_URL =
  "https://github.com/LWCW-Europe/schellingboard/blob/main/CHANGELOG.md";

// Rendered without a zone, so the date stays the calendar date the release
// carries in CHANGELOG.md rather than shifting by the reader's offset.
const formatDate = (date: string) =>
  DateTime.fromISO(date).toFormat("d LLLL yyyy");

// Bigger than the highlights below it, which carry bold of their own: at the
// same size the release a bullet belongs to stopped being the thing the eye
// lands on first.
function ReleaseHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-line-subtle pb-1 text-base font-bold text-fg">
      {children}
    </h3>
  );
}

function Highlights({ highlights }: { highlights: string[] }) {
  return (
    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-fg">
      {highlights.map((highlight) => (
        <li key={highlight}>
          <InlineMarkdown>{highlight}</InlineMarkdown>
        </li>
      ))}
    </ul>
  );
}

/**
 * The footer's version, which opens what changed in the last few releases —
 * dates included, since the first thing an organizer wants from it is whether
 * the deployment in front of them is behind.
 */
export function WhatsNew({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const appVersion = getAppVersion();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="What's new"
        // Spelled out for a screen reader: on a narrow phone the "Version:"
        // label is dropped, leaving a bare number that says nothing on its own.
        aria-label={`Version ${appVersion} — what's new`}
        // focus-visible, not focus: closing the modal hands the focus back
        // here, and a mouse user should not be left with a ring in the footer.
        className={`flex gap-1 rounded-sm text-link hover:text-fg hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${className ?? ""}`}
      >
        <span className="hidden sm:block">Version: </span>
        {appVersion}
      </button>
      {/* Wider than the default: several releases of highlights, each a
          sentence long, read badly in a narrow column. Above the fixed nav bar
          (z-30) and the footer (z-20) too — opened from the footer, the modal
          would otherwise be the one thing on the page they overlap. */}
      <Modal
        open={open}
        setOpen={setOpen}
        zIndex="z-50"
        maxWidth="sm:max-w-2xl"
      >
        <Dialog.Title className="text-lg font-semibold text-fg">
          What&apos;s new
        </Dialog.Title>
        <p className="mt-1 text-sm text-fg-subtle">
          This site is running {appVersion}.
        </p>
        <div className="mt-4 space-y-4">
          {releaseNotes.slice(0, SHOWN_RELEASES).map((release) => (
            <section key={release.version}>
              <ReleaseHeading>
                {release.date
                  ? `${release.version} — ${formatDate(release.date)}`
                  : release.version}
              </ReleaseHeading>
              {/* Dateless: the release this build is ahead of the last one by,
                  and this is the only place those changes are announced. */}
              {!release.date && (
                <p className="mt-1 text-xs text-fg-subtle">
                  In this build, but not in a released version yet.
                </p>
              )}
              <Highlights highlights={release.highlights} />
            </section>
          ))}
        </div>
        <a
          href={CHANGELOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-link hover:underline"
        >
          Full changelog on GitHub
        </a>
      </Modal>
    </>
  );
}
