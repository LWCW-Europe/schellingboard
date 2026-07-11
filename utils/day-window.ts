// Predicates relating a scheduled session to a day's time window, and rules
// for validating a day's own window against its event and sibling days.
// Shared so the delete-cascade, the edit guard, the admin UI warning, and the
// day-creation entry points (admin action and admin API route) all agree.

import { isSlotAligned } from "@/utils/slots";

type ScheduledTimes = {
  startTime?: Date | null;
  endTime?: Date | null;
};

/** True when the session shares any time with [windowStart, windowEnd). */
export function sessionOverlapsWindow(
  session: ScheduledTimes,
  windowStart: Date,
  windowEnd: Date
): boolean {
  if (!session.startTime || !session.endTime) return false;
  return session.startTime < windowEnd && session.endTime > windowStart;
}

/** True when the session falls entirely inside [windowStart, windowEnd]. */
export function sessionContainedInWindow(
  session: ScheduledTimes,
  windowStart: Date,
  windowEnd: Date
): boolean {
  if (!session.startTime || !session.endTime) return false;
  return session.startTime >= windowStart && session.endTime <= windowEnd;
}

/** True when [aStart, aEnd) and [bStart, bEnd) share any time. */
export function daysOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

type DayWindow = {
  start: Date;
  end: Date;
  startBookings: Date;
  endBookings: Date;
};

// The schedule grid anchors its slots at the day start, so the day end and
// both booking boundaries must sit a whole number of slots from it.
export function dayAlignmentError(
  day: DayWindow,
  incrementMinutes: number
): string | null {
  const aligned =
    isSlotAligned(day.end, day.start, incrementMinutes) &&
    isSlotAligned(day.startBookings, day.start, incrementMinutes) &&
    isSlotAligned(day.endBookings, day.start, incrementMinutes);
  return aligned
    ? null
    : `Day and bookings windows must be aligned to the event's ${incrementMinutes}-minute slots`;
}
