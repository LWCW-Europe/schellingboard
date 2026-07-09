import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";

export const dynamic = "force-dynamic";

// Without an explicit no-store, browsers heuristically cache this response;
// user emails are sensitive and must never be served stale or from cache.
const NO_STORE = { headers: { "cache-control": "no-store" } };

// Admin-only user listing over plain HTTP, for external seeding scripts that
// need to resolve an existing guest (by name or email) before submitting votes,
// RSVPs, etc. The middleware already enforces site auth for /api/*; here we
// additionally require the admin cookie, matching the other admin routes.
//
// Returns every user in one response. No pagination yet: no other API route
// paginates, and the payload is wrapped in an object so a `total`/`page` can be
// added later without breaking clients.
async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { ...NO_STORE, status: 401 }
    );
  }

  try {
    const { guests } = getRepositories();
    const users = (await guests.listFull()).map((g) => ({
      id: g.id,
      name: g.name,
      email: g.info.email,
    }));

    return NextResponse.json({ users }, NO_STORE);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { ...NO_STORE, status: 500 }
    );
  }
}
