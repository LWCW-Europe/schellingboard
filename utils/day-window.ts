// Predicates relating a scheduled session to a day's time window. Shared so the
// delete-cascade, the edit guard, and the admin UI warning all agree on which
// sessions a day window affects.

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
