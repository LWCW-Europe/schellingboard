"use client";

import clsx from "clsx";
import { Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { DateTime } from "luxon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";

import type { MeetingView } from "@/utils/meeting-views";
import { meetingColumnRows } from "@/utils/meeting-column";
import type { DayWithSessions } from "@/app/(site)/context";
import { EventContext, useSlotIncrement } from "@/app/(site)/context";
import { Modal } from "@/app/components/modal";
import { clashLines } from "@/utils/meeting-clash-text";
import {
  blockStatus,
  blockTimeLabel,
  meetingTitle,
  needsReply,
  slotSummaryLine,
  statusLine,
} from "@/utils/meeting-rules";
import { meetingStateClasses } from "./meeting-state-classes";
import { isPlainLeftClick, viewMeetingLinkFromOwner } from "./modal-nav";
import { NowLine } from "./now-line";
import { BookMeeting } from "./book-meeting";
import { Tooltip } from "./tooltip";

/** "14:30", in the event's zone, for a control's accessible name. */
function slotLabel(start: string, timezone: string): string {
  return DateTime.fromISO(start).setZone(timezone).toFormat("HH:mm");
}

/**
 * An empty slot of the column, which is a control while it is still ahead.
 * Once it is past it is plain scenery: the request action refuses a slot that
 * has begun, so offering it -- even greyed out -- would promise nothing.
 */
function SlotCell({
  row,
  span,
  start,
  blocked,
  bookable,
  timezone,
  onBook,
}: {
  row: number;
  span: number;
  start: string;
  /** The viewer cleared this slot, so nobody may book *them* into it. */
  blocked: boolean;
  bookable: boolean;
  timezone: string;
  onBook: () => void;
}) {
  const shape = clsx(
    `row-span-${span} my-0.5 flex items-center justify-center rounded`,
    blocked && "meetings-col-blocked"
  );

  if (!bookable) {
    return <div style={{ gridRowStart: row }} className={shape} />;
  }

  return (
    <button
      type="button"
      style={{ gridRowStart: row }}
      onClick={onBook}
      // Hatching says who may book *them*; it is no bar to arranging a 1-on-1
      // there themselves, so the slot stays as bookable as any other.
      aria-label={
        blocked
          ? `Arrange a 1-on-1 at ${slotLabel(start, timezone)} — you are not offering this slot to others`
          : `Arrange a 1-on-1 at ${slotLabel(start, timezone)}`
      }
      className={clsx(
        shape,
        "border border-dashed border-line-subtle text-fg-faint transition-colors",
        "hover:border-brand-accent hover:bg-brand-tint hover:text-brand-fg"
      )}
    >
      <PlusIcon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

// What the block has no room for, on hover -- the pattern a session block
// already follows. A tap still opens the modal, where all of it is anyway.
function MeetingSummary({ meeting }: { meeting: MeetingView }) {
  return (
    <div className="p-2 space-y-1">
      <p className="text-sm font-semibold text-fg">{meetingTitle(meeting)}</p>
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

/** The slot's 1-on-1s at a glance, for a block with no room to name them. */
function SlotSummary({
  meetings,
  timezone,
}: {
  meetings: MeetingView[];
  timezone: string;
}) {
  return (
    <div className="p-2 space-y-1">
      <p className="text-sm font-semibold text-fg">
        {meetings.length} 1-on-1s · {blockTimeLabel(meetings, timezone)}
      </p>
      <ul className="space-y-0.5">
        {meetings.map((meeting) => (
          <li key={meeting.id} className="text-xs text-fg-muted">
            <span className="font-medium text-fg">{meeting.otherName}</span> —{" "}
            {statusLine(meeting)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One 1-on-1, alone in its slot: room for the place and the state as well. */
function MeetingBlock({
  meeting,
  span,
  eventSlug,
}: {
  meeting: MeetingView;
  span: number;
  eventSlug: string;
}) {
  const searchParams = useSearchParams();
  return (
    <Tooltip
      content={<MeetingSummary meeting={meeting} />}
      className="flex flex-1 min-w-0"
      triggerClassName="flex flex-1 min-w-0"
      noTap
    >
      <Link
        {...viewMeetingLinkFromOwner(searchParams, eventSlug, meeting.id)}
        className={clsx(
          "flex-1 min-w-0 rounded border-2 px-1 py-0.5 overflow-hidden font-roboto",
          meetingStateClasses(meeting.status)
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
          // One slot fits a name and one more line; the place gives way first,
          // since the state is what may want answering.
          <p className="flex gap-1 text-[10px] leading-[1.15] text-fg-subtle">
            <span className="truncate text-fg-muted">
              {meeting.meetingPoint}
            </span>
            <span className="shrink-0">· {blockStatus(meeting)}</span>
          </p>
        )}
      </Link>
    </Tooltip>
  );
}

/**
 * One of several 1-on-1s stacked in a slot: full width and a name only, which
 * is what tells them apart. The dot marks one waiting on the reader.
 */
function StackEntry({
  meeting,
  eventSlug,
  timezone,
}: {
  meeting: MeetingView;
  eventSlug: string;
  timezone: string;
}) {
  const searchParams = useSearchParams();
  return (
    <Tooltip
      content={<MeetingSummary meeting={meeting} />}
      className="flex flex-1 min-h-0"
      triggerClassName="flex flex-1 min-w-0"
      noTap
    >
      <Link
        {...viewMeetingLinkFromOwner(searchParams, eventSlug, meeting.id)}
        aria-label={`${meetingTitle(meeting)} at ${slotLabel(
          meeting.slotStart,
          timezone
        )} — ${blockStatus(meeting)}`}
        className={clsx(
          "flex flex-1 min-w-0 items-center gap-1 overflow-hidden rounded-sm border-l-4 px-1 font-roboto",
          meetingStateClasses(meeting.status)
        )}
      >
        <span className="truncate text-[11px] leading-none font-medium text-fg">
          {meeting.otherName}
        </span>
        {needsReply(meeting) && (
          <span
            aria-hidden="true"
            className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-warning-fg"
          />
        )}
      </Link>
    </Tooltip>
  );
}

/**
 * A slot holding more 1-on-1s than the block can name: one full-size control
 * for the slot, which opens the list, rather than a row of unreadable slivers.
 */
function SlotBlock({
  meetings,
  timezone,
  onOpen,
}: {
  meetings: MeetingView[];
  timezone: string;
  onOpen: () => void;
}) {
  return (
    <Tooltip
      content={<SlotSummary meetings={meetings} timezone={timezone} />}
      className="flex flex-1 min-w-0"
      triggerClassName="flex flex-1 min-w-0"
      noTap
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${meetings.length} 1-on-1s, ${blockTimeLabel(
          meetings,
          timezone
        )} — ${slotSummaryLine(meetings)}`}
        className="flex flex-1 min-w-0 flex-col justify-center overflow-hidden rounded border-2 border-line bg-surface-muted px-1 text-left font-roboto hover:border-brand-accent"
      >
        <span className="text-xs leading-[1.15] font-semibold text-fg">
          {meetings.length} 1-on-1s
        </span>
        <span className="truncate text-[10px] leading-[1.15] text-fg-subtle">
          {slotSummaryLine(meetings)}
        </span>
      </button>
    </Tooltip>
  );
}

/** Everything in one slot, where there is room for it: name, time and state. */
function SlotMeetings({
  meetings,
  timezone,
  eventSlug,
  onClose,
}: {
  meetings: MeetingView[];
  timezone: string;
  eventSlug: string;
  onClose: () => void;
}) {
  const searchParams = useSearchParams();
  return (
    <Modal open setOpen={onClose} zIndex="z-[60]" portal maxWidth="sm:max-w-md">
      <Dialog.Title className="pr-8 text-base font-semibold text-fg">
        {meetings.length} 1-on-1s, {blockTimeLabel(meetings, timezone)}
      </Dialog.Title>
      <p className="text-sm text-fg-muted">{meetings[0].dayLabel}</p>
      <ul className="mt-3 flex max-h-72 flex-col gap-1 overflow-y-auto">
        {meetings.map((meeting) => {
          const link = viewMeetingLinkFromOwner(
            searchParams,
            eventSlug,
            meeting.id
          );
          return (
            <li key={meeting.id}>
              <Link
                {...link}
                onClick={(e) => {
                  const plain = isPlainLeftClick(e);
                  link.onClick(e);
                  // A modifier click opens the 1-on-1 in a tab of its own and
                  // leaves this list where it was.
                  if (plain) onClose();
                }}
                className="flex flex-col gap-0.5 rounded-md bg-surface-sunken p-2 hover:bg-surface-muted"
              >
                <span className="font-medium text-fg">{meeting.otherName}</span>
                <span className="text-xs text-fg-muted">
                  {meeting.timeLabel} · {meeting.meetingPoint}
                </span>
                <span className="text-xs text-fg-subtle">
                  {statusLine(meeting)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Modal>
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
  // Never missing here: the column only renders once meetings for this event
  // have been fetched, which takes the event being in context.
  const { event, now } = useContext(EventContext);
  const eventSlug = event?.slug ?? "";
  const timezone = event?.timezone ?? "UTC";
  // Which slot the booking modal is open on, if any.
  const [booking, setBooking] = useState<string | null>(null);
  // And which slot's list of its 1-on-1s is open, if any.
  const [openSlot, setOpenSlot] = useState<string | null>(null);
  const rows = meetingColumnRows({
    meetings,
    availability,
    day,
    slotIncrement,
  });
  const openRow = rows.find(
    (candidate) => candidate.kind === "meetings" && candidate.start === openSlot
  );

  return (
    <div className="relative px-0.5">
      <div className="grid h-full auto-rows-[44px]">
        {rows.map(({ row, span, start, kind, display, meetings: atRow }) =>
          kind !== "meetings" ? (
            <SlotCell
              key={row}
              row={row}
              span={span}
              start={start}
              blocked={kind === "unavailable"}
              bookable={new Date(start) > now}
              timezone={timezone}
              onBook={() => setBooking(start)}
            />
          ) : (
            <div
              key={row}
              // Placed by row rather than in document order, so a gap between
              // two meetings needs no filler blocks.
              style={{ gridRowStart: row }}
              className={clsx(
                `row-span-${span} flex gap-0.5 my-0.5`,
                // Stacked, never side by side: this column is 96–160px wide.
                display === "stack" && "flex-col"
              )}
            >
              {display === "summary" ? (
                <SlotBlock
                  meetings={atRow}
                  timezone={timezone}
                  onOpen={() => setOpenSlot(start)}
                />
              ) : display === "stack" ? (
                atRow.map((meeting) => (
                  <StackEntry
                    key={meeting.id}
                    meeting={meeting}
                    eventSlug={eventSlug}
                    timezone={timezone}
                  />
                ))
              ) : (
                <MeetingBlock
                  meeting={atRow[0]}
                  span={span}
                  eventSlug={eventSlug}
                />
              )}
            </div>
          )
        )}
      </div>
      {openRow && (
        <SlotMeetings
          meetings={openRow.meetings}
          timezone={timezone}
          eventSlug={eventSlug}
          onClose={() => setOpenSlot(null)}
        />
      )}
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
