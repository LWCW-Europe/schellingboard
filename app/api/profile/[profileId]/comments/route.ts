import { NextResponse } from "next/server";
import { getRepositories } from "@/db/container";

export const dynamic = "force-dynamic";

// Without an explicit no-store, browsers heuristically cache this response
// and show stale comments after a reload.
const NO_STORE = { headers: { "cache-control": "no-store" } };

// Comments are displayed to everyone in the profile details,
// similarly to sessions
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const { profileId } = await params;

  try {
    const { guests, profileComments } = getRepositories();
    // Without this an unknown id would answer with an empty thread, which is
    // indistinguishable from a profile nobody has commented on.
    if (!(await guests.findById(profileId))) {
      return NextResponse.json(
        { error: "Profile not found" },
        { ...NO_STORE, status: 404 }
      );
    }
    return NextResponse.json(await profileComments.list(profileId), NO_STORE);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { ...NO_STORE, status: 500 }
    );
  }
}
