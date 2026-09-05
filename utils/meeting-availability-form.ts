import { DateTime } from "luxon";
import { getRepositories } from "@/db/container";
import type { Day, Event } from "@/db/repositories/interfaces";
import { meetingSlotsForDay } from "@/utils/meeting-slots";

export type SlotDay = {
  /** Two days may share a date, so the id is what keys them apart. */
  id: string;
  label: string;
  slots: { start: string; label: string }[];
};

/** Everything one event's availability form needs, ready to render. */
export type AvailabilityFormData = {
  eventId: string;
  eventName: string;
  timezone: string;
  days: SlotDay[];
  /** ISO slot starts, already narrowed to what the event still offers. */
  declared: string[];
};

/**
 * One form per event the guest can still be booked at: attended, offering
 * 1-on-1s, and with a day still to come -- or none yet, since the organizer
 * may add some. Ordered by when the event starts.
 */
export async function availabilityFormsFor(
  guestId: string,
  now: Date
): Promise<AvailabilityFormData[]> {
  const repos = getRepositories();
  // The assignment lookup carries ids and names only.
  const attending = await Promise.all(
    ((await repos.guests.listEventsByGuests([guestId])).get(guestId) ?? []).map(
      ({ id }) => repos.events.findById(id)
    )
  );
  const offering = attending
    .filter(
      (event): event is Event => event !== undefined && event.meetingsEnabled
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const forms = await Promise.all(
    offering.map(async (event) => {
      const [days, declared] = await Promise.all([
        repos.days.listByEvent(event.id),
        repos.meetingAvailability.listByGuestAndEvent(guestId, event.id),
      ]);
      if (
        days.length > 0 &&
        days.every((d) => d.end.getTime() <= now.getTime())
      ) {
        return null;
      }
      const slotDays = slotDaysFor(event, days);
      // Only what the event still offers. A day shortened or deleted after
      // someone declared leaves rows for slots the form no longer renders, and
      // the save action refuses any it isn't offering -- so passing them
      // through would leave a form that cannot be saved and nothing to untick.
      const offered = new Set(
        slotDays.flatMap((d) => d.slots.map((s) => s.start))
      );
      return {
        eventId: event.id,
        eventName: event.name,
        timezone: event.timezone,
        days: slotDays,
        declared: declared
          .map((d) => d.toISOString())
          .filter((start) => offered.has(start)),
      };
    })
  );
  return forms.filter((form) => form !== null);
}

function slotDaysFor(event: Event, days: Day[]): SlotDay[] {
  const zoned = (date: Date) =>
    DateTime.fromJSDate(date).setZone(event.timezone);
  const dateOf = (day: Day) => zoned(day.start).toFormat("EEE d LLL");

  // Days only have to not overlap, so an event may legitimately run 09:00-12:00
  // and 14:00-18:00 on one date: the date alone is not a unique heading, and
  // the window disambiguates the ones that repeat.
  const dateCounts = new Map<string, number>();
  for (const day of days) {
    dateCounts.set(dateOf(day), (dateCounts.get(dateOf(day)) ?? 0) + 1);
  }

  return days
    .map((day) => ({
      id: day.id,
      label:
        (dateCounts.get(dateOf(day)) ?? 0) > 1
          ? `${dateOf(day)}, ${zoned(day.start).toFormat("HH:mm")}–${zoned(
              day.end
            ).toFormat("HH:mm")}`
          : dateOf(day),
      slots: meetingSlotsForDay(day, event.slotIncrementMinutes).map(
        (slot) => ({
          start: slot.start.toISOString(),
          label: `${zoned(slot.start).toFormat("HH:mm")} – ${zoned(
            slot.end
          ).toFormat("HH:mm")}`,
        })
      ),
    }))
    .filter((day) => day.slots.length > 0);
}
