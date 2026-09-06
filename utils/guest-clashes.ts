import { getRepositories } from "@/db/container";
import type { Meeting, Session } from "@/db/repositories/interfaces";
import { newEmptySession, sessionsOverlap } from "@/app/(site)/session_utils";
import { getStartTimePlusBreak } from "./utils";

// A schedule clash for one guest, computed server-side so their RSVPs and
// meetings never reach the client. Only `detailFor`'s RSVPs and 1-on-1s are
// described; everyone else's collapse to "busy" with no title.
export type GuestClash = {
  guestId: string;
  guestName: string;
  kind: "hosting" | "attending" | "meeting" | "busy";
  /** The session, for a hosting or attending clash; null otherwise. */
  title: string | null;
  /** ISO strings; `start` is break-adjusted for display, matching the schedule. */
  start: string;
  end: string;
};

/**
 * One guest's commitments at an event. Loaded once and asked about many
 * intervals: the slot picker checks a hundred of them, and reloading per
 * interval would be hundreds of queries for one screen.
 */
export type GuestSchedule = {
  guestId: string;
  guestName: string;
  hosted: Session[];
  rsvpd: Session[];
  meetings: Meeting[];
};

export async function loadGuestSchedules(
  eventId: string,
  guestIds: string[]
): Promise<GuestSchedule[]> {
  const repos = getRepositories();
  const schedules: GuestSchedule[] = [];
  for (const guestId of guestIds) {
    const guest = await repos.guests.findById(guestId);
    if (!guest) continue;
    const [hosted, rsvpd, meetings] = await Promise.all([
      repos.sessions.listHostedByGuest(guestId),
      repos.sessions.listRsvpdByGuest(guestId),
      repos.meetings.listByGuestAndEvent(guestId, eventId),
    ]);
    schedules.push({
      guestId,
      guestName: guest.name,
      hosted,
      rsvpd,
      meetings,
    });
  }
  return schedules;
}

/**
 * Everything in `schedules` that overlaps [start, end). The one place the
 * clash rule lives: the session form asks about a single candidate, the slot
 * picker asks about every slot of the event.
 */
export function clashesForInterval(
  schedules: GuestSchedule[],
  opts: {
    eventId: string;
    start: Date;
    end: Date;
    breakMinutes: number;
    /** The session being edited, which must not clash with itself. */
    excludeSessionId?: string | null;
    /** The meeting being examined, which must not clash with itself. */
    excludeMeetingId?: string;
    /** Whose own diary may be described in full: an RSVP or 1-on-1 of theirs
        is no secret from them, though it is from everyone else. */
    detailFor?: string;
  }
): GuestClash[] {
  const {
    eventId,
    start,
    end,
    breakMinutes,
    excludeSessionId,
    excludeMeetingId,
    detailFor,
  } = opts;

  // sessionsOverlap skips a session whose id matches the candidate's, which is
  // how the session being edited is excluded from clashing with itself.
  const candidate: Session = {
    ...newEmptySession(eventId),
    id: excludeSessionId ?? "",
    startTime: start,
    endTime: end,
  };

  // A type predicate, not a plain filter, so the scheduled times survive into
  // the loops below instead of needing a non-null assertion at each use.
  const inEventAndOverlapping = (
    ses: Session
  ): ses is Session & { startTime: Date; endTime: Date } =>
    ses.eventId === eventId &&
    ses.startTime != null &&
    ses.endTime != null &&
    sessionsOverlap(ses, candidate);

  const clashes: GuestClash[] = [];

  for (const schedule of schedules) {
    const describe = schedule.guestId === detailFor;
    const hostingClashes = schedule.hosted.filter(inEventAndOverlapping);
    const hostingIds = new Set(hostingClashes.map((s) => s.id));

    for (const ses of hostingClashes) {
      clashes.push({
        guestId: schedule.guestId,
        guestName: schedule.guestName,
        kind: "hosting",
        title: ses.title,
        start: getStartTimePlusBreak(ses.startTime, breakMinutes).toISO()!,
        end: ses.endTime.toISOString(),
      });
    }

    // A host RSVP'ing to a session they also host is already reported above.
    for (const ses of schedule.rsvpd.filter(inEventAndOverlapping)) {
      if (hostingIds.has(ses.id)) continue;
      clashes.push({
        guestId: schedule.guestId,
        guestName: schedule.guestName,
        kind: describe ? "attending" : "busy",
        title: describe ? ses.title : null,
        start: getStartTimePlusBreak(ses.startTime, breakMinutes).toISO()!,
        end: ses.endTime.toISOString(),
      });
    }

    // Only accepted ones: a pending request is not yet a commitment, and
    // declined or canceled ones never were. Who the meeting is with is as
    // private as an RSVP, so it reports busy with no title.
    for (const meeting of schedule.meetings) {
      if (meeting.status !== "accepted") continue;
      if (meeting.id === excludeMeetingId) continue;
      if (
        meeting.slotStart.getTime() >= end.getTime() ||
        meeting.slotEnd.getTime() <= start.getTime()
      ) {
        continue;
      }
      clashes.push({
        guestId: schedule.guestId,
        guestName: schedule.guestName,
        kind: describe ? "meeting" : "busy",
        title: null,
        start: meeting.slotStart.toISOString(),
        end: meeting.slotEnd.toISOString(),
      });
    }
  }

  return clashes;
}
