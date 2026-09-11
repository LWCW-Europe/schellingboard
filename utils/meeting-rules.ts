import { DateTime } from "luxon";

import type { MeetingView } from "@/utils/meeting-views";

/**
 * Whether this guest may call the meeting off. A confirmed one is either
 * party's to cancel; while it is pending only the requester's, since the
 * person asked has Decline instead. Never once the slot has begun: the server
 * refuses that, and an accepted meeting stays on the grid after its slot
 * passes, so the modal has to know before offering the button.
 */
export function canCancel(
  meeting: Pick<MeetingView, "status" | "role" | "slotStart">,
  now: Date
): boolean {
  if (new Date(meeting.slotStart).getTime() <= now.getTime()) return false;
  return (
    meeting.status === "accepted" ||
    (meeting.status === "pending" && meeting.role === "requester")
  );
}

/**
 * The span a block of 1-on-1s covers, shaped like a meeting's own `timeLabel`.
 * Meetings that overlap without sharing a start share a block, so the first
 * one's time is not the block's.
 */
export function blockTimeLabel(
  meetings: Pick<MeetingView, "slotStart" | "slotEnd">[],
  timezone: string
): string {
  const clock = (iso: string) =>
    DateTime.fromISO(iso).setZone(timezone).toFormat("HH:mm");
  const starts = meetings.map((m) => m.slotStart).sort();
  const ends = meetings.map((m) => m.slotEnd).sort();
  return `${clock(starts[0])} – ${clock(ends[ends.length - 1])}`;
}

/**
 * The one line a slot of several 1-on-1s has room for under its count. What is
 * waiting on the reader comes first: it is the only part they can act on.
 */
export function slotSummaryLine(
  meetings: Pick<MeetingView, "status" | "role">[]
): string {
  const pending = meetings.filter((m) => m.status === "pending");
  const yours = pending.filter(needsReply).length;
  if (yours > 0) {
    return yours === 1 ? "1 needs your reply" : `${yours} need your reply`;
  }
  if (pending.length > 0) {
    return pending.length === 1
      ? "1 waiting for reply"
      : `${pending.length} waiting for reply`;
  }
  return "all confirmed";
}

export function meetingTitle(meeting: Pick<MeetingView, "otherName">): string {
  return `1-on-1 with ${meeting.otherName}`;
}

export function needsReply(
  meeting: Pick<MeetingView, "status" | "role">
): boolean {
  return meeting.status === "pending" && meeting.role === "recipient";
}

/** The state in a couple of words, where `statusLine` would not fit. */
export function blockStatus(
  meeting: Pick<MeetingView, "status" | "role">
): string {
  switch (meeting.status) {
    case "pending":
      return needsReply(meeting) ? "needs your reply" : "waiting for reply";
    case "accepted":
      return "confirmed";
    case "declined":
      return "declined";
    case "canceled":
      return "canceled";
    case "expired":
      return "unanswered";
  }
}

/** What has become of the request, in the words of whoever is reading. */
export function statusLine(
  meeting: Pick<MeetingView, "status" | "role" | "otherName">
): string {
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
