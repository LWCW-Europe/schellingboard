import { NextResponse } from "next/server";
import { getRepositories } from "@/db/container";

export const dynamic = "force-dynamic";

// Without an explicit no-store, browsers heuristically cache this response
// and show stale comments after a reload.
const NO_STORE = { headers: { "cache-control": "no-store" } };

// Comments are displayed to everyone in the session details, so like
// per-session RSVPs they stay openly readable.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  try {
    const { sessions, sessionComments } = getRepositories();
    // Without this an unknown id would answer with an empty thread, which is
    // indistinguishable from a session nobody has commented on.
    if (!(await sessions.findById(sessionId))) {
      return NextResponse.json(
        { error: "Session not found" },
        { ...NO_STORE, status: 404 }
      );
    }
    return NextResponse.json(await sessionComments.list(sessionId), NO_STORE);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { ...NO_STORE, status: 500 }
    );
  }
}
