import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";

export const dynamic = "force-dynamic";

// Admin-only guest creation over plain HTTP, for external seeding scripts.
// The middleware already enforces site auth for /api/*; here we additionally
// require the admin cookie, matching the admin server actions.
async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

type Body = { name?: string; email?: string; eventSlug?: string };

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

  return NextResponse.json({ id: guest.id, created });
}
