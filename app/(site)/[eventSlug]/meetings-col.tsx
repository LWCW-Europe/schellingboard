"use client";

import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { MeetingView } from "@/utils/meeting-views";
import type { DayWithSessions } from "@/app/(site)/context";
import { useSlotIncrement } from "@/app/(site)/context";
import { viewMeetingLinkFromOwner } from "./modal-nav";

/**
 * What the grid shows of one day: what is agreed and what is still waiting.
 * Declined, canceled and lapsed requests simply drop off it
 * (issue #392, section 1.5).
 */
export function meetingsForDay(
  meetings: MeetingView[],
  day: DayWithSessions
): MeetingView[] {
  return meetings.filter((meeting) => {
    if (meeting.status !== "pending" && meeting.status !== "accepted") {
      return false;
    }
    const start = new Date(meeting.slotStart).getTime();
    return start >= day.start.getTime() && start < day.end.getTime();
  });
}

/**
 * The viewer's own 1-on-1s for one day, as the grid's first column. Personal:
 * never anyone else's, and rendered only when there is something in it, so it
 * costs no width on a phone otherwise (issue #392, section 1.5).
 */
export function MeetingsCol({
  meetings,
  day,
  eventSlug,
  nowOffsetPx,
}: {
  meetings: MeetingView[];
  day: DayWithSessions;
  eventSlug: string;
  /** Kiosk now-line offset from the top of the slot grid; null hides it. */
  nowOffsetPx?: number | null;
}) {
  const slotIncrement = useSlotIncrement();
  const searchParams = useSearchParams();
  const slotMs = slotIncrement * 60 * 1000;

  // Grouped by the row they start in: nothing stops a guest having an agreed
  // meeting and an unanswered request in the same slot, and two blocks placed
  // in one grid cell would sit on top of each other.
  const rows = new Map<number, MeetingView[]>();
  for (const meeting of meetings) {
    const start = new Date(meeting.slotStart).getTime();
    const row = Math.round((start - day.start.getTime()) / slotMs) + 1;
    rows.set(row, [...(rows.get(row) ?? []), meeting]);
  }

  // Grid rows are one slot each, and a meeting is one slot long -- but an
  // event whose increment changed can leave an older one longer.
  const spanOf = (meeting: MeetingView) =>
    Math.max(
      1,
      Math.ceil(
        (new Date(meeting.slotEnd).getTime() -
          new Date(meeting.slotStart).getTime()) /
          slotMs
      )
    );

  return (
    <div className="relative px-0.5">
      <div className="grid h-full auto-rows-[44px]">
        {[...rows].map(([row, atRow]) => (
          <div
            key={row}
            // Placed by row rather than in document order, so a gap between
            // two meetings needs no filler blocks.
            style={{ gridRowStart: row }}
            className={`row-span-${Math.max(...atRow.map(spanOf))} flex gap-0.5 my-0.5`}
          >
            {atRow.map((meeting) => (
              <Link
                key={meeting.id}
                {...viewMeetingLinkFromOwner(
                  searchParams,
                  eventSlug,
                  meeting.id
                )}
                className={clsx(
                  "flex-1 min-w-0 rounded px-1 py-0.5 overflow-hidden font-roboto",
                  meeting.status === "accepted"
                    ? "bg-brand-tint border-2 border-brand-accent"
                    : // Pending reads as unfinished business, not a plan.
                      "bg-surface-muted border-2 border-dashed border-line"
                )}
              >
                <p className="font-medium text-xs leading-[1.15] line-clamp-1 text-fg">
                  {meeting.otherName}
                </p>
                <p className="text-[10px] leading-[1.15] line-clamp-1 text-fg-muted">
                  {meeting.meetingPoint}
                </p>
                <p className="text-[10px] leading-[1.15] text-fg-subtle">
                  {meeting.status === "accepted"
                    ? "confirmed"
                    : meeting.role === "recipient"
                      ? "needs your reply"
                      : "waiting for reply"}
                </p>
              </Link>
            ))}
          </div>
        ))}
      </div>
      {/* Each column draws its own segment of the kiosk now line; see DayGrid. */}
      {nowOffsetPx != null && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 z-10 h-0.5 bg-danger pointer-events-none"
          style={{ top: nowOffsetPx }}
        />
      )}
    </div>
  );
}
