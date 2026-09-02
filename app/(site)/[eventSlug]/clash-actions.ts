"use server";

import { getRepositories } from "@/db/container";
import type { Session } from "@/db/repositories/interfaces";
import { requireVerifiedGuest } from "@/utils/action-auth";
import { getStartTimePlusBreak } from "@/utils/utils";
import { newEmptySession, sessionsOverlap } from "../session_utils";

// A schedule clash for one guest, computed server-side so their private RSVPs
// and meetings never reach the client. Hosting a session is public, so those
// clashes name the session; RSVP'd sessions and agreed 1-on-1s are private, so
// those only report that the guest is "busy" for the overlapping interval —
// never which session, or who the meeting is with.
export type GuestClash = {
  guestName: string;
  kind: "hosting" | "busy";
  // Only set for hosting clashes (public); null for busy/RSVP clashes.
  title: string | null;
  // ISO strings; `start` is break-adjusted for display, matching the schedule.
  start: string;
  end: string;
};

export async function detectGuestClashes(input: {
  eventId: string;
  guestIds: string[];
  start: string; // ISO — candidate session start
  end: string; // ISO — candidate session end
  excludeSessionId?: string | null;
}): Promise<GuestClash[]> {
  // Site auth is shared with every attendee, so it can't be the gate on a
  // reply that reports when another guest is privately busy.
  await requireVerifiedGuest("checking host availability");
  const { eventId, guestIds, start, end, excludeSessionId } = input;
  if (guestIds.length === 0) return [];

  const repos = getRepositories();
  const event = await repos.events.findById(eventId);
  if (!event) return [];
  const breakMinutes = event.breakMinutes;

  // sessionsOverlap skips a session whose id matches the candidate's, which is
  // how the session being edited is excluded from clashing with itself.
  const candidate: Session = {
    ...newEmptySession(eventId),
    id: excludeSessionId ?? "",
    startTime: new Date(start),
    endTime: new Date(end),
  };

  const inEventAndOverlapping = (ses: Session) =>
    ses.eventId === eventId &&
    ses.startTime != null &&
    ses.endTime != null &&
    sessionsOverlap(ses, candidate);

  const clashes: GuestClash[] = [];

  for (const guestId of guestIds) {
    const guest = await repos.guests.findById(guestId);
    if (!guest) continue;

    const [hosted, rsvpd, meetings] = await Promise.all([
      repos.sessions.listHostedByGuest(guestId),
      repos.sessions.listRsvpdByGuest(guestId),
      repos.meetings.listByGuestAndEvent(guestId, eventId),
    ]);

    const hostingClashes = hosted.filter(inEventAndOverlapping);
    const hostingIds = new Set(hostingClashes.map((s) => s.id));

    for (const ses of hostingClashes) {
      clashes.push({
        guestName: guest.name,
        kind: "hosting",
        title: ses.title,
        start: getStartTimePlusBreak(ses, breakMinutes).toISO()!,
        end: ses.endTime!.toISOString(),
      });
    }

    // A host RSVP'ing to a session they also host is already reported above.
    for (const ses of rsvpd.filter(inEventAndOverlapping)) {
      if (hostingIds.has(ses.id)) continue;
      clashes.push({
        guestName: guest.name,
        kind: "busy",
        title: null,
        start: getStartTimePlusBreak(ses, breakMinutes).toISO()!,
        end: ses.endTime!.toISOString(),
      });
    }

    // Only accepted ones: a pending request is not yet a commitment, and
    // declined or canceled ones never were. Who the meeting is with is as
    // private as an RSVP, so it reports busy with no title.
    for (const meeting of meetings) {
      if (meeting.status !== "accepted") continue;
      if (
        meeting.slotStart.getTime() >= candidate.endTime!.getTime() ||
        meeting.slotEnd.getTime() <= candidate.startTime!.getTime()
      ) {
        continue;
      }
      clashes.push({
        guestName: guest.name,
        kind: "busy",
        title: null,
        start: meeting.slotStart.toISOString(),
        end: meeting.slotEnd.toISOString(),
      });
    }
  }

  return clashes;
}
