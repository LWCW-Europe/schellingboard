import { NextRequest, NextResponse } from "next/server";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { requestNow } from "@/utils/dev-clock";
import { meetingCandidatesFor } from "@/utils/meeting-candidates";

export const dynamic = "force-dynamic";

// Without an explicit no-store, browsers heuristically cache this response and
// go on offering someone who has since been booked.
const NO_STORE = { headers: { "cache-control": "no-store" } };

// Who the caller could ask for a 1-on-1 in one slot. Fetched when the "+" is
// clicked rather than shipped with the schedule: it is per-viewer, and a whole
// event's worth of slots is far more than any one of them needs.
export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("event");
  const slotStart = request.nextUrl.searchParams.get("slot");
  if (!eventId || !slotStart) {
    return NextResponse.json(
      { error: "event and slot parameters are required" },
      { ...NO_STORE, status: 400 }
    );
  }

  // Who is free when is as private as an RSVP, so this answers for the caller
  // alone: there is no id parameter to ask on anyone else's behalf.
  const guestId = await verifiedCurrentUser(request.cookies);
  if (!guestId) {
    return NextResponse.json(
      { error: "Select your name to arrange a 1-on-1" },
      { ...NO_STORE, status: 403 }
    );
  }

  try {
    const found = await meetingCandidatesFor(
      guestId,
      eventId,
      slotStart,
      requestNow(request)
    );
    if (!found) {
      return NextResponse.json(
        { error: "That slot is not open for 1-on-1s" },
        { ...NO_STORE, status: 404 }
      );
    }
    return NextResponse.json(found, NO_STORE);
  } catch (error) {
    console.error("Error fetching 1-on-1 candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch the people you could meet" },
      { ...NO_STORE, status: 500 }
    );
  }
}
