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
import {
  notifyMeetingOutcome,
  notifyMeetingRequested,
} from "@/utils/notifications";
import type { Event, MeetingStatus } from "@/db/repositories/interfaces";

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

const respondSchema = z.object({
  meetingId: z.string(),
  response: z.enum(["accept", "decline"]),
});

const cancelSchema = z.object({ meetingId: z.string() });

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

  await notifyMeetingRequested({ meeting: outcome.meeting, now });

  return { ok: true };
}

/**
 * The recipient's answer to a request. Accepting has nothing to reject — no
 * room is reserved and a clash is only ever a warning — so this is a status
 * change plus telling the requester.
 */
export async function respondToMeetingAction(
  raw: z.input<typeof respondSchema>
): Promise<MeetingActionResult> {
  await requireSiteAuth();

  const parsed = respondSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid request" };
  const input = parsed.data;

  const guestId = await verifiedCurrentUser(await cookies());
  if (!guestId) {
    return { ok: false, error: "Sign in to answer a meeting request" };
  }

  const repos = getRepositories();
  const meeting = await repos.meetings.findById(input.meetingId);
  if (!meeting) return { ok: false, error: "Meeting not found" };
  // Only the person asked can answer; the requester's own control is cancelling.
  if (meeting.recipientId !== guestId) {
    return { ok: false, error: "Only the person asked can answer this" };
  }
  // No `meetingsEnabled` check, unlike requesting one: the switch stops new
  // requests, and a pair already holding one still have to settle it. The
  // meetings page renders the modal for the same reason.

  const now = await serverNow();
  // Expiry is derived rather than swept (issue #392, section 2.4), so it is
  // checked here: answering a request whose slot has begun would agree to a
  // past meeting.
  if (meeting.slotStart.getTime() <= now.getTime()) {
    return { ok: false, error: "That slot has already started" };
  }

  const outcome = input.response === "accept" ? "accepted" : "declined";
  const answered = await repos.meetings.updateStatus(meeting.id, outcome, now, [
    "pending",
  ]);
  if (!answered) {
    return { ok: false, error: "This request has already been answered" };
  }

  await notifyMeetingOutcome({
    meeting: answered,
    outcome,
    actorId: guestId,
    now,
  });

  const event = await repos.events.findById(meeting.eventId);
  if (event) revalidatePath(`/${event.slug}`);
  return { ok: true };
}

/**
 * Calling a meeting off. Either party may cancel one they had agreed; while it
 * is still pending only the requester may, since the person asked has Decline
 * — and being told "canceled" where they had declined would misdescribe it.
 */
export async function cancelMeetingAction(
  raw: z.input<typeof cancelSchema>
): Promise<MeetingActionResult> {
  await requireSiteAuth();

  const parsed = cancelSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid request" };
  const input = parsed.data;

  const guestId = await verifiedCurrentUser(await cookies());
  if (!guestId) {
    return { ok: false, error: "Sign in to cancel a meeting" };
  }

  const repos = getRepositories();
  const meeting = await repos.meetings.findById(input.meetingId);
  if (!meeting) return { ok: false, error: "Meeting not found" };
  const isRequester = meeting.requesterId === guestId;
  if (!isRequester && meeting.recipientId !== guestId) {
    return { ok: false, error: "This isn't your meeting" };
  }

  const now = await serverNow();
  // A meeting that has already begun happened or didn't; calling it off after
  // the fact would only send its other half a notification about the past.
  if (meeting.slotStart.getTime() <= now.getTime()) {
    return { ok: false, error: "That slot has already started" };
  }

  if (!isRequester && meeting.status === "pending") {
    return {
      ok: false,
      error: "You were the one asked — decline it instead",
    };
  }

  const from: MeetingStatus[] = isRequester
    ? ["pending", "accepted"]
    : ["accepted"];
  const canceled = await repos.meetings.updateStatus(
    meeting.id,
    "canceled",
    now,
    from
  );
  if (!canceled) {
    return { ok: false, error: "There is nothing left to cancel" };
  }

  await notifyMeetingOutcome({
    meeting: canceled,
    outcome: "canceled",
    actorId: guestId,
    now,
  });

  const event = await repos.events.findById(meeting.eventId);
  if (event) revalidatePath(`/${event.slug}`);
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
