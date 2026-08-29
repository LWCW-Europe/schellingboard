import { Suspense } from "react";
import { cookies } from "next/headers";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";

import { PageNotice } from "@/app/components/page-notice";
import { SessionForm } from "./session-form";
import { getRepositories } from "@/db/container";

export async function renderSessionForm(
  props: {
    params: Promise<{ eventSlug: string }>;
  },
  // Completes "before …" in the message shown when no name is selected.
  task: string
) {
  const { eventSlug } = await props.params;
  const cookieStore = await cookies();
  const currentUser = await verifiedCurrentUser(cookieStore);
  const repos = getRepositories();

  const event = await repos.events.findBySlug(eventSlug);
  if (!event) {
    return <div>Event not found</div>;
  }

  // A session is attributed to its hosts, so it can't be booked anonymously.
  if (!currentUser) {
    return (
      <PageNotice backHref={`/${eventSlug}`} backLabel="Schedule">
        {await unverifiedUserMessage(cookieStore, task)}
      </PageNotice>
    );
  }

  const [days, sessions, guests, locations, allProposals] = await Promise.all([
    repos.days.listByEvent(event.id),
    repos.sessions.listByEvent(event.id),
    repos.guests.list(),
    repos.locations.listBookableByEvent(event.id),
    repos.sessionProposals.listByEvent(event.id),
  ]);

  const currentUserProposals = allProposals.filter((p) =>
    p.hosts.some((h) => h.id === currentUser)
  );
  const hostlessProposals = allProposals.filter((p) => p.hosts.length === 0);
  const proposals = currentUserProposals.concat(hostlessProposals);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-2xl mx-auto px-4 sm:px-0 mb-6 sm:mb-24">
        <SessionForm
          event={event}
          days={days}
          locations={locations}
          sessions={sessions}
          guests={guests}
          proposals={proposals}
          maxSessionDuration={event.maxSessionDuration}
        />
      </div>
    </Suspense>
  );
}
