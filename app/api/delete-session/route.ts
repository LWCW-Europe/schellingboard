import type { NextRequest } from "next/server";
import { getRepositories } from "@/db/container";
import { inSchedPhase } from "@/app/(site)/utils/events";
import { requestNow } from "@/utils/dev-clock";
import { verifiedCurrentUser } from "@/utils/acting-guest";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: NextRequest) {
  const { id } = (await req.json()) as { id: string };
  const repos = getRepositories();

  const session = await repos.sessions.findById(id);
  if (!session) {
    return new Response("Session not found", { status: 404 });
  }

  const event = await repos.events.findById(session.eventId);
  if (!event || !inSchedPhase(event, requestNow(req))) {
    return new Response(
      "Sessions can only be deleted during the scheduling phase",
      { status: 403 }
    );
  }

  if (session.adminManaged || session.blocker) {
    return new Response("Cannot delete via web app", { status: 400 });
  }

  const actor = await verifiedCurrentUser(req.cookies);
  if (!actor || !session.hosts.some((h) => h.id === actor)) {
    return Response.json(
      { error: "Only a host may delete this session" },
      { status: 403 }
    );
  }

  try {
    await repos.sessions.delete(id);
    console.log(`Deleted session: ${id}`);
  } catch (err) {
    console.error(err);
    return Response.error();
  }

  return Response.json({ success: true });
}
