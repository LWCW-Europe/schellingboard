"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { requireSiteAuth } from "@/utils/action-auth";
import { meetingSlotsForDay } from "@/utils/meeting-slots";
import type { Event } from "@/db/repositories/interfaces";

export type MeetingActionResult = { ok: true } | { ok: false; error: string };

/**
 * Every slot start the event offers, as ISO strings. Deliberately not
 * exported: an export from a "use server" module is a client-callable
 * endpoint, and this is a helper.
 */
async function eventSlotStarts(event: Event): Promise<Set<string>> {
  const days = await getRepositories().days.listByEvent(event.id);
  return new Set(
    days.flatMap((day) =>
      meetingSlotsForDay(day, event.slotIncrementMinutes).map((slot) =>
        slot.start.toISOString()
      )
    )
  );
}

export async function saveMeetingAvailabilityAction(input: {
  eventId: string;
  slotStarts: string[];
}): Promise<MeetingActionResult> {
  await requireSiteAuth();

  // Site auth is shared with every attendee, so it cannot be the gate on
  // writing one guest's own availability.
  const guestId = await verifiedCurrentUser(await cookies());
  if (!guestId) {
    return { ok: false, error: "Sign in to set your availability" };
  }

  const repos = getRepositories();
  const event = await repos.events.findById(input.eventId);
  if (!event) return { ok: false, error: "Event not found" };
  if (!event.meetingsEnabled) {
    return { ok: false, error: "Meetings are not enabled for this event" };
  }

  const attending = await repos.guests.listEventsByGuests([guestId]);
  if (!attending.get(guestId)?.some((e) => e.id === event.id)) {
    return { ok: false, error: "You are not attending this event" };
  }

  // Slots are derived, so the submitted starts are checked against the ones
  // the event actually offers: a hand-made payload must not be able to declare
  // a guest free at an instant that is not a slot at all.
  const offered = await eventSlotStarts(event);
  const declared = [...new Set(input.slotStarts)];
  if (declared.some((slot) => !offered.has(slot))) {
    return { ok: false, error: "Those slots are no longer available" };
  }

  await repos.meetingAvailability.replaceForGuest(
    guestId,
    event.id,
    declared.map((slot) => new Date(slot))
  );

  revalidatePath(`/${event.slug}/meetings`);
  return { ok: true };
}
