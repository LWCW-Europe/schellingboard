import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";
import { PageNotice } from "@/app/components/page-notice";
import { SessionProposalForm } from "../../session-proposal-form";

export default async function NewProposalPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;

  const repos = getRepositories();
  const event = await repos.events.findBySlug(eventSlug);

  if (!event) {
    return <div>Event not found</div>;
  }

  const cookieStore = await cookies();
  if (!(await verifiedCurrentUser(cookieStore))) {
    return (
      <PageNotice backHref={`/${eventSlug}/proposals`} backLabel="Proposals">
        {await unverifiedUserMessage(cookieStore, "creating a proposal")}
      </PageNotice>
    );
  }

  const guests = await repos.guests.list();

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <SessionProposalForm
        eventID={event.id}
        eventSlug={eventSlug}
        guests={guests}
        maxSessionDuration={event.maxSessionDuration}
      />
    </div>
  );
}
