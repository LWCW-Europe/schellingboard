import { NextRequest, NextResponse } from "next/server";
import { getRepositories } from "@/db/container";
import { isRequestVerifiedAsGuest } from "@/utils/acting-guest";

export const dynamic = "force-dynamic";

// Without an explicit no-store, browsers heuristically cache this response
// and show stale RSVPs after a reload.
const NO_STORE = { headers: { "cache-control": "no-store" } };

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user = searchParams.get("user");
  const session = searchParams.get("session");

  if (!user && !session) {
    return NextResponse.json(
      { error: "user or session parameter is required" },
      { ...NO_STORE, status: 400 }
    );
  }

  // A guest's full RSVP list is private to that guest (aggregating it across
  // sessions is exposing). Per-session RSVPs stay openly readable — they are
  // displayed to everyone in the session details.
  if (user && !(await isRequestVerifiedAsGuest(request, user))) {
    return NextResponse.json(
      { error: "This user's RSVPs are private" },
      { ...NO_STORE, status: 403 }
    );
  }

  try {
    const repos = getRepositories();
    const rsvps = user
      ? await repos.rsvps.listByGuest(user)
      : await repos.rsvps.listBySession(session!);
    return NextResponse.json(rsvps, NO_STORE);
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { ...NO_STORE, status: 500 }
    );
  }
}
