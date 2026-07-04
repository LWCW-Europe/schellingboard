import { notFound, redirect } from "next/navigation";
import { getRepositories } from "@/db/container";
import { outOfRangePageRedirect } from "@/utils/pagination";
import { requireAdminPage } from "../../../require-admin";
import {
  EventProposalsManager,
  type ProposalRow,
  type EventGuest,
} from "../event-proposals-manager";

const PAGE_SIZE = 25;

function parsePage(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export default async function AdminEventProposalsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  const { q, page: pageParam } = await searchParams;
  const repos = getRepositories();
  const event = await repos.events.findById(id);
  if (!event) notFound();

  const page = parsePage(pageParam);
  const query = q?.trim() ?? "";

  const eventGuests: EventGuest[] = (await repos.guests.listByEvent(id)).map(
    (g) => ({ id: g.id, name: g.name })
  );

  const { rows, total } = await repos.sessionProposals.searchByEvent(id, {
    query: query || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const redirectTarget = outOfRangePageRedirect({
    basePath: `/admin/events/${id}/proposals`,
    page,
    total,
    pageSize: PAGE_SIZE,
    params: { q: query },
  });
  if (redirectTarget) redirect(redirectTarget);

  const proposalRows: ProposalRow[] = rows.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    durationMinutes: p.durationMinutes ?? null,
    hosts: p.hosts.map((h) => ({ id: h.id, name: h.name })),
    votesCount: p.votesCount,
    sessionCount: p.sessionIds.length,
  }));

  return (
    <EventProposalsManager
      proposals={proposalRows}
      eventGuests={eventGuests}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      query={query}
    />
  );
}
