import { NextResponse } from "next/server";
import { getRepositories } from "@/db/container";
import { NO_STORE, requireProxyVerifiedAdmin } from "@/utils/auth";

export const dynamic = "force-dynamic";

// Admin-only user listing over plain HTTP, for external seeding scripts that
// need to resolve an existing guest (by name or email) before submitting votes,
// RSVPs, etc. Auth is decided by the proxy (see requireAdminAuthApi), which
// forwards a header this route re-checks so it fails closed if the proxy
// didn't run.
//
// Returns every user in one response. No pagination yet: no other API route
// paginates, and the payload is wrapped in an object so a `total`/`page` can be
// added later without breaking clients.
export async function GET(req: Request) {
  const unverified = requireProxyVerifiedAdmin(req);
  if (unverified) {
    return unverified;
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
