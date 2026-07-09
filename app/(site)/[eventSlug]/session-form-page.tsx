import { Suspense } from "react";
import { cookies } from "next/headers";

import { SessionForm } from "./session-form";
import { getRepositories } from "@/db/container";

export async function renderSessionForm(props: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await props.params;
  const currentUser = (await cookies()).get("user")?.value;
  const repos = getRepositories();

  const event = await repos.events.findBySlug(eventSlug);
  if (!event) {
    return <div>Event not found</div>;
  }

  const [days, sessions, guests, locations, allProposals] = await Promise.all([
    repos.days.listByEvent(event.id),
    repos.sessions.listByEvent(event.id),
    repos.guests.list(),
    repos.locations.listBookable(),
    repos.sessionProposals.listByEvent(event.id),
  ]);

  const filteredLocations = locations;

  const currentUserProposals = allProposals.filter(
    (p) => currentUser && p.hosts.some((h) => h.id === currentUser)
  );
  const hostlessProposals = allProposals.filter((p) => p.hosts.length === 0);
  const proposals = currentUserProposals.concat(hostlessProposals);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-2xl mx-2 sm:mx-auto mt-20 mb-6 sm:mb-24">
        <SessionForm
          event={event}
          days={days}
          locations={filteredLocations}
          sessions={sessions}
          guests={guests}
          proposals={proposals}
          maxSessionDuration={event.maxSessionDuration}
        />
      </div>
    </Suspense>
  );
}
