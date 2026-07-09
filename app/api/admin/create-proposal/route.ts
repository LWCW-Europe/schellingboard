import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";

export const dynamic = "force-dynamic";

// Admin-only proposal creation over plain HTTP, for external seeding scripts.
// Unlike the site's createProposal server action this has no phase gate: an
// admin seeds proposals regardless of the event phase.
async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

type Body = {
  eventSlug?: string;
  title?: string;
  description?: string;
  durationMinutes?: number | null;
  hostIds?: string[];
};

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
    (body.title !== undefined && typeof body.title !== "string") ||
    (body.description !== undefined && typeof body.description !== "string") ||
    (body.hostIds !== undefined && !Array.isArray(body.hostIds))
  ) {
    return NextResponse.json(
      { error: "title and description must be strings, hostIds an array" },
      { status: 400 }
    );
  }
  const title = (body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const duration = body.durationMinutes;
  if (
    duration !== null &&
    duration !== undefined &&
    (!Number.isInteger(duration) || duration < 0)
  ) {
    return NextResponse.json(
      { error: "Duration must be a non-negative integer" },
      { status: 400 }
    );
  }

  if (!body.eventSlug) {
    return NextResponse.json(
      { error: "eventSlug is required" },
      { status: 400 }
    );
  }

  const { sessionProposals, guests, events } = getRepositories();
  const event = await events.findBySlug(body.eventSlug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const hostIds = [...new Set((body.hostIds ?? []).filter(Boolean))];
  for (const guestId of hostIds) {
    if (!(await guests.findById(guestId))) {
      return NextResponse.json(
        { error: `Guest not found: ${guestId}` },
        { status: 400 }
      );
    }
  }

  // Keep hosts as members of the event so they show up in its guest list.
  if (hostIds.length > 0) {
    await guests.assignToEvent(event.id, hostIds);
  }

  const proposal = await sessionProposals.create({
    eventId: event.id,
    title,
    description: body.description?.trim() || undefined,
    hostIds,
    durationMinutes: duration ?? undefined,
  });

  return NextResponse.json({ id: proposal.id });
}
