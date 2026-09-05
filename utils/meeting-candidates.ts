import { DateTime } from "luxon";

import { getRepositories } from "@/db/container";
import type { MeetingPoint } from "@/db/repositories/interfaces";
import { clashesForInterval, loadGuestSchedules } from "@/utils/guest-clashes";
import { toMeetingClash, type MeetingClash } from "@/utils/meeting-clash-text";
import { meetingSlotsForDay } from "@/utils/meeting-slots";

/** One person the viewer could ask for a 1-on-1 in a given slot. */
export type MeetingCandidate = {
  id: string;
  name: string;
  pronouns: string | null;
  basedIn: string | null;
  avatarUrl: string | null;
  isHost: boolean;
  /**
   * They already have something at that hour. Deliberately a flag and not a
   * description: what it is, is theirs to tell (see `toMeetingClash`).
   */
  busy: boolean;
};

/** Everything the grid's booking flow needs for one slot. */
export type MeetingCandidates = {
  eventName: string;
  dayLabel: string;
  slotLabel: string;
  meetingPoints: Pick<MeetingPoint, "id" | "name" | "description">[];
  /**
   * The viewer's own clash with the slot, named — one line for the whole
   * screen rather than repeated against every candidate.
   */
  yourClashes: MeetingClash[];
  candidates: MeetingCandidate[];
};

/**
 * Who the viewer could meet at `slotStart` — the question the profile picker
 * answers the other way round (`meetingOptionsFor`: when could I meet *them*).
 *
 * Null when there is nothing to offer at all: the event is gone or no longer
 * offers meetings, the viewer is not attending it, or the slot is not one the
 * event still has ahead of it. An empty candidate list is a different answer,
 * and the caller says so differently.
 */
export async function meetingCandidatesFor(
  viewerId: string,
  eventId: string,
  slotStart: string,
  now: Date
): Promise<MeetingCandidates | null> {
  const repos = getRepositories();
  const event = await repos.events.findById(eventId);
  if (!event?.meetingsEnabled) return null;

  const attending = await repos.guests.listEventsByGuests([viewerId]);
  if (!attending.get(viewerId)?.some((e) => e.id === eventId)) return null;

  const start = new Date(slotStart);
  // Ahead of now and a slot the event actually offers: the same two checks the
  // request action makes, so the grid never opens on a booking that would be
  // refused (issue #392, section 2.1).
  if (!(start.getTime() > now.getTime())) return null;
  const days = await repos.days.listByEvent(eventId);
  const day = days.find((d) => start >= d.start && start < d.end);
  if (!day) return null;
  const slot = meetingSlotsForDay(day, event.slotIncrementMinutes).find(
    (s) => s.start.getTime() === start.getTime()
  );
  if (!slot) return null;

  const [declaredIds, eventGuests, attendees, meetingPoints, live] =
    await Promise.all([
      repos.meetingAvailability.listGuestsBySlot(eventId, start),
      repos.guests.listByEvent(eventId),
      repos.guests.listAttendees(),
      repos.meetingPoints.listByEvent(eventId),
      repos.meetings.listLiveBySlot(eventId, start),
    ]);

  // Someone the viewer is already meeting then cannot be asked again -- the
  // request would be refused as a duplicate -- so they are not offered.
  const withViewer = new Set(
    live
      .filter((m) => m.requesterId === viewerId || m.recipientId === viewerId)
      .map((m) => (m.requesterId === viewerId ? m.recipientId : m.requesterId))
  );
  // An agreed 1-on-1 of theirs leaves them busy, without saying so. Only an
  // agreed one: a request they have not answered is not yet a commitment,
  // which is the rule clashesForInterval already applies.
  const inAMeeting = new Set(
    live
      .filter((m) => m.status === "accepted")
      .flatMap((m) => [m.requesterId, m.recipientId])
  );

  // One pass over the event's sessions rather than a schedule per candidate:
  // a popular slot at a big event has dozens of them, and loading four
  // queries per person is what makes a modal take seconds to open.
  const sessions = await repos.sessions.listScheduledByEvent(eventId);
  const overlapping = sessions.filter(
    (session) =>
      session.startTime != null &&
      session.endTime != null &&
      session.startTime < slot.end &&
      session.endTime > slot.start
  );
  const rsvps = await repos.rsvps.listBySessions(overlapping.map((s) => s.id));
  const engaged = new Set<string>([
    ...overlapping.flatMap((s) => s.hosts.map((h) => h.id)),
    ...[...rsvps.values()].flatMap((list) => list.map((r) => r.guestId)),
  ]);

  const attendee = new Map(attendees.map((a) => [a.id, a]));
  const onGuestList = new Set(eventGuests.map((g) => g.id));
  const candidates: MeetingCandidate[] = declaredIds
    .filter(
      (id) => id !== viewerId && onGuestList.has(id) && !withViewer.has(id)
    )
    .flatMap((id) => {
      const guest = attendee.get(id);
      if (!guest) return [];
      return [
        {
          id,
          name: guest.name,
          pronouns: guest.pronouns ?? null,
          basedIn: guest.basedIn ?? null,
          avatarUrl: guest.avatarUrl ?? null,
          isHost: guest.isHost,
          busy: engaged.has(id) || inAMeeting.has(id),
        },
      ];
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // The viewer's own schedule is worth the four queries: theirs is the one
  // clash that may be named, and it is the same line the picker shows.
  const [mine] = await loadGuestSchedules(eventId, [viewerId]);
  const yourClashes = mine
    ? clashesForInterval([mine], {
        eventId,
        start: slot.start,
        end: slot.end,
        breakMinutes: event.breakMinutes,
      }).map((clash) => toMeetingClash(clash, viewerId))
    : [];

  const zoned = (date: Date) =>
    DateTime.fromJSDate(date).setZone(event.timezone);

  return {
    eventName: event.name,
    dayLabel: zoned(slot.start).toFormat("EEE d LLL"),
    slotLabel: `${zoned(slot.start).toFormat("HH:mm")} – ${zoned(
      slot.end
    ).toFormat("HH:mm")}`,
    meetingPoints: meetingPoints.map(({ id, name, description }) => ({
      id,
      name,
      description,
    })),
    yourClashes,
    candidates,
  };
}
