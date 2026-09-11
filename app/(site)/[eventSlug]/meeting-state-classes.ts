import type { MeetingViewStatus } from "@/utils/meeting-views";

// Pending reads as unfinished business, not a plan.
export function meetingStateClasses(status: MeetingViewStatus): string {
  return status === "accepted"
    ? "bg-brand-tint border-brand-accent"
    : "bg-surface-muted border-dashed border-line";
}
