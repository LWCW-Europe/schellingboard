import type { ReminderKind } from "@/db/repositories/interfaces";

// Pure due-time arithmetic and eligibility for the two attendee-count
// reminders. No I/O and no next/headers: the whole reschedule matrix from the
// spec is decided here, in the unit tier, so dispatch needs only a handful of
// seeded database tests.

export const HEADS_UP_LEAD_MINUTES = 60;
export const FOLLOW_UP_DELAY_MINUTES = 15;
export const RESCHEDULE_GUARD_MINUTES = 90;
export const ABANDON_AFTER_HOURS = 24;

const MINUTE_MS = 60 * 1000;

// An hour before the *displayed* start (stored start plus the event's break),
// which is the time the email itself prints. Deriving it from the stored start
// would send the heads-up an hour and one break before that.
export function headsUpDueTime(startTime: Date, breakMinutes: number): Date {
  return new Date(
    startTime.getTime() + (breakMinutes - HEADS_UP_LEAD_MINUTES) * MINUTE_MS
  );
}

export function followUpDueTime(endTime: Date): Date {
  return new Date(endTime.getTime() + FOLLOW_UP_DELAY_MINUTES * MINUTE_MS);
}

export function headsUpEligible({
  now,
  startTime,
  endTime,
  breakMinutes,
  storedDueTime,
  alreadyNotifiedHost,
}: {
  now: Date;
  startTime: Date;
  endTime: Date;
  breakMinutes: number;
  storedDueTime: Date | null;
  // Fed from the notification, not from any mail marker: a failed send clears
  // what gates a retry, and asking "did they already get one" of that field
  // let a reschedule slip a second heads-up through (research.md §14).
  alreadyNotifiedHost: boolean;
}): boolean {
  const due = headsUpDueTime(startTime, breakMinutes);
  if (now < due) return false;
  // Once the session is over the heads-up can serve neither of its purposes,
  // so a late dispatch drops it (FR-013).
  if (now >= endTime) return false;

  if (!alreadyNotifiedHost) return true;
  if (sameInstant(storedDueTime, due)) return false;

  // The reschedule guard (FR-014). Expressed as "the heads-up this host
  // already received went out 90 minutes or less before the new displayed
  // start" — it is still a useful warning for the new slot, so a second one
  // moments later is noise.
  //
  // Deliberately not the `now >= displayedStart - 90 min` form sketched in
  // research.md §5: a heads-up is only ever due from displayedStart - 60 min
  // onwards, so that condition holds every time it is evaluated and would
  // suppress *every* re-send, including the three-hours-out move the spec
  // requires to re-arm (User Story 2, scenario 10).
  const displayedStart = new Date(
    startTime.getTime() + breakMinutes * MINUTE_MS
  );
  const sentAgo = displayedStart.getTime() - (storedDueTime?.getTime() ?? 0);
  return sentAgo > RESCHEDULE_GUARD_MINUTES * MINUTE_MS;
}

export function followUpEligible({
  now,
  endTime,
  hasRecordedCount,
  storedDueTime,
  storedClaimedAt,
}: {
  now: Date;
  endTime: Date;
  hasRecordedCount: boolean;
  storedDueTime: Date | null;
  // The claim, not the send: a reminder can settle with nothing to mail, so
  // the claim is the only field that always means "this due time is handled".
  storedClaimedAt: Date | null;
}): boolean {
  if (hasRecordedCount) return false;
  if (now < followUpDueTime(endTime)) return false;
  // A stored due time that no longer matches means the end moved, which
  // re-arms the follow-up; an equal one with the claim cleared means the last
  // send failed and is owed a retry. Never dropped for lateness.
  return !(
    sameInstant(storedDueTime, followUpDueTime(endTime)) &&
    storedClaimedAt !== null
  );
}

// One line for the notification list, mirroring the matching email's subject.
// Names the session and the ask and nothing else: a notification renders on a
// (site) page, where guest switching is unauthenticated (FR-022).
export function reminderNoticeText(kind: ReminderKind, title: string): string {
  return kind === "headsUp"
    ? `You're hosting "${title}" shortly — count the people who come`
    : `How many people came to "${title}"?`;
}

function sameInstant(a: Date | null, b: Date): boolean {
  return a !== null && a.getTime() === b.getTime();
}
