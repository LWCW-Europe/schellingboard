import type {
  Day,
  Location,
  Guest,
  Session,
  SessionCreateInput,
} from "@/db/repositories/interfaces";

export type SessionParams = {
  id?: string;
  title: string;
  description: string;
  closed: boolean;
  hosts: Guest[];
  location: Location;
  /** The day is resolved from the store: its window bounds what may be booked. */
  dayId: string;
  /**
   * The chosen slot as an ISO instant, not a time of day: a day window may run
   * past midnight, so a wall-clock time alone doesn't say which date it means.
   */
  startTime: string;
  duration: number;
  proposal?: string;
};

export type SessionInterval = {
  start: Date;
  end: Date;
};

export function buildSessionInterval(
  startTime: Date,
  durationMinutes: number
): SessionInterval {
  return {
    start: startTime,
    end: new Date(startTime.getTime() + durationMinutes * 60 * 1000),
  };
}

export function prepareToInsert(
  params: SessionParams,
  day: Day
): SessionCreateInput {
  const { title, description, closed, hosts, location, duration } = params;
  const { start, end } = buildSessionInterval(
    new Date(params.startTime),
    duration
  );
  return {
    title,
    description,
    closed,
    hostIds: hosts.map((host) => host.id),
    locationIds: [location.id],
    startTime: start,
    endTime: end,
    capacity: location.capacity ?? 0,
    adminManaged: false,
    blocker: false,
    proposalId: params.proposal ?? undefined,
    eventId: day.eventId,
  };
}

export const validateSession = (
  session: SessionCreateInput,
  existingSessions: Session[]
) => {
  const sessionStart = session.startTime ?? new Date(0);
  const sessionEnd = session.endTime ?? new Date(0);
  const sessionStartsBeforeEnds = sessionStart < sessionEnd;
  const sessionStartsAfterNow = sessionStart > new Date();
  const sessionsHere = existingSessions.filter((s) => {
    return s.locations.some((l) => l.id === session.locationIds[0]);
  });
  const concurrentSessions = sessionsHere.filter((existing) => {
    const existingStart = existing.startTime ?? new Date(0);
    const existingEnd = existing.endTime ?? new Date(0);
    return existingStart < sessionEnd && existingEnd > sessionStart;
  });
  const sessionValid =
    sessionStartsBeforeEnds &&
    sessionStartsAfterNow &&
    concurrentSessions.length === 0 &&
    session.title &&
    session.locationIds[0] &&
    session.hostIds[0];
  return sessionValid;
};
