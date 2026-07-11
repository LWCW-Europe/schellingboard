import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import { normalizeLocationColor } from "@/utils/location-colors";

export const dynamic = "force-dynamic";

async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

type Body = {
  name?: string;
  description?: string;
  areaDescription?: string;
  capacity?: number;
  color?: string;
  hidden?: boolean;
  bookable?: boolean;
  eventSlug?: string;
};

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

// Admin-only location creation over plain HTTP, for external seeding scripts.
// The middleware already enforces site auth for /api/*; here we additionally
// require the admin cookie, matching the admin server actions.
//
// Always creates a new location, same as the admin UI action: locations
// aren't unique by name, so a name matching an existing location is not
// treated as a duplicate to reuse. Image upload stays exclusive to the
// admin UI action.
export async function POST(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = ((await req.json()) ?? {}) as Body;
  } catch {
    return badRequest("Invalid JSON body");
  }

  for (const field of [
    "name",
    "description",
    "areaDescription",
    "color",
    "eventSlug",
  ] as const) {
    if (body[field] !== undefined && typeof body[field] !== "string") {
      return badRequest(`${field} must be a string`);
    }
  }

  const name = (body.name ?? "").trim();
  if (!name) {
    return badRequest("Name is required");
  }

  const capacity = body.capacity ?? 0;
  if (!Number.isInteger(capacity) || capacity < 0) {
    return badRequest("Capacity must be a non-negative whole number");
  }

  const { locations, events } = getRepositories();

  let eventId: string | undefined;
  if (body.eventSlug) {
    const event = await events.findBySlug(body.eventSlug);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    eventId = event.id;
  }

  const all = await locations.list();
  // sortIndex is auto-assigned exactly as in createLocationAction.
  const sortIndex =
    all.length === 0 ? 0 : Math.max(...all.map((l) => l.sortIndex)) + 1;
  const location = await locations.create({
    name,
    imageUrl: "",
    description: (body.description ?? "").trim(),
    areaDescription: (body.areaDescription ?? "").trim() || undefined,
    capacity,
    color: normalizeLocationColor(body.color ?? ""),
    hidden: body.hidden ?? false,
    bookable: body.bookable ?? false,
    sortIndex,
  });

  if (eventId) {
    await locations.assignToEvent(eventId, [location.id]);
  }

  return NextResponse.json({ id: location.id });
}
