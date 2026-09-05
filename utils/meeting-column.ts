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
 * One row of the schedule's 1-on-1 column: what the viewer has in that slot,
 * or why they have nothing there.
 */
export type MeetingColumnRow = {
  /** 1-based, matching CSS grid's own row numbering. */
  row: number;
  span: number;
  kind: "meetings" | "unavailable" | "free";
  /** Empty unless `kind` is "meetings". */
  meetings: MeetingView[];
};

/**
 * The column's rows for one day, one per slot. Nothing merges: what the
 * viewer cleared governs who may book *them*, and they can still arrange a
 * 1-on-1 in it themselves, so every slot stays separately bookable (#945).
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
  const numSlots = Math.max(
    0,
    Math.round((day.end.getTime() - day.start.getTime()) / slotMs)
  );
  // Floored, not rounded: a meeting booked before the event's increment
  // changed may no longer start on a row, and the row that contains it is
  // the one that does not assert a time it does not have.
  const rowOf = (start: string) =>
    Math.floor((new Date(start).getTime() - day.start.getTime()) / slotMs) + 1;

  const byRow = new Map<number, MeetingView[]>();
  for (const meeting of meetings) {
    const row = rowOf(meeting.slotStart);
    byRow.set(row, [...(byRow.get(row) ?? []), meeting]);
  }
  // Measured from the row's start rather than the meeting's, so one that
  // starts mid-row and reaches into the next covers both.
  const spanOf = (meeting: MeetingView) => {
    const rowStart =
      day.start.getTime() + (rowOf(meeting.slotStart) - 1) * slotMs;
    return Math.max(
      1,
      Math.ceil((new Date(meeting.slotEnd).getTime() - rowStart) / slotMs)
    );
  };
  // Rows are keyed by start, so two such meetings of unequal length that
  // overlap without sharing a row would draw over each other. Knowingly out
  // of scope: it takes an increment change *and* two bookings athwart it.

  const covered = new Set<number>();
  for (const [row, atRow] of byRow) {
    const span = Math.max(...atRow.map(spanOf));
    for (let i = 0; i < span; i++) covered.add(row + i);
  }

  // Being asked takes no availability of your own, so a guest can hold
  // meetings having declared nothing at all -- and painting their whole day
  // "not free" would be true and useless.
  const declared = new Set(availability);
  const declaredAnything = declared.size > 0;

  const rows: MeetingColumnRow[] = [];
  for (let row = 1; row <= numSlots; row++) {
    const atRow = byRow.get(row);
    if (atRow) {
      rows.push({
        row,
        span: Math.max(...atRow.map(spanOf)),
        kind: "meetings",
        meetings: atRow,
      });
      continue;
    }
    if (covered.has(row)) continue;

    const start = new Date(day.start.getTime() + (row - 1) * slotMs);
    const free = !declaredAnything || declared.has(start.toISOString());
    if (free) {
      rows.push({ row, span: 1, kind: "free", meetings: [] });
      continue;
    }
    rows.push({ row, span: 1, kind: "unavailable", meetings: [] });
  }

  // Nothing declared and nothing booked is not a column at all; the caller
  // decides that, but it should not have to filter empty "free" rows.
  return declaredAnything || meetings.length > 0 ? rows : [];
}
