import { NextRequest, NextResponse } from "next/server";
import { getRepositories } from "@/db/container";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user = searchParams.get("user");
  const session = searchParams.get("session");

  if (!user && !session) {
    return NextResponse.json(
      { error: "user or session parameter is required" },
      { status: 400 }
    );
  }

  try {
    const repos = getRepositories();
    const rsvps = user
      ? await repos.rsvps.listByGuest(user)
      : await repos.rsvps.listBySession(session!);
    return NextResponse.json(rsvps);
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}
