import { getRepositories } from "@/db/container";
import { inSchedPhase } from "@/app/(site)/utils/events";
import {
  guestProtectionError,
  isRequestVerifiedAsGuest,
} from "@/utils/acting-guest";

type RSVPParams = {
  sessionId: string;
  guestId: string;
  remove?: boolean;
};

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: Request) {
  const { sessionId, guestId, remove } = (await req.json()) as RSVPParams;
  const repos = getRepositories();

  if (!(await isRequestVerifiedAsGuest(req, guestId))) {
    return guestProtectionError();
  }

  const session = await repos.sessions.findById(sessionId);
  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  const event = await repos.events.findById(session.eventId);
  const eventGuests = event ? await repos.guests.listByEvent(event.id) : [];
  if (!eventGuests.some((g) => g.id === guestId)) {
    return Response.json(
      { error: "Guest is not part of this event" },
      { status: 403 }
    );
  }

  if (!event || !inSchedPhase(event)) {
    return Response.json(
      { error: "RSVPs can only be changed during the scheduling phase" },
      { status: 403 }
    );
  }

  if (!remove) {
    if (session.hosts.some((h) => h.id === guestId)) {
      return Response.json(
        { error: "Hosts cannot RSVP to their own session" },
        { status: 403 }
      );
    }

    const enforceCapacity = event.rsvpCapacityHardLimit && session.capacity > 0;
    try {
      if (enforceCapacity) {
        const rsvp = await repos.rsvps.createIfUnderCapacity({
          sessionId,
          guestId,
          capacity: session.capacity,
        });
        if (!rsvp) {
          return Response.json(
            { error: "This session is full" },
            { status: 409 }
          );
        }
      } else {
        await repos.rsvps.create({ sessionId, guestId });
      }
    } catch (err) {
      console.error(err);
      return Response.error();
    }
  } else {
    try {
      await repos.rsvps.deleteBySessionAndGuest(sessionId, guestId);
    } catch (err) {
      console.error(err);
      return Response.error();
    }
  }

  return Response.json({ success: true });
}
