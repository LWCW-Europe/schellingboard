// Companion to utils/slots.ts, which owns the schedule grid's slot math: these
// are the same grid, stepped from the same increment, and kept separate only
// because a meeting asks a different question of it (which slots exist on a
// day) than the grid does (how tall a row is, what aligns).
//
// 1-on-1 slots are derived, never stored: a day plus the event's slot
// increment is enough to say which slots exist. Availability rows then key on
// a slot's start instant, which is why changing that increment clears them —
// a coarser grid would re-read a declared half-hour as a full hour.

export type MeetingSlot = { start: Date; end: Date };

const MS_PER_MINUTE = 60 * 1000;

/**
 * The slots a day offers, chronologically. Slots run the whole day and are the
 * event's schedule increment long, so they line up with the grid rather than
 * needing a second set of rules; attendees clear the ones they want kept free.
 *
 * A slot the day cannot fit whole is dropped rather than truncated: half a
 * slot is not bookable.
 */
export function meetingSlotsForDay(
  day: { start: Date; end: Date },
  slotMinutes: number
): MeetingSlot[] {
  if (slotMinutes <= 0) return [];

  const slots: MeetingSlot[] = [];
  const step = slotMinutes * MS_PER_MINUTE;
  const to = day.end.getTime();
  for (let start = day.start.getTime(); start + step <= to; start += step) {
    slots.push({ start: new Date(start), end: new Date(start + step) });
  }
  return slots;
}
