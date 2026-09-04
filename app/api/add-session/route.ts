import type { NextRequest } from "next/server";
import { getRepositories } from "@/db/container";
import { inSchedPhase } from "@/app/(site)/utils/events";
import { requestNow } from "@/utils/dev-clock";
import { notifyCohostsAdded } from "@/utils/notifications";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";
import { sessionBookingWindowError } from "@/utils/day-window";
import { sessionDurationError } from "@/utils/slots";
import { prepareToInsert, validateSession } from "../session-form-utils";
import type { SessionParams } from "../session-form-utils";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: NextRequest) {
  // Creating needs a name actually selected, not merely one that isn't being
  // falsely claimed: a session is attributed to its hosts, so an anonymous
  // caller has no identity to attribute it to.
  const actingGuestId = await verifiedCurrentUser(req.cookies);
  if (!actingGuestId) {
    return Response.json(
      { error: await unverifiedUserMessage(req.cookies, "adding a session") },
      { status: 403 }
    );
  }
  const params = (await req.json()) as SessionParams;
  const repos = getRepositories();
  // Anything but a string reaches the query as an unbindable parameter, which
  // fails as a server error rather than a rejected request.
  const day =
    typeof params.dayId === "string"
      ? await repos.days.findById(params.dayId)
      : undefined;
  if (!day) {
    return Response.json(
      { error: "That day is no longer part of this event" },
      { status: 400 }
    );
  }
  const input = prepareToInsert(params, day);
  const event = await repos.events.findById(input.eventId);
  const now = requestNow(req);
  if (!event || !inSchedPhase(event, now)) {
    return Response.json(
      { error: "Sessions can only be created during the scheduling phase" },
      { status: 403 }
    );
  }
  const windowError = sessionBookingWindowError(
    day,
    input.startTime!,
    input.endTime!,
    event.slotIncrementMinutes
  );
  if (windowError) {
    return Response.json({ error: windowError }, { status: 400 });
  }
  const durationError = sessionDurationError(
    input.startTime!,
    input.endTime!,
    event.slotIncrementMinutes,
    event.maxSessionDuration
  );
  if (durationError) {
    return Response.json({ error: durationError }, { status: 400 });
  }
  const eventGuestIds = new Set(
    (await repos.guests.listByEvent(event.id)).map((g) => g.id)
  );
  if (!input.hostIds.every((id) => eventGuestIds.has(id))) {
    return Response.json(
      { error: "A host is not part of this event" },
      { status: 403 }
    );
  }
  // Exactly the set the session form offers: assigned to the event, not
  // hidden, and open to self-booking.
  const bookable = new Map(
    (await repos.locations.listBookableByEvent(event.id)).map((l) => [l.id, l])
  );
  const chosen = input.locationIds.flatMap((id) => bookable.get(id) ?? []);
  if (chosen.length !== input.locationIds.length || chosen.length === 0) {
    return Response.json(
      { error: "A location cannot be booked for this event" },
      { status: 403 }
    );
  }
  // The payload carries the client's copy of the location; capacity gates the
  // RSVP hard limit, so take it from the stored row instead.
  input.capacity = chosen[0].capacity;
  const existingSessions = (await repos.sessions.listScheduled()).filter(
    (s) => s.eventId === input.eventId
  );
  const sessionValid = validateSession(input, existingSessions, now);
  if (sessionValid) {
    let session;
    try {
      session = await repos.sessions.create(input);
      console.log(session.id);
    } catch (err) {
      console.error(err);
      return Response.error();
    }

    await notifyCohostsAdded({
      now,
      session,
      previousHostIds: [],
      changedById: actingGuestId,
    });
    return Response.json({ success: true });
  } else {
    return Response.error();
  }
}
