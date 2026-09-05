import { getRepositories } from "@/db/container";
import { serverNow } from "@/utils/dev-clock-server";
import { meetingSlotsForDay } from "@/utils/meeting-slots";
import {
  clashesForInterval,
  loadGuestSchedules,
  type GuestClash,
} from "@/utils/guest-clashes";
import { DateTime } from "luxon";
import type { Event, MeetingPoint } from "@/db/repositories/interfaces";

/** One slot of the picker, in the three states of the design (issue #392). */
export type MeetingSlotOption = {
  start: string;
  label: string;
  state: "available" | "busy" | "unavailable";
  /** Why it reads as busy. Empty unless `state` is "busy". */
  clashes: (Pick<GuestClash, "guestName" | "kind" | "title"> & {
    /** The viewer's own clash, so the warning can say "you" rather than
        naming the reader back to themselves in the third person. */
    isViewer: boolean;
  })[];
};

/**
 * One day's worth of the picker. Slots are grouped rather than each carrying
 * its own day label: this ships on every profile open, for every shared event,
 * and the label is the same string for every slot of the day.
 */
export type MeetingDayOption = {
  label: string;
  slots: MeetingSlotOption[];
};

export type MeetingOption = {
  eventId: string;
  eventName: string;
  meetingPoints: Pick<MeetingPoint, "id" | "name" | "description">[];
  days: MeetingDayOption[];
};

/**
 * What the viewer may book with `recipientId`, one entry per event they both
 * attend where meetings are on and the recipient is bookable. Empty means no
 * button: the profile shows nothing rather than a dead control.
 *
 * `events` is the site's event list, passed in rather than looked up per
 * shared event: the caller already holds it.
 */
export async function meetingOptionsFor(
  viewerId: string | null,
  recipientId: string,
  events: Event[]
): Promise<MeetingOption[]> {
  // Booking yourself is not a thing, and an unidentified visitor has no
  // schedule to compare against.
  if (!viewerId || viewerId === recipientId) return [];

  const repos = getRepositories();
  const attending = await repos.guests.listEventsByGuests([
    viewerId,
    recipientId,
  ]);
  const viewerEvents = attending.get(viewerId) ?? [];
  const sharedIds = new Set(
    (attending.get(recipientId) ?? []).map((e) => e.id)
  );

  const now = await serverNow();
  const options: MeetingOption[] = [];
  for (const { id: eventId } of viewerEvents) {
    if (!sharedIds.has(eventId)) continue;
    const event = events.find((e) => e.id === eventId);
    if (!event?.meetingsEnabled) continue;

    const declared = await repos.meetingAvailability.listByGuestAndEvent(
      recipientId,
      eventId
    );
    // No declared slots is exactly the state of someone who never switched
    // meetings on, so there is nothing to offer.
    if (declared.length === 0) continue;
    const declaredStarts = new Set(declared.map((d) => d.toISOString()));

    const [days, meetingPoints, schedules] = await Promise.all([
      repos.days.listByEvent(eventId),
      repos.meetingPoints.listByEvent(eventId),
      // Both parties: a clash of the viewer's own is a warning they want too.
      loadGuestSchedules(eventId, [recipientId, viewerId]),
    ]);

    const zoned = (date: Date) =>
      DateTime.fromJSDate(date).setZone(event.timezone);

    const dayOptions: MeetingDayOption[] = [];
    for (const day of days) {
      const slots: MeetingSlotOption[] = [];
      for (const slot of meetingSlotsForDay(day, event.slotIncrementMinutes)) {
        // Day one of a three-day event stops being bookable once it is past --
        // and the organizer's cap only counts requests still ahead.
        if (slot.start <= now) continue;
        const start = slot.start.toISOString();
        const label = `${zoned(slot.start).toFormat("HH:mm")} – ${zoned(
          slot.end
        ).toFormat("HH:mm")}`;
        if (!declaredStarts.has(start)) {
          slots.push({ start, label, state: "unavailable", clashes: [] });
          continue;
        }
        const clashes = clashesForInterval(schedules, {
          eventId,
          start: slot.start,
          end: slot.end,
          breakMinutes: event.breakMinutes,
        });
        slots.push({
          start,
          label,
          // Busy is a warning, never a wall: still selectable.
          state: clashes.length > 0 ? "busy" : "available",
          clashes: clashes.map(({ guestId, guestName, kind, title }) => ({
            guestName,
            kind,
            title,
            isViewer: guestId === viewerId,
          })),
        });
      }
      if (slots.length > 0) {
        dayOptions.push({
          label: zoned(day.start).toFormat("EEE d LLL"),
          slots,
        });
      }
    }

    if (dayOptions.length === 0) continue;

    options.push({
      eventId,
      eventName: event.name,
      meetingPoints: meetingPoints.map(({ id, name, description }) => ({
        id,
        name,
        description,
      })),
      days: dayOptions,
    });
  }

  return options;
}
