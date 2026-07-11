import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";

export const dynamic = "force-dynamic";

// Admin-only RSVP creation over plain HTTP, for external seeding scripts.
// The middleware already enforces site auth for /api/*; here we additionally
// require the admin cookie, matching the admin server actions.
//
// Unlike /api/toggle-rsvp there is no scheduling-phase gate, so an import
// never depends on the event's current phase. rsvpCapacityHardLimit is still
// enforced, same as toggle-rsvp: a full session is a 409, not a silent
// overbook. The guest is auto-assigned to the session's event so the RSVP is
// never orphaned from the UI's member lists. Idempotent per (session, guest)
// via the repository's onConflictDoNothing.
async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

type Body = { sessionId?: string; guestId?: string };

export async function POST(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = ((await req.json()) ?? {}) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    (body.sessionId !== undefined && typeof body.sessionId !== "string") ||
    (body.guestId !== undefined && typeof body.guestId !== "string")
  ) {
    return NextResponse.json(
      { error: "sessionId and guestId must be strings" },
      { status: 400 }
    );
  }
  const { sessionId, guestId } = body;
  if (!sessionId || !guestId) {
    return NextResponse.json(
      { error: "sessionId and guestId are required" },
      { status: 400 }
    );
  }

  const repos = getRepositories();
  const session = await repos.sessions.findById(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  const guest = await repos.guests.findById(guestId);
  if (!guest) {
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }
  const event = await repos.events.findById(session.eventId);

  const existing = (await repos.rsvps.listBySession(sessionId)).find(
    (r) => r.guestId === guestId
  );

  let rsvp = existing;
  if (!rsvp) {
    const enforceCapacity =
      event?.rsvpCapacityHardLimit && session.capacity > 0;
    if (enforceCapacity) {
      rsvp =
        (await repos.rsvps.createIfUnderCapacity({
          sessionId,
          guestId,
          capacity: session.capacity,
        })) ?? undefined;
      if (!rsvp) {
        return NextResponse.json(
          { error: "This session is full" },
          { status: 409 }
        );
      }
    } else {
      rsvp = await repos.rsvps.create({ sessionId, guestId });
    }
  }

  await repos.guests.assignToEvent(session.eventId, [guestId]);

  return NextResponse.json(
    { id: rsvp.id, created: !existing },
    { status: existing ? 200 : 201 }
  );
}
