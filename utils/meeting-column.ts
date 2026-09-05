import type { MeetingView } from "@/utils/meeting-views";

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
 * The column's rows for one day. Free slots stay one row each — each is
 * separately bookable — while the slots the viewer cleared merge into one
 * band, since four identical "not free" cells say nothing four times.
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
  const rowOf = (start: string) =>
    Math.round((new Date(start).getTime() - day.start.getTime()) / slotMs) + 1;

  const byRow = new Map<number, MeetingView[]>();
  for (const meeting of meetings) {
    const row = rowOf(meeting.slotStart);
    byRow.set(row, [...(byRow.get(row) ?? []), meeting]);
  }
  // A meeting is one slot long -- but an event whose increment changed since
  // can leave an older one covering more than one row.
  const spanOf = (meeting: MeetingView) =>
    Math.max(
      1,
      Math.ceil(
        (new Date(meeting.slotEnd).getTime() -
          new Date(meeting.slotStart).getTime()) /
          slotMs
      )
    );

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
    const last = rows[rows.length - 1];
    if (last?.kind === "unavailable" && last.row + last.span === row) {
      last.span += 1;
      continue;
    }
    rows.push({ row, span: 1, kind: "unavailable", meetings: [] });
  }

  // Nothing declared and nothing booked is not a column at all; the caller
  // decides that, but it should not have to filter empty "free" rows.
  return declaredAnything || meetings.length > 0 ? rows : [];
}
