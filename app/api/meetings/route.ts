import { NextRequest, NextResponse } from "next/server";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { requestNow } from "@/utils/dev-clock";
import { meetingViewsFor } from "@/utils/meeting-views";

export const dynamic = "force-dynamic";

// Without an explicit no-store, browsers heuristically cache this response and
// go on showing a request that has since been answered.
const NO_STORE = { headers: { "cache-control": "no-store" } };

// The viewer's own 1-on-1s at an event. Always the caller's own: a guest's
// meetings are as private as their RSVPs, so there is no id parameter to ask
// about someone else's.
export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("event");
  if (!eventId) {
    return NextResponse.json(
      { error: "event parameter is required" },
      { ...NO_STORE, status: 400 }
    );
  }

  const guestId = await verifiedCurrentUser(request.cookies);
  if (!guestId) {
    return NextResponse.json(
      { error: "Select your name to see your meetings" },
      { ...NO_STORE, status: 403 }
    );
  }

  try {
    return NextResponse.json(
      await meetingViewsFor(guestId, eventId, requestNow(request)),
      NO_STORE
    );
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { ...NO_STORE, status: 500 }
    );
  }
}
