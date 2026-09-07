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
