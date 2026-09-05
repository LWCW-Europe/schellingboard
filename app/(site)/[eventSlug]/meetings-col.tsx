"use client";

import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";

import type { MeetingView } from "@/utils/meeting-views";
import { meetingColumnRows } from "@/utils/meeting-column";
import type { DayWithSessions } from "@/app/(site)/context";
import { EventContext, useSlotIncrement } from "@/app/(site)/context";
import { clashLines } from "@/utils/meeting-clash-text";
import { statusLine } from "@/utils/meeting-rules";
import { viewMeetingLinkFromOwner } from "./modal-nav";
import { Tooltip } from "./tooltip";

/** The word of status a block has room for; the tooltip says the rest. */
function blockStatus(meeting: MeetingView): string {
  if (meeting.status === "accepted") return "confirmed";
  return meeting.role === "recipient"
    ? "needs your reply"
    : "waiting for reply";
}

// What the block has no room for, on hover -- the pattern a session block
// already follows. A tap still opens the modal, where all of it is anyway.
function MeetingSummary({ meeting }: { meeting: MeetingView }) {
  return (
    <div className="p-2 space-y-1 text-left">
      <p className="text-sm font-semibold text-fg">
        1-on-1 with {meeting.otherName}
      </p>
      <p className="text-xs text-fg-muted">
        {meeting.timeLabel} · {meeting.meetingPoint}
      </p>
      <p className="text-xs text-fg">{statusLine(meeting)}</p>
      {meeting.message && (
        <p className="text-xs text-fg-muted">“{meeting.message}”</p>
      )}
      {meeting.clashes.length > 0 && (
        <p className="text-xs text-fg">
          {clashLines(meeting.clashes)} during this slot.
        </p>
      )}
    </div>
  );
}

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
                <Tooltip
                  key={meeting.id}
                  content={<MeetingSummary meeting={meeting} />}
                  className="flex flex-1 min-w-0"
                  triggerClassName="flex flex-1 min-w-0"
                  noTap
                >
                  <Link
                    {...viewMeetingLinkFromOwner(
                      searchParams,
                      eventSlug,
                      meeting.id
                    )}
                    className={clsx(
                      "flex-1 min-w-0 rounded px-1 py-0.5 overflow-hidden font-roboto text-left",
                      meeting.status === "accepted"
                        ? "bg-brand-tint border-2 border-brand-accent"
                        : // Pending reads as unfinished business, not a plan.
                          "bg-surface-muted border-2 border-dashed border-line"
                    )}
                  >
                    <p className="font-medium text-xs leading-[1.15] line-clamp-1 text-fg">
                      {meeting.otherName}
                    </p>
                    {span > 1 ? (
                      <>
                        <p className="text-[10px] leading-[1.15] line-clamp-1 text-fg-muted">
                          {meeting.meetingPoint}
                        </p>
                        <p className="text-[10px] leading-[1.15] text-fg-subtle">
                          {blockStatus(meeting)}
                        </p>
                      </>
                    ) : (
                      // One slot is a name and one more line; a third is cut
                      // off at the border. The place and the state share it,
                      // as a session block gives up its hosts at this height.
                      <p className="text-[10px] leading-[1.15] line-clamp-1 text-fg-subtle">
                        <span className="text-fg-muted">
                          {meeting.meetingPoint}
                        </span>{" "}
                        · {blockStatus(meeting)}
                      </p>
                    )}
                  </Link>
                </Tooltip>
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
