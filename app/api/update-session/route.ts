import { getRepositories } from "@/db/container";
import { inSchedPhase } from "@/app/(site)/utils/events";
import { prepareToInsert, validateSession } from "../session-form-utils";
import type { SessionParams } from "../session-form-utils";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: Request) {
  const params = (await req.json()) as SessionParams;
  if (!params.id) {
    console.error("Session ID is required for update.");
    return new Response("Session ID is required", { status: 400 });
  }
  const repos = getRepositories();
  const input = prepareToInsert(params);
  const allSessions = (await repos.sessions.listScheduled()).filter(
    (s) => s.eventId === input.eventId
  );
  const prevSession = allSessions.find((ses) => ses.id === params.id);
  if (prevSession === undefined) {
    const msg = `Cannot find session with ID ${params.id}`;
    return new Response(msg, { status: 404 });
  }
  const event = await repos.events.findById(prevSession.eventId);
  if (!event || !inSchedPhase(event)) {
    return new Response(
      "Sessions can only be edited during the scheduling phase",
      { status: 403 }
    );
  }
  if (prevSession.adminManaged || prevSession.blocker) {
    return new Response("Cannot edit via web app", { status: 400 });
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
  const existingSessions = allSessions.filter((ses) => ses.id !== params.id);
  const sessionValid = validateSession(input, existingSessions);
  if (sessionValid) {
    try {
      const updated = await repos.sessions.update(params.id, input);
      console.log(updated.id);
    } catch (err) {
      console.error(err);
      return Response.error();
    }
    return Response.json({ success: true });
  } else {
    return Response.error();
  }
}
