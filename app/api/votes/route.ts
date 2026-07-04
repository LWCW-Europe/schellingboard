import { NextRequest, NextResponse } from "next/server";
import { getRepositories } from "@/db/container";

export const dynamic = "force-dynamic";

// Without an explicit no-store, browsers heuristically cache this response
// and show stale votes after a reload.
const NO_STORE = { headers: { "cache-control": "no-store" } };

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user = searchParams.get("user");
  const eventSlug = searchParams.get("event");

  if (!user || !eventSlug) {
    return NextResponse.json(
      { error: "User and event parameters are required" },
      { ...NO_STORE, status: 400 }
    );
  }

  try {
    const repos = getRepositories();
    const event = await repos.events.findBySlug(eventSlug);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { ...NO_STORE, status: 404 }
      );
    }
    const votes = await repos.votes.listByGuestAndEvent(user, event.id);
    return NextResponse.json(votes, NO_STORE);
  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { ...NO_STORE, status: 500 }
    );
  }
}
