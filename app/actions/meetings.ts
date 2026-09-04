"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";
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

// A "use server" export is a public endpoint behind site auth, so the types
// above it are advisory: the payload is parsed rather than trusted, and a
// malformed one comes back as a result instead of throwing.
const availabilitySchema = z.object({
  eventId: z.string(),
  slotStarts: z.array(z.string()),
});

export async function saveMeetingAvailabilityAction(
  raw: z.input<typeof availabilitySchema>
): Promise<MeetingActionResult> {
  await requireSiteAuth();

  const parsed = availabilitySchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid request" };
  const input = parsed.data;

  // Site auth is shared with every attendee, so it cannot be the gate on
  // writing one guest's own availability.
  const cookieStore = await cookies();
  const guestId = await verifiedCurrentUser(cookieStore);
  if (!guestId) {
    // Shared with the page, so the copy can't drift -- and so a protected name
    // selected without verifying is told to switch to it, not to "sign in".
    return {
      ok: false,
      error: await unverifiedUserMessage(
        cookieStore,
        "setting your meeting availability"
      ),
    };
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
