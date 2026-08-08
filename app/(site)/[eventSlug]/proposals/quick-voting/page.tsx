import { cookies } from "next/headers";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import Link from "next/link";

import { QuickVoting } from "./quick-voting";
import { getRepositories } from "@/db/container";

export default async function ProposalQuickVoting(props: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await props.params;
  const currentUser = await verifiedCurrentUser(await cookies());
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <Link
          className="inline-block py-1 -my-1 text-sm text-gray-500 hover:text-gray-700"
          href={`/${eventSlug}/proposals`}
        >
          ← Proposals
        </Link>
        <div className="mt-6">Please choose who you are first.</div>
      </div>
    );
  }

  const repos = getRepositories();
  const event = await repos.events.findBySlug(eventSlug);
  if (!event) {
    return <div>Event not found</div>;
  }

  const [allProposals, votes] = await Promise.all([
    repos.sessionProposals.listByEvent(event.id),
    repos.votes.listByGuestAndEvent(currentUser, event.id),
  ]);
  const proposals = allProposals.filter(
    (proposal) => !proposal.hosts.some((h) => h.id === currentUser)
  );

  return (
    <QuickVoting
      proposals={proposals}
      currentUser={currentUser}
      initialVotes={votes}
      eventName={event.name}
      eventSlug={eventSlug}
    />
  );
}
