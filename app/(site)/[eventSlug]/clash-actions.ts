"use server";

import { getRepositories } from "@/db/container";
import type { Session } from "@/db/repositories/interfaces";
import { getStartTimePlusBreak } from "@/utils/utils";
import { newEmptySession, sessionsOverlap } from "../session_utils";

// A schedule clash for one host, computed server-side so a host's private
// RSVPs never reach the client. Hosting a session is public, so those clashes
// name the session; RSVP'd sessions are private, so those only report that the
// host is "busy" for the overlapping interval — never which session.
export type HostClash = {
  hostName: string;
  kind: "hosting" | "busy";
  // Only set for hosting clashes (public); null for busy/RSVP clashes.
  title: string | null;
  // ISO strings; `start` is break-adjusted for display, matching the schedule.
  start: string;
  end: string;
};

export async function detectHostClashes(input: {
  eventId: string;
  hostIds: string[];
  start: string; // ISO — candidate session start
  end: string; // ISO — candidate session end
  excludeSessionId?: string | null;
}): Promise<HostClash[]> {
  const { eventId, hostIds, start, end, excludeSessionId } = input;
  if (hostIds.length === 0) return [];

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

  const clashes: HostClash[] = [];

  for (const hostId of hostIds) {
    const guest = await repos.guests.findById(hostId);
    if (!guest) continue;

    const [hosted, rsvpd] = await Promise.all([
      repos.sessions.listHostedByGuest(hostId),
      repos.sessions.listRsvpdByGuest(hostId),
    ]);

    const hostingClashes = hosted.filter(inEventAndOverlapping);
    const hostingIds = new Set(hostingClashes.map((s) => s.id));

    for (const ses of hostingClashes) {
      clashes.push({
        hostName: guest.name,
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
        hostName: guest.name,
        kind: "busy",
        title: null,
        start: getStartTimePlusBreak(ses, breakMinutes).toISO()!,
        end: ses.endTime!.toISOString(),
      });
    }
  }

  return clashes;
}
