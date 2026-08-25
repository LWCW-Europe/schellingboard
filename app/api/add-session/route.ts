import type { NextRequest } from "next/server";
import { getRepositories } from "@/db/container";
import { inSchedPhase } from "@/app/(site)/utils/events";
import { requestNow } from "@/utils/dev-clock";
import { notifyCohostsAdded } from "@/utils/notifications";
import {
  actingUserIsVerified,
  guestProtectionError,
  verifiedCurrentUser,
} from "@/utils/acting-guest";
import { sessionBookingWindowError } from "@/utils/day-window";
import { prepareToInsert, validateSession } from "../session-form-utils";
import type { SessionParams } from "../session-form-utils";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: NextRequest) {
  if (!(await actingUserIsVerified(req.cookies))) {
    return guestProtectionError();
  }
  const params = (await req.json()) as SessionParams;
  const repos = getRepositories();
  const day = await repos.days.findById(params.dayId);
  if (!day) {
    return Response.json(
      { error: "That day is no longer part of this event" },
      { status: 400 }
    );
  }
  const input = prepareToInsert(params, day);
  const event = await repos.events.findById(input.eventId);
  if (!event || !inSchedPhase(event, requestNow(req))) {
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
  const sessionValid = validateSession(input, existingSessions);
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
      session,
      previousHostIds: [],
      // Verified so notifications can't attribute the change to a protected
      // guest someone merely claims to be.
      changedById: await verifiedCurrentUser(req.cookies),
    });
    return Response.json({ success: true });
  } else {
    return Response.error();
  }
}
