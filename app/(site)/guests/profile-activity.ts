"use server";

import { getRepositories } from "@/db/container";
import { eventNameToSlug } from "@/utils/utils";

/** A session or proposal on a profile, ready to link to. */
export type ProfileActivityItem = {
  id: string;
  title: string;
  eventSlug: string;
};

export type ProfileActivity = {
  hosting: ProfileActivityItem[];
  proposals: ProfileActivityItem[];
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
  const repos = getRepositories();
  const [hostedSessions, proposals, events] = await Promise.all([
    repos.sessions.listHostedByGuest(guestId),
    repos.sessionProposals.listByHost(guestId),
    repos.events.list(),
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
  };
}
