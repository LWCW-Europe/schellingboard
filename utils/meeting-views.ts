import { DateTime } from "luxon";
import { getRepositories } from "@/db/container";
import type { MeetingStatus } from "@/db/repositories/interfaces";
import { clashesForInterval, loadGuestSchedules } from "@/utils/guest-clashes";
import { toMeetingClashes } from "@/utils/meeting-clash-text";
import type { MeetingClash } from "@/utils/meeting-clash-text";

/**
 * A stored status, or "expired" — a pending request whose slot has begun.
 * Derived on read so nothing has to sweep the table on a timer
 * (issue #392, section 2.4).
 */
export type MeetingViewStatus = MeetingStatus | "expired";

/** One of the viewer's 1-on-1s, ready to render: no ids of anyone's else's. */
export type MeetingView = {
  id: string;
  status: MeetingViewStatus;
  /** Which side the viewer is on — only a recipient can answer. */
  role: "requester" | "recipient";
  otherName: string;
  /** ISO instants, for placing the meeting on the schedule grid. */
  slotStart: string;
  slotEnd: string;
  /** Both in the event's timezone, as the picker labels its slots. */
  dayLabel: string;
  timeLabel: string;
  meetingPoint: string;
  message: string;
  /** Either party's commitments in the slot, so both can weigh the clash. */
  clashes: MeetingClash[];
};

/**
 * The viewer's own 1-on-1s at an event, in every state — the caller decides
 * what to show, since the grid drops declined and expired ones while the modal
 * a notification links to must still explain them.
 *
 * Clashes are computed here rather than in the browser: they rest on other
 * guests' RSVPs, which never leave the server.
 */
export async function meetingViewsFor(
  viewerId: string,
  eventId: string,
  now: Date
): Promise<MeetingView[]> {
  const repos = getRepositories();
  const event = await repos.events.findById(eventId);
  if (!event) return [];

  const meetings = await repos.meetings.listByGuestAndEvent(viewerId, eventId);
  if (meetings.length === 0) return [];

  const otherIds = new Set(
    meetings.map((m) =>
      m.requesterId === viewerId ? m.recipientId : m.requesterId
    )
  );
  // Loaded once for everyone involved: a guest's schedule is several queries,
  // and the same person may appear in several of these meetings.
  const schedules = await loadGuestSchedules(eventId, [viewerId, ...otherIds]);
  const byGuest = new Map(schedules.map((s) => [s.guestId, s]));

  const zoned = (date: Date) =>
    DateTime.fromJSDate(date).setZone(event.timezone);

  return meetings.map((meeting) => {
    const otherId =
      meeting.requesterId === viewerId
        ? meeting.recipientId
        : meeting.requesterId;
    const involved = [byGuest.get(viewerId), byGuest.get(otherId)].filter(
      (schedule) => schedule !== undefined
    );
    const clashes = clashesForInterval(involved, {
      eventId,
      start: meeting.slotStart,
      end: meeting.slotEnd,
      breakMinutes: event.breakMinutes,
      detailFor: viewerId,
      // An accepted meeting counts as busy, so without this every one of them
      // would report itself as its own clash.
      excludeMeetingId: meeting.id,
    });
    return {
      id: meeting.id,
      status:
        meeting.status === "pending" &&
        meeting.slotStart.getTime() <= now.getTime()
          ? "expired"
          : meeting.status,
      role: meeting.requesterId === viewerId ? "requester" : "recipient",
      otherName: byGuest.get(otherId)?.guestName ?? "Someone",
      slotStart: meeting.slotStart.toISOString(),
      slotEnd: meeting.slotEnd.toISOString(),
      dayLabel: zoned(meeting.slotStart).toFormat("EEE d LLL"),
      timeLabel: `${zoned(meeting.slotStart).toFormat("HH:mm")} – ${zoned(
        meeting.slotEnd
      ).toFormat("HH:mm")}`,
      meetingPoint: meeting.meetingPoint,
      message: meeting.message,
      clashes: toMeetingClashes(clashes, viewerId),
    };
  });
}
