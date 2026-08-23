import { NextRequest, NextResponse } from "next/server";
import { getRepositories } from "@/db/container";

export const dynamic = "force-dynamic";

// Without an explicit no-store, browsers heuristically cache this response
// and show stale comments after a reload.
const NO_STORE = { headers: { "cache-control": "no-store" } };

// Comments are displayed to everyone in the profile details,
// similarly to sessions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const { profileId } = await params;

  try {
    const comments =
      await getRepositories().profileComments.listByProfile(profileId);
    return NextResponse.json(comments, NO_STORE);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { ...NO_STORE, status: 500 }
    );
  }
}
