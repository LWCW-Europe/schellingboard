import Link from "next/link";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { SessionProposalForm } from "@/app/(site)/[eventSlug]/session-proposal-form";
import {
  verifiedCurrentUser,
  currentGuestSelection,
} from "@/utils/acting-guest";
import { notFound } from "next/navigation";

function CantEdit(props: { eventSlug: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
      <p className="text-gray-700">{props.children}</p>
      <Link
        href={`/${props.eventSlug}/proposals`}
        className="bg-rose-400 text-white font-semibold py-2 rounded shadow hover:bg-rose-500 active:bg-rose-500 w-fit px-12"
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
      // verifiedCurrentUser is null both when no name is selected and when the
      // selected name is protected but unverified — distinguish so a protected
      // host is told to authenticate, not to pick a name they already picked.
      const nameSelected = Boolean(await currentGuestSelection(cookieStore));
      return (
        <CantEdit eventSlug={eventSlug}>
          {nameSelected
            ? "This name is protected. Switch to it with your password or emailed code — via the name chip in the header — before editing this proposal."
            : "You need to select who you are before editing this proposal. Pick your name via the “Select your name” chip in the header at the top of the page."}
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
