import { getNumSlots, SLOT_HEIGHT_PX } from "@/utils/slots";
import type { MeetingView } from "@/utils/meeting-views";

const LIVE = new Set<MeetingView["status"]>(["pending", "accepted"]);

/**
 * What the grid shows of one day: what is agreed and what is still waiting.
 * Declined, canceled and lapsed requests simply drop off it
 * (issue #392, section 1.5).
 */
export function meetingsForDay(
  meetings: MeetingView[],
  day: { start: Date; end: Date }
): MeetingView[] {
  return meetings.filter((meeting) => {
    if (!LIVE.has(meeting.status)) return false;
    const start = new Date(meeting.slotStart).getTime();
    return start >= day.start.getTime() && start < day.end.getTime();
  });
}

/**
 * Whether the viewer gets the column at all. Decided for the whole event
 * rather than day by day, so the rooms line up from one day to the next.
 */
export function takesPartInMeetings(
  meetings: MeetingView[],
  availability: string[]
): boolean {
  return availability.length > 0 || meetings.some((m) => LIVE.has(m.status));
}

/**
 * How a block of meetings is drawn. The column is 96–160px wide, so blocks set
 * side by side are unreadable at two; they stack instead, until the block runs
 * out of height and the whole slot becomes one block that opens a list.
 */
export type MeetingBlockDisplay = "single" | "stack" | "summary";

/** Least height a stacked entry stays legible in, and the gap below it. */
const ENTRY_PX = 18;
const ENTRY_GAP_PX = 2;
/** The block's own vertical margin (my-0.5), top and bottom. */
const BLOCK_INSET_PX = 4;

function stackCapacity(span: number): number {
  const height = span * SLOT_HEIGHT_PX - BLOCK_INSET_PX;
  return Math.max(
    1,
    Math.floor((height + ENTRY_GAP_PX) / (ENTRY_PX + ENTRY_GAP_PX))
  );
}

/**
 * One row of the schedule's 1-on-1 column: what the viewer has in that slot,
 * or why they have nothing there.
 */
export type MeetingColumnRow = {
  /** 1-based, matching CSS grid's own row numbering. */
  row: number;
  span: number;
  /** The slot's start as an ISO string, which is how a booking names it. */
  start: string;
  kind: "meetings" | "unavailable" | "free";
  /** Empty unless `kind` is "meetings". */
  meetings: MeetingView[];
  /** Set on a "meetings" row, absent on the empty kinds. */
  display?: MeetingBlockDisplay;
};

/**
 * The column's rows for one day, one per slot — except where meetings overlap,
 * which share one block. Nothing else merges: what the viewer cleared governs
 * who may book *them*, and they can still arrange a 1-on-1 in it themselves,
 * so every empty slot stays separately bookable (#945).
 */
export function meetingColumnRows({
  meetings,
  availability,
  day,
  slotIncrement,
}: {
  /** The viewer's meetings for this day, already filtered to what it shows. */
  meetings: MeetingView[];
  /** Slot starts the viewer declared themselves open for, as ISO strings. */
  availability: string[];
  day: { start: Date; end: Date };
  slotIncrement: number;
}): MeetingColumnRow[] {
  const slotMs = slotIncrement * 60 * 1000;
  const numSlots = getNumSlots(day.start, day.end, slotIncrement);
  // Floored, not rounded: a meeting booked before the event's increment
  // changed may no longer start on a row, and the row that contains it is
  // the one that does not assert a time it does not have.
  const rowOf = (start: string) =>
    Math.floor((new Date(start).getTime() - day.start.getTime()) / slotMs) + 1;

  // Measured from the row's start rather than the meeting's, so one that
  // starts mid-row and reaches into the next covers both -- and never past the
  // last row, which a day shortened after the booking would otherwise do,
  // stretching the day's grid row beyond the rooms beside it.
  const spanOf = (meeting: MeetingView, row: number) => {
    const rowStart = day.start.getTime() + (row - 1) * slotMs;
    const wanted = Math.ceil(
      (new Date(meeting.slotEnd).getTime() - rowStart) / slotMs
    );
    return Math.min(Math.max(1, wanted), Math.max(1, numSlots - row + 1));
  };

  const placed = meetings
    .map((meeting) => {
      const row = rowOf(meeting.slotStart);
      return { meeting, row, end: row + spanOf(meeting, row) };
    })
    // Earliest first, then by name: an order the reader can predict, and one a
    // block keeps from one read to the next.
    .sort(
      (a, b) =>
        a.meeting.slotStart.localeCompare(b.meeting.slotStart) ||
        a.meeting.otherName.localeCompare(b.meeting.otherName) ||
        a.meeting.id.localeCompare(b.meeting.id)
    );

  // Everything that overlaps goes in one block: two grid items in the same
  // column draw over each other, and unequal lengths make that a wider net
  // than sharing a start row.
  const blocks: { row: number; end: number; meetings: MeetingView[] }[] = [];
  for (const { meeting, row, end } of placed) {
    const open = blocks[blocks.length - 1];
    if (open && row < open.end) {
      open.end = Math.max(open.end, end);
      open.meetings.push(meeting);
      continue;
    }
    blocks.push({ row, end, meetings: [meeting] });
  }

  const byRow = new Map(blocks.map((block) => [block.row, block]));
  const covered = new Set<number>();
  for (const block of blocks) {
    for (let row = block.row; row < block.end; row++) covered.add(row);
  }

  // Being asked takes no availability of your own, so a guest can hold
  // meetings having declared nothing at all -- and painting their whole day
  // "not free" would be true and useless.
  const declared = new Set(availability);
  const declaredAnything = declared.size > 0;

  const rows: MeetingColumnRow[] = [];
  for (let row = 1; row <= numSlots; row++) {
    const start = new Date(
      day.start.getTime() + (row - 1) * slotMs
    ).toISOString();
    const block = byRow.get(row);
    if (block) {
      const span = block.end - block.row;
      rows.push({
        row,
        span,
        start,
        kind: "meetings",
        meetings: block.meetings,
        display:
          block.meetings.length === 1
            ? "single"
            : block.meetings.length <= stackCapacity(span)
              ? "stack"
              : "summary",
      });
      continue;
    }
    if (covered.has(row)) continue;

    const free = !declaredAnything || declared.has(start);
    if (free) {
      rows.push({ row, span: 1, start, kind: "free", meetings: [] });
      continue;
    }
    rows.push({ row, span: 1, start, kind: "unavailable", meetings: [] });
  }

  // Nothing declared and nothing booked is not a column at all; the caller
  // decides that, but it should not have to filter empty "free" rows.
  return declaredAnything || meetings.length > 0 ? rows : [];
}
