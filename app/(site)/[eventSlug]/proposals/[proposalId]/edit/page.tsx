import Link from "next/link";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { SessionProposalForm } from "@/app/(site)/[eventSlug]/session-proposal-form";
import {
  verifiedCurrentUser,
  unverifiedUserMessage,
} from "@/utils/acting-guest";
import { notFound } from "next/navigation";

function CantEdit(props: { eventSlug: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
      <p className="text-fg-muted">{props.children}</p>
      <Link
        href={`/${props.eventSlug}/proposals`}
        className="bg-brand text-on-brand font-semibold py-2 rounded shadow hover:bg-brand-hover active:bg-brand-hover w-fit px-12"
      >
        Back to proposals
      </Link>
    </div>
  );
}

export default async function EditProposalPage({
  params,
}: {
  params: Promise<{ eventSlug: string; proposalId: string }>;
}) {
  const { eventSlug, proposalId } = await params;

  const repos = getRepositories();
  const event = await repos.events.findBySlug(eventSlug);

  if (!event) {
    return <div>Event not found</div>;
  }

  const [proposal, guests] = await Promise.all([
    repos.sessionProposals.findById(proposalId),
    repos.guests.list(),
  ]);

  if (!proposal) {
    notFound();
  }

  if (proposal.hosts.length > 0) {
    const cookieStore = await cookies();
    const currentUser = await verifiedCurrentUser(cookieStore);
    if (!currentUser) {
      return (
        <CantEdit eventSlug={eventSlug}>
          {await unverifiedUserMessage(cookieStore, "editing this proposal")}
        </CantEdit>
      );
    }
    if (!proposal.hosts.some((h) => h.id === currentUser)) {
      return (
        <CantEdit eventSlug={eventSlug}>
          Only a host of this proposal can edit it.
        </CantEdit>
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <SessionProposalForm
        eventID={event.id}
        eventSlug={eventSlug}
        proposal={proposal}
        guests={guests}
        maxSessionDuration={event.maxSessionDuration}
      />
    </div>
  );
}
