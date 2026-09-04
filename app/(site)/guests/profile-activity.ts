"use server";

import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { requireSiteAuth } from "@/utils/action-auth";
import { eventNameToSlug } from "@/utils/utils";
import { meetingOptionsFor, type MeetingOption } from "@/utils/meeting-options";

/** A session or proposal on a profile, ready to link to. */
export type ProfileActivityItem = {
  id: string;
  title: string;
  eventSlug: string;
};

export type ProfileActivity = {
  hosting: ProfileActivityItem[];
  proposals: ProfileActivityItem[];
  /**
   * What the reader may book with this guest. Folded in here rather than
   * fetched on its own: a server action re-renders the route's RSC tree, and
   * the directory behind a profile is a big one to render twice per open.
   */
  meetingOptions: MeetingOption[];
};

/**
 * What a guest hosts and has proposed. Kept out of the directory payload the
 * profile otherwise renders from: these need joins across three tables, they
 * sit below the fold, and multiplying them by every attendee would be paid for
 * on a page most readers never scroll that far down.
 */
export async function listProfileActivity(
  guestId: string
): Promise<ProfileActivity> {
  await requireSiteAuth();
  const repos = getRepositories();
  const viewerId = await verifiedCurrentUser(await cookies());
  // The event list is fetched first because the meeting options are computed
  // over it, rather than each looking its own events up again.
  const events = await repos.events.list();
  const [hostedSessions, proposals, meetingOptions] = await Promise.all([
    repos.sessions.listHostedByGuest(guestId),
    repos.sessionProposals.listByHost(guestId),
    meetingOptionsFor(viewerId, guestId, events),
  ]);

  const slugOf = (eventId: string) =>
    eventNameToSlug(events.find((e) => e.id === eventId)!.name);

  return {
    hosting: hostedSessions.map((s) => ({
      id: s.id,
      title: s.title,
      eventSlug: slugOf(s.eventId),
    })),
    proposals: proposals.map((p) => ({
      id: p.id,
      title: p.title,
      eventSlug: slugOf(p.eventId),
    })),
    meetingOptions,
  };
}
