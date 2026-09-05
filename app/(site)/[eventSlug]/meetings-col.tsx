"use client";

import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";

import type { MeetingView } from "@/utils/meeting-views";
import { meetingColumnRows } from "@/utils/meeting-column";
import type { DayWithSessions } from "@/app/(site)/context";
import { EventContext, useSlotIncrement } from "@/app/(site)/context";
import { viewMeetingLinkFromOwner } from "./modal-nav";

/**
 * The viewer's own 1-on-1s for one day, as the grid's first column, beside
 * the slots they cleared and the ones still open. Personal: never anyone
 * else's (issue #392, section 1.5).
 */
export function MeetingsCol({
  meetings,
  availability,
  day,
  nowOffsetPx,
}: {
  meetings: MeetingView[];
  /** Slot starts the viewer declared themselves open for, as ISO strings. */
  availability: string[];
  day: DayWithSessions;
  /** Kiosk now-line offset from the top of the slot grid; null hides it. */
  nowOffsetPx?: number | null;
}) {
  const slotIncrement = useSlotIncrement();
  const searchParams = useSearchParams();
  // Never missing here: the column only renders once meetings for this event
  // have been fetched, which takes the event being in context.
  const eventSlug = useContext(EventContext).event?.slug ?? "";
  const rows = meetingColumnRows({
    meetings,
    availability,
    day,
    slotIncrement,
  });

  return (
    <div className="relative px-0.5">
      <div className="grid h-full auto-rows-[44px]">
        {rows.map(({ row, span, kind, meetings: atRow }) =>
          kind !== "meetings" ? (
            <div
              key={row}
              style={{ gridRowStart: row }}
              // Hatched where the viewer cleared the slot: that governs who
              // may book *them*, so it is worth seeing on their own schedule —
              // but it is no bar to arranging a 1-on-1 there themselves, and
              // the cell stays as bookable as any other (#945).
              title={
                kind === "unavailable"
                  ? "You are not offering this slot — you can still arrange a 1-on-1 in it"
                  : undefined
              }
              className={clsx(
                `row-span-${span} my-0.5 rounded`,
                kind === "unavailable" && "meetings-col-blocked"
              )}
            />
          ) : (
            <div
              key={row}
              // Placed by row rather than in document order, so a gap between
              // two meetings needs no filler blocks.
              style={{ gridRowStart: row }}
              className={`row-span-${span} flex gap-0.5 my-0.5`}
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
          )
        )}
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
