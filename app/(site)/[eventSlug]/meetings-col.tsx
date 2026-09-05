"use client";

import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/24/outline";
import { DateTime } from "luxon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";

import type { MeetingView } from "@/utils/meeting-views";
import { meetingColumnRows } from "@/utils/meeting-column";
import type { DayWithSessions } from "@/app/(site)/context";
import { EventContext, useSlotIncrement } from "@/app/(site)/context";
import { clashLines } from "@/utils/meeting-clash-text";
import { statusLine } from "@/utils/meeting-rules";
import { viewMeetingLinkFromOwner } from "./modal-nav";
import { NowLine } from "./now-line";
import { BookMeeting } from "./book-meeting";
import { Tooltip } from "./tooltip";

/** The word of status a block has room for; the tooltip says the rest. */
function blockStatus(meeting: MeetingView): string {
  if (meeting.status === "accepted") return "confirmed";
  return meeting.role === "recipient"
    ? "needs your reply"
    : "waiting for reply";
}

/** "14:30", in the event's zone, for a control's accessible name. */
function slotLabel(start: string, timezone: string): string {
  return DateTime.fromISO(start).setZone(timezone).toFormat("HH:mm");
}

// What the block has no room for, on hover -- the pattern a session block
// already follows. A tap still opens the modal, where all of it is anyway.
function MeetingSummary({ meeting }: { meeting: MeetingView }) {
  return (
    <div className="p-2 space-y-1">
      <p className="text-sm font-semibold text-fg">
        1-on-1 with {meeting.otherName}
      </p>
      <p className="text-xs text-fg-muted">
        {meeting.timeLabel} · {meeting.meetingPoint}
      </p>
      <p className="text-xs text-fg">{statusLine(meeting)}</p>
      {meeting.message && (
        // Up to 2000 characters, and the panel has no height to
        // spare: unclamped it pushes the clash below the fold.
        <p className="text-xs text-fg-muted line-clamp-3">
          “{meeting.message}”
        </p>
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
  onBooked,
}: {
  meetings: MeetingView[];
  /** Slot starts the viewer declared themselves open for, as ISO strings. */
  availability: string[];
  day: DayWithSessions;
  /** Now-line offset from the top of the slot grid; null hides it. */
  nowOffsetPx?: number | null;
  /** Re-read the viewer's meetings, once a request has been sent. */
  onBooked: () => void;
}) {
  const slotIncrement = useSlotIncrement();
  const searchParams = useSearchParams();
  // Never missing here: the column only renders once meetings for this event
  // have been fetched, which takes the event being in context.
  const { event, now } = useContext(EventContext);
  const eventSlug = event?.slug ?? "";
  const timezone = event?.timezone ?? "UTC";
  // Which slot the booking modal is open on, if any.
  const [booking, setBooking] = useState<string | null>(null);
  const rows = meetingColumnRows({
    meetings,
    availability,
    day,
    slotIncrement,
  });

  return (
    <div className="relative px-0.5">
      <div className="grid h-full auto-rows-[44px]">
        {rows.map(({ row, span, start, kind, meetings: atRow }) =>
          kind !== "meetings" ? (
            <button
              key={row}
              type="button"
              style={{ gridRowStart: row }}
              // A slot in the past is not bookable, and the request action
              // refuses one anyway.
              disabled={new Date(start) <= now}
              onClick={() => setBooking(start)}
              // Hatched where the viewer cleared the slot: that governs who
              // may book *them*, so it is worth seeing on their own schedule —
              // but it is no bar to arranging a 1-on-1 there themselves, so it
              // is as bookable as any other.
              aria-label={
                kind === "unavailable"
                  ? `Arrange a 1-on-1 at ${slotLabel(start, timezone)} — you are not offering this slot to others`
                  : `Arrange a 1-on-1 at ${slotLabel(start, timezone)}`
              }
              className={clsx(
                `row-span-${span} my-0.5 rounded border border-dashed border-line-subtle text-fg-faint`,
                "flex items-center justify-center transition-colors",
                "enabled:hover:border-brand-accent enabled:hover:bg-brand-tint enabled:hover:text-brand-fg",
                "disabled:border-transparent disabled:cursor-default",
                kind === "unavailable" && "meetings-col-blocked"
              )}
            >
              {new Date(start) > now && (
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
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
                      // One slot fits a name and one more line; the place gives
                      // way first, since the state is what may want answering.
                      <p className="flex gap-1 text-[10px] leading-[1.15] text-fg-subtle">
                        <span className="truncate text-fg-muted">
                          {meeting.meetingPoint}
                        </span>
                        <span className="shrink-0">
                          · {blockStatus(meeting)}
                        </span>
                      </p>
                    )}
                  </Link>
                </Tooltip>
              ))}
            </div>
          )
        )}
      </div>
      {booking && event && (
        <BookMeeting
          eventId={event.id}
          slotStart={booking}
          onClose={() => setBooking(null)}
          onBooked={onBooked}
        />
      )}
      {/* Each column draws its own segment of the now line; see DayGrid. */}
      {nowOffsetPx != null && <NowLine offsetPx={nowOffsetPx} />}
    </div>
  );
}
