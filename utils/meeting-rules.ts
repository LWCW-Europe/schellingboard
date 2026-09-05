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
