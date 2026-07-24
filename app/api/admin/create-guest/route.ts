import { NextResponse } from "next/server";
import { getRepositories } from "@/db/container";

export const dynamic = "force-dynamic";

// Admin-only guest creation over plain HTTP, for external seeding scripts.
// Auth is enforced by the proxy (see requireAdminAuthApi); the proxy's
// matcher covers every path, so this route is never reachable without it.
type Body = { name?: string; email?: string; eventSlug?: string };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = ((await req.json()) ?? {}) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (
    (body.name !== undefined && typeof body.name !== "string") ||
    (body.email !== undefined && typeof body.email !== "string")
  ) {
    return NextResponse.json(
      { error: "name and email must be strings" },
      { status: 400 }
    );
  }
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const { guests, events } = getRepositories();

  let eventId: string | undefined;
  if (body.eventSlug) {
    const event = await events.findBySlug(body.eventSlug);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    eventId = event.id;
  }

  // Idempotent by email (case-insensitive) so concurrent seeding scripts
  // re-running an import do not race into duplicate guests.
  const { guest, created } = await guests.findOrCreateByEmail({
    name,
    info: { email },
  });

  if (eventId) {
    await guests.assignToEvent(eventId, [guest.id]);
  }

  return NextResponse.json(
    { id: guest.id, created },
    { status: created ? 201 : 200 }
  );
}
