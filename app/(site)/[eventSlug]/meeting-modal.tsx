"use client";

import { useContext, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  cancelMeetingAction,
  respondToMeetingAction,
  type MeetingActionResult,
} from "@/app/actions/meetings";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/app/components/buttons";
import { EventContext } from "@/app/(site)/context";
import { clashLine } from "@/utils/meeting-clash-text";
import { canCancel } from "@/utils/meeting-rules";
import type { MeetingView } from "@/utils/meeting-views";
import { dismissViewMeeting } from "./modal-nav";
import { useMyMeetings } from "./use-meetings";

// Cancelling is the modal's alone, so this one stays here rather than joining
// the shared pair in app/components/buttons.ts.
const DANGER =
  "px-3 py-2 text-sm font-medium rounded-md text-danger-fg bg-danger-tint hover:bg-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

/** What has become of the request, in the words of whoever is reading. */
function statusLine(meeting: MeetingView): string {
  const them = meeting.otherName;
  switch (meeting.status) {
    case "pending":
      return meeting.role === "recipient"
        ? `${them} is waiting for your answer.`
        : `Waiting for ${them} to answer.`;
    case "accepted":
      return "Confirmed — see you there.";
    case "declined":
      return meeting.role === "recipient"
        ? "You declined this."
        : `${them} declined this.`;
    case "canceled":
      return "This 1-on-1 was canceled.";
    case "expired":
      // Nobody is at fault for an unanswered request, so it is not phrased as
      // one: the slot simply came and went (issue #392, section 1.4).
      return "Nobody answered before the slot began.";
  }
}

/**
 * The meeting modal wherever `?viewMeeting=` can be opened — the meetings page
 * a notification links to, and the schedule. Reads the parameter itself rather
 * than taking it as a prop so dismissing it (a history replaceState) closes the
 * modal on a server-rendered page too.
 */
export function MeetingModalFromUrl() {
  const meetingId = useSearchParams()?.get("viewMeeting");
  // Keyed so a half-confirmed cancel does not carry over to the next meeting.
  return meetingId ? (
    <MeetingModal key={meetingId} meetingId={meetingId} />
  ) : null;
}

/**
 * One 1-on-1 in full, and — for the person asked — the Accept and Decline
 * buttons.
 */
function MeetingModal({ meetingId }: { meetingId: string }) {
  const router = useRouter();
  const { now } = useContext(EventContext);
  const { meetings, reload } = useMyMeetings();
  const [error, setError] = useState<string | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [isAnswering, startAnswer] = useTransition();

  // Duplication, anchor: waggHhba
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissViewMeeting();
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const meeting = meetings?.find((m) => m.id === meetingId);

  // Every write ends the same way: re-read the meetings, so the modal and the
  // schedule column behind it agree, and refresh the page, since an accepted
  // meeting is a commitment other things now clash with.
  const act = (run: () => Promise<MeetingActionResult>) => {
    setError(null);
    setConfirmingCancel(false);
    startAnswer(async () => {
      try {
        const result = await run();
        if (!result.ok) {
          setError(result.error);
          // The refusal usually means the meeting has moved on -- answered in
          // another tab, or its slot has begun -- so re-read it rather than
          // leaving the buttons describing a request that is no longer there.
          reload();
          return;
        }
        reload();
        router.refresh();
      } catch {
        setError("Request failed");
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="1-on-1 details"
    >
      <div className="fixed inset-0 bg-overlay" onClick={dismissViewMeeting} />
      <div className="relative bg-surface-raised rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={dismissViewMeeting}
          className="absolute top-4 right-4 text-fg-subtle hover:text-fg-muted"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {meetings === null ? (
          <p className="text-fg-muted">Loading…</p>
        ) : !meeting ? (
          <p className="text-fg-muted">1-on-1 not found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-fg pr-8">
              1-on-1 with {meeting.otherName}
            </h2>

            <dl className="flex flex-col gap-1 text-sm">
              <div className="flex gap-2">
                <dt className="font-medium text-fg-muted">When</dt>
                <dd className="text-fg">
                  {meeting.dayLabel}, {meeting.timeLabel}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-fg-muted">Where</dt>
                <dd className="text-fg">{meeting.meetingPoint}</dd>
              </div>
            </dl>

            <p className="text-sm text-fg-muted">{statusLine(meeting)}</p>

            {meeting.message && (
              <p className="text-sm rounded-md bg-surface-sunken p-3 text-fg">
                {meeting.message}
              </p>
            )}

            {/* The same fact the requester was shown when they booked it, from
                the other side: the person answering knows whether their own
                session matters more (issue #392, section 1.4). */}
            {meeting.clashes.length > 0 && (
              <p className="text-sm rounded-md bg-warning-tint p-3 text-fg">
                {[...new Set(meeting.clashes.map(clashLine))].join("; ")} during
                this slot.
              </p>
            )}

            {error && <p className="text-sm text-danger-fg">{error}</p>}

            {meeting.role === "recipient" && meeting.status === "pending" && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    act(() =>
                      respondToMeetingAction({ meetingId, response: "accept" })
                    )
                  }
                  disabled={isAnswering}
                  className={PRIMARY_BUTTON}
                >
                  Accept
                </button>
                {/* Declining takes no explanation: the failure mode of this
                    feature is people feeling obliged (issue #392,
                    section 1.4). */}
                <button
                  type="button"
                  onClick={() =>
                    act(() =>
                      respondToMeetingAction({ meetingId, response: "decline" })
                    )
                  }
                  disabled={isAnswering}
                  className={SECONDARY_BUTTON}
                >
                  Decline
                </button>
              </div>
            )}

            {canCancel(meeting, now) &&
              (confirmingCancel ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-fg">
                    {meeting.otherName} will be told. Cancel it?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        act(() => cancelMeetingAction({ meetingId }))
                      }
                      disabled={isAnswering}
                      className={DANGER}
                    >
                      Yes, cancel it
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingCancel(false)}
                      disabled={isAnswering}
                      className={SECONDARY_BUTTON}
                    >
                      Keep it
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(true)}
                  className={`${SECONDARY_BUTTON} self-start`}
                >
                  Cancel 1-on-1
                </button>
              ))}

            <p className="text-xs text-fg-subtle">
              Nothing is reserved — the meeting point is just where to find each
              other.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
