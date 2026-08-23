import { NextRequest, NextResponse } from "next/server";
import { getRepositories } from "@/db/container";

export const dynamic = "force-dynamic";

// Without an explicit no-store, browsers heuristically cache this response
// and show stale comments after a reload.
const NO_STORE = { headers: { "cache-control": "no-store" } };

// Comments are displayed to everyone in the session details, so like
// per-session RSVPs they stay openly readable.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  try {
    const comments =
      await getRepositories().sessionComments.listBySession(sessionId);
    return NextResponse.json(comments, NO_STORE);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { ...NO_STORE, status: 500 }
    );
  }
}
