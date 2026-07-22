import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import {
  eventNameToSlug,
  normalizeWebsiteUrl,
  RESERVED_EVENT_SLUGS,
} from "@/utils/utils";
import {
  DEFAULT_SLOT_INCREMENT_MINUTES,
  SLOT_INCREMENT_OPTIONS,
  isValidSlotIncrement,
} from "@/utils/slots";

export const dynamic = "force-dynamic";

// Admin-only event creation over plain HTTP, for external seeding scripts.
// The middleware already enforces site auth for /api/*; here we additionally
// require the admin cookie, matching the admin server actions.
async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

type Body = {
  name?: string;
  description?: string;
  website?: string;
  start?: string;
  end?: string;
  timezone?: string;
  maxSessionDuration?: number;
  breakMinutes?: number;
  slotIncrementMinutes?: number;
  rsvpCapacityHardLimit?: boolean;
  schedulingPhaseStart?: string;
  schedulingPhaseEnd?: string;
};

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

// The admin UI offers a timezone dropdown; scripts get a strict 400 instead.
function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
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

  for (const field of ["name", "description", "website", "timezone"] as const) {
    if (body[field] !== undefined && typeof body[field] !== "string") {
      return badRequest(`${field} must be a string`);
    }
  }

  const name = (body.name ?? "").trim();
  if (!name) return badRequest("Name is required");

  const start = parseDate(body.start);
  if (!start) return badRequest("Invalid start date");

  const end = parseDate(body.end);
  if (!end) return badRequest("Invalid end date");

  if (end <= start) return badRequest("End date must be after start date");

  const timezone = (body.timezone ?? "").trim() || "UTC";
  if (!isValidTimezone(timezone)) return badRequest("Unknown timezone");

  const maxSessionDuration = body.maxSessionDuration ?? 120;
  if (!Number.isInteger(maxSessionDuration) || maxSessionDuration <= 0) {
    return badRequest("Max session duration must be a positive number");
  }

  const breakMinutes = body.breakMinutes ?? 10;
  if (!Number.isInteger(breakMinutes) || breakMinutes < 0) {
    return badRequest("Break must be zero or a positive number");
  }

  const slotIncrementMinutes =
    body.slotIncrementMinutes ?? DEFAULT_SLOT_INCREMENT_MINUTES;
  if (!isValidSlotIncrement(slotIncrementMinutes)) {
    return badRequest(
      `Slot increment must be one of ${SLOT_INCREMENT_OPTIONS.join(", ")} minutes`
    );
  }

  const rsvpCapacityHardLimit = body.rsvpCapacityHardLimit ?? false;
  if (typeof rsvpCapacityHardLimit !== "boolean") {
    return badRequest("RSVP capacity hard limit must be a boolean");
  }

  // Omitting both leaves the event phase-less, so admin seeding and RSVPs
  // work immediately (inSchedPhase treats no phases as always-on).
  const schedulingPhaseStart = parseDate(body.schedulingPhaseStart);
  if (body.schedulingPhaseStart && !schedulingPhaseStart) {
    return badRequest("Invalid scheduling phase start");
  }
  const schedulingPhaseEnd = parseDate(body.schedulingPhaseEnd);
  if (body.schedulingPhaseEnd && !schedulingPhaseEnd) {
    return badRequest("Invalid scheduling phase end");
  }
  if (
    schedulingPhaseStart &&
    schedulingPhaseEnd &&
    schedulingPhaseEnd <= schedulingPhaseStart
  ) {
    return badRequest("Scheduling phase end must be after its start");
  }

  const slug = eventNameToSlug(name);
  if (!slug) return badRequest("Name must contain a letter or number");
  if (RESERVED_EVENT_SLUGS.has(slug.toLowerCase())) {
    return badRequest(
      `"${slug}" is a reserved URL and cannot be used as an event name`
    );
  }

  const { events } = getRepositories();
  const existing = await events.findBySlug(slug);
  if (existing) {
    return NextResponse.json(
      {
        error: `An event with the URL "${slug}" already exists ("${existing.name}")`,
      },
      { status: 409 }
    );
  }

  let event;
  try {
    event = await events.create({
      name,
      description: (body.description ?? "").trim(),
      website: normalizeWebsiteUrl(body.website ?? ""),
      start,
      end,
      timezone,
      maxSessionDuration,
      breakMinutes,
      slotIncrementMinutes,
      rsvpCapacityHardLimit,
      schedulingPhaseStart,
      schedulingPhaseEnd,
    });
  } catch (e) {
    // A concurrent create can win the race between the findBySlug check
    // above and this insert; translate the constraint violation into the
    // same conflict response instead of surfacing a 500.
    if (
      e instanceof Error &&
      e.message.includes("UNIQUE constraint failed: events.slug")
    ) {
      return NextResponse.json(
        { error: `An event with the URL "${slug}" already exists` },
        { status: 409 }
      );
    }
    throw e;
  }

  return NextResponse.json({ id: event.id, slug: event.slug }, { status: 201 });
}
