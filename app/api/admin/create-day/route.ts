import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import { dayAlignmentError, daysOverlap } from "@/utils/day-window";

export const dynamic = "force-dynamic";

// Admin-only day creation over plain HTTP, for external seeding scripts.
// The middleware already enforces site auth for /api/*; here we additionally
// require the admin cookie, matching the admin server actions.
//
// Behaves the same as createDayAction: a day overlapping an existing one
// (including an exact duplicate) is a 409; otherwise multiple days can be
// created freely, same as in the admin UI.
async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

type Body = {
  eventSlug?: string;
  start?: string;
  end?: string;
  startBookings?: string;
  endBookings?: string;
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
    "eventSlug",
    "start",
    "end",
    "startBookings",
    "endBookings",
  ] as const) {
    if (body[field] !== undefined && typeof body[field] !== "string") {
      return badRequest(`${field} must be a string`);
    }
  }

  if (!body.eventSlug) return badRequest("eventSlug is required");

  const start = parseDate(body.start);
  if (!start) return badRequest("Invalid start date/time");

  const end = parseDate(body.end);
  if (!end) return badRequest("Invalid end date/time");

  if (end <= start) return badRequest("Day end must be after start");

  const startBookings = parseDate(body.startBookings);
  if (!startBookings) return badRequest("Invalid bookings start date/time");

  const endBookings = parseDate(body.endBookings);
  if (!endBookings) return badRequest("Invalid bookings end date/time");

  if (endBookings <= startBookings) {
    return badRequest("Bookings end must be after bookings start");
  }

  if (startBookings < start || endBookings > end) {
    return badRequest("Bookings window must be within the day window");
  }

  const repos = getRepositories();
  const event = await repos.events.findBySlug(body.eventSlug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const alignmentError = dayAlignmentError(
    { start, end, startBookings, endBookings },
    event.slotIncrementMinutes
  );
  if (alignmentError) {
    return badRequest(alignmentError);
  }

  const existingDays = await repos.days.listByEvent(event.id);
  if (existingDays.some((d) => daysOverlap(start, end, d.start, d.end))) {
    return NextResponse.json(
      { error: "Day overlaps an existing day" },
      { status: 409 }
    );
  }

  let day;
  try {
    day = await repos.days.create({
      eventId: event.id,
      start,
      end,
      startBookings,
      endBookings,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create day" },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: day.id });
}
