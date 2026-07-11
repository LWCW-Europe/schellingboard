// Decides which schedule days start out folded (collapsed) for the viewer.

type DayWindow = {
  id: string;
  end: Date;
};

/**
 * Days that have fully passed are folded by default so the schedule opens on
 * what's current. Exception: when every day has passed the schedule is an
 * archive, so nothing is folded.
 */
export function getDefaultFoldedDayIds(
  days: DayWindow[],
  now: Date
): Set<string> {
  const past = days.filter((day) => day.end.getTime() <= now.getTime());
  if (past.length === days.length) return new Set();
  return new Set(past.map((day) => day.id));
}
