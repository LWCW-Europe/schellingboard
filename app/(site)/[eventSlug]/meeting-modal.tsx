"use client";

import { useContext, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { respondToMeetingAction } from "@/app/actions/meetings";
import { clashLine } from "@/utils/meeting-clash-text";
import type { MeetingView } from "@/utils/meeting-views";
import { EventContext } from "../context";
import { dismissViewMeeting } from "./modal-nav";

const PRIMARY =
  "px-3 py-2 text-sm font-medium rounded-md text-on-brand bg-brand hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const SECONDARY =
  "px-3 py-2 text-sm font-medium rounded-md text-fg-muted bg-surface-muted hover:bg-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

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
      return "This meeting was canceled.";
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
  return meetingId ? <MeetingModal meetingId={meetingId} /> : null;
}

/**
 * One 1-on-1 in full, and — for the person asked — the Accept and Decline
 * buttons.
 */
function MeetingModal({ meetingId }: { meetingId: string }) {
  const { event } = useContext(EventContext);
  const router = useRouter();
  const [meetings, setMeetings] = useState<MeetingView[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnswering, startAnswer] = useTransition();

  const eventId = event?.id;

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

  // Fetched rather than server-rendered: a meeting is private to its two
  // guests, so it has no place in the schedule's shared render
  // (issue #392, section 2.6).
  useEffect(() => {
    if (!eventId) return;
    const controller = new AbortController();
    void fetch(`/api/meetings?event=${eventId}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<MeetingView[]>) : []))
      .then(setMeetings)
      // Closing the modal aborts the request, and leaving the page has the
      // browser kill it; either way there is nobody left to tell.
      .catch(() => undefined);
    return () => controller.abort();
  }, [eventId]);

  const meeting = meetings?.find((m) => m.id === meetingId);

  const answer = (response: "accept" | "decline") => {
    setError(null);
    startAnswer(async () => {
      try {
        const result = await respondToMeetingAction({ meetingId, response });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setMeetings(
          (current) =>
            current?.map((m) =>
              m.id === meetingId
                ? {
                    ...m,
                    status: response === "accept" ? "accepted" : "declined",
                  }
                : m
            ) ?? null
        );
        // An accepted meeting is a commitment, so the schedule behind the
        // modal now has one more thing in it.
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
      aria-label="Meeting details"
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
          <p className="text-fg-muted">Meeting not found.</p>
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
                  onClick={() => answer("accept")}
                  disabled={isAnswering}
                  className={PRIMARY}
                >
                  Accept
                </button>
                {/* Declining takes no explanation: the failure mode of this
                    feature is people feeling obliged (issue #392,
                    section 1.4). */}
                <button
                  type="button"
                  onClick={() => answer("decline")}
                  disabled={isAnswering}
                  className={SECONDARY}
                >
                  Decline
                </button>
              </div>
            )}

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
