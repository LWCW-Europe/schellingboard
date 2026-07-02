import { notFound } from "next/navigation";
import { getRepositories } from "@/db/container";
import { requireAdminPage } from "../../../require-admin";
import {
  EventProposalsManager,
  type ProposalRow,
  type EventGuest,
} from "../event-proposals-manager";

export default async function AdminEventProposalsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  const repos = getRepositories();
  const event = await repos.events.findById(id);
  if (!event) notFound();

  const eventGuests: EventGuest[] = (await repos.guests.listByEvent(id)).map(
    (g) => ({ id: g.id, name: g.name })
  );

  const proposalRows: ProposalRow[] = (
    await repos.sessionProposals.listByEvent(id)
  ).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    durationMinutes: p.durationMinutes ?? null,
    hosts: p.hosts.map((h) => ({ id: h.id, name: h.name })),
    votesCount: p.votesCount,
    sessionCount: p.sessionIds.length,
  }));

  return (
    <EventProposalsManager proposals={proposalRows} eventGuests={eventGuests} />
  );
}
