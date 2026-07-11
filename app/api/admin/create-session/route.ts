import { NextResponse } from "next/server";
import { getRepositories } from "@/db/container";
import { sessionSlotAlignmentError } from "@/utils/day-window";

export const dynamic = "force-dynamic";

// Admin-only session creation over plain HTTP, for external seeding scripts.
// Auth is enforced by the proxy (see requireAdminAuthApi); the proxy's
// matcher covers every path, so this route is never reachable without it.
//
// Unlike /api/add-session this returns the created id (which the RSVP step
// needs), takes absolute ISO times instead of the SessionParams shape, and —
// like the other admin seeding routes — has no scheduling-phase or
// future-time gate: an importer routinely seeds past/fixed dates.
//
// Always creates a new session, same as adminCreateSessionAction: sessions
// aren't deduplicated, so a repeated request is a location conflict (409),
// not a silent no-op. Hosts and locations are auto-assigned to the event so
// imported sessions are fully visible without extra calls.
type Body = {
  eventSlug?: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  hostIds?: string[];
  locationIds?: string[];
  capacity?: number;
  adminManaged?: boolean;
  closed?: boolean;
};

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = ((await req.json()) ?? {}) as Body;
  } catch {
    return badRequest("Invalid JSON body");
  }

  for (const field of ["eventSlug", "title", "description"] as const) {
    if (body[field] !== undefined && typeof body[field] !== "string") {
      return badRequest(`${field} must be a string`);
    }
  }
  if (body.hostIds !== undefined && !Array.isArray(body.hostIds)) {
    return badRequest("hostIds must be an array");
  }
  if (body.locationIds !== undefined && !Array.isArray(body.locationIds)) {
    return badRequest("locationIds must be an array");
  }

  if (!body.eventSlug) return badRequest("eventSlug is required");

  const title = (body.title ?? "").trim();
  if (!title) return badRequest("Title is required");

  const startTime = parseDate(body.startTime);
  if (!startTime) return badRequest("Invalid start time");

  const endTime = parseDate(body.endTime);
  if (!endTime) return badRequest("Invalid end time");

  if (endTime <= startTime) {
    return badRequest("End time must be after start time");
  }

  const hostIds = body.hostIds ?? [];
  const locationIds = body.locationIds ?? [];

  const repos = getRepositories();
  const event = await repos.events.findBySlug(body.eventSlug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const knownHosts = await repos.guests.findExistingIds(hostIds);
  if (knownHosts.length !== hostIds.length) {
    return badRequest("Unknown host");
  }
  const knownLocations = await repos.locations.findExistingIds(locationIds);
  if (knownLocations.length !== locationIds.length) {
    return badRequest("Unknown location");
  }

  let capacity = body.capacity;
  if (capacity === undefined) {
    const firstLocation =
      locationIds.length > 0
        ? await repos.locations.findById(locationIds[0])
        : undefined;
    capacity = firstLocation?.capacity ?? 0;
  }
  if (!Number.isInteger(capacity) || capacity < 0) {
    return badRequest("Capacity must be a non-negative whole number");
  }

  const days = await repos.days.listByEvent(event.id);
  const alignmentError = sessionSlotAlignmentError(
    days,
    event.slotIncrementMinutes,
    startTime,
    endTime
  );
  if (alignmentError) return badRequest(alignmentError);

  const conflict = await repos.sessions.findLocationConflict(
    event.id,
    startTime,
    endTime,
    locationIds
  );
  if (conflict) {
    return NextResponse.json(
      { error: `Overlaps "${conflict.title}" in the same location` },
      { status: 409 }
    );
  }

  const session = await repos.sessions.create({
    title,
    description: (body.description ?? "").trim(),
    startTime,
    endTime,
    capacity,
    adminManaged: body.adminManaged ?? false,
    blocker: false,
    closed: body.closed ?? false,
    eventId: event.id,
    hostIds,
    locationIds,
  });

  if (hostIds.length > 0) {
    await repos.guests.assignToEvent(event.id, hostIds);
  }
  if (locationIds.length > 0) {
    await repos.locations.assignToEvent(event.id, locationIds);
  }

  return NextResponse.json({ id: session.id }, { status: 201 });
}
