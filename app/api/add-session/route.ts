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
import { prepareToInsert, validateSession } from "../session-form-utils";
import type { SessionParams } from "../session-form-utils";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: NextRequest) {
  if (!(await actingUserIsVerified(req.cookies))) {
    return guestProtectionError();
  }
  const params = (await req.json()) as SessionParams;
  const repos = getRepositories();
  const input = prepareToInsert(params);
  const event = await repos.events.findById(input.eventId);
  if (!event || !inSchedPhase(event, requestNow(req))) {
    return Response.json(
      { error: "Sessions can only be created during the scheduling phase" },
      { status: 403 }
    );
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
