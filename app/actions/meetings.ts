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
import { serverNow } from "@/utils/dev-clock-server";
import { meetingSlotsForDay } from "@/utils/meeting-slots";
import type { Event } from "@/db/repositories/interfaces";

export type MeetingActionResult = { ok: true } | { ok: false; error: string };

// A "use server" export is a public endpoint behind site auth, so the types
// these schemas describe are advisory: every payload is parsed rather than
// trusted, and a malformed one comes back as a result instead of throwing.
//
// The lengths are the only bound on two free-text fields that are stored
// verbatim and shown to the recipient; they are generous rather than tuned.
const requestSchema = z.object({
  eventId: z.string(),
  recipientId: z.string(),
  slotStart: z.string(),
  meetingPoint: z.string().max(200),
  message: z.string().max(2000).optional(),
});

const availabilitySchema = z.object({
  eventId: z.string(),
  slotStarts: z.array(z.string()),
});

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

export async function requestMeetingAction(
  raw: z.input<typeof requestSchema>
): Promise<MeetingActionResult> {
  await requireSiteAuth();

  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid request" };
  const input = parsed.data;

  const requesterId = await verifiedCurrentUser(await cookies());
  if (!requesterId) {
    return { ok: false, error: "Sign in to request a meeting" };
  }
  if (requesterId === input.recipientId) {
    return { ok: false, error: "You can't book a meeting with yourself" };
  }

  // Presets are a convenience, not a constraint -- but "we'll figure it out"
  // is not an option, so some place has to be named.
  const meetingPoint = input.meetingPoint.trim();
  if (!meetingPoint) {
    return { ok: false, error: "Choose or type where to meet" };
  }

  const repos = getRepositories();
  const event = await repos.events.findById(input.eventId);
  if (!event) return { ok: false, error: "Event not found" };
  if (!event.meetingsEnabled) {
    return { ok: false, error: "Meetings are not enabled for this event" };
  }

  const attending = await repos.guests.listEventsByGuests([
    requesterId,
    input.recipientId,
  ]);
  const attends = (id: string) =>
    attending.get(id)?.some((e) => e.id === event.id) ?? false;
  if (!attends(requesterId)) {
    return { ok: false, error: "You are not attending this event" };
  }
  if (!attends(input.recipientId)) {
    return { ok: false, error: "They are not attending this event" };
  }

  const offered = await eventSlotStarts(event);
  if (!offered.has(input.slotStart)) {
    return { ok: false, error: "That slot is not available" };
  }

  // A multi-day event goes on offering yesterday's slots, and the open-request
  // cap only counts requests still ahead -- so without this, day one stays
  // bookable on day three and every request against it is free of the cap.
  const now = await serverNow();
  if (new Date(input.slotStart) <= now) {
    return { ok: false, error: "That slot has already passed" };
  }

  // A slot they cleared is the one hard no in the feature: a clash is only a
  // warning the requester already waved through, but this is their decision.
  const declared = await repos.meetingAvailability.listByGuestAndEvent(
    input.recipientId,
    event.id
  );
  if (!declared.some((slot) => slot.toISOString() === input.slotStart)) {
    return { ok: false, error: "They are not available at that time" };
  }

  // The slot's length is the event's schedule increment, never the caller's.
  const slotStart = new Date(input.slotStart);
  const slotEnd = new Date(
    slotStart.getTime() + event.slotIncrementMinutes * 60 * 1000
  );

  const outcome = await repos.meetings.createIfAllowed(
    {
      eventId: event.id,
      requesterId,
      recipientId: input.recipientId,
      slotStart,
      slotEnd,
      meetingPoint,
      message: input.message?.trim() ?? "",
      createdAt: now,
    },
    event.maxOpenMeetingRequests,
    now
  );
  if ("refused" in outcome) {
    return {
      ok: false,
      error:
        outcome.refused === "duplicate"
          ? "You have already asked them for that slot"
          : `You already have ${event.maxOpenMeetingRequests} requests waiting for an answer. Wait for a reply, or cancel one first.`,
    };
  }

  return { ok: true };
}

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
