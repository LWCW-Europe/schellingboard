import { notFound, redirect } from "next/navigation";
import { getRepositories } from "@/db/container";
import { outOfRangePageRedirect } from "@/utils/pagination";
import { requireAdminPage } from "../../../require-admin";
import {
  EventGuestsManager,
  type GuestFilter,
  type GuestRow,
} from "../event-guests-manager";

const PAGE_SIZE = 25;

function parseFilter(value: string | undefined): GuestFilter {
  return value === "assigned" || value === "not-assigned" ? value : "all";
}

function parsePage(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export default async function AdminEventGuestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; page?: string; filter?: string }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  const { q, page: pageParam, filter: filterParam } = await searchParams;
  const repos = getRepositories();
  const event = await repos.events.findById(id);
  if (!event) notFound();

  const filter = parseFilter(filterParam);
  const page = parsePage(pageParam);
  const query = q?.trim() ?? "";
  const assigned =
    filter === "assigned"
      ? true
      : filter === "not-assigned"
        ? false
        : undefined;

  const { rows, total } = await repos.guests.searchForEventAssignment(id, {
    query: query || undefined,
    assigned,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const redirectTarget = outOfRangePageRedirect({
    basePath: `/admin/events/${id}/guests`,
    page,
    total,
    pageSize: PAGE_SIZE,
    params: { q: query, filter: filter === "all" ? "" : filter },
  });
  if (redirectTarget) redirect(redirectTarget);

  const guestRows: GuestRow[] = rows.map((g) => ({
    id: g.id,
    name: g.name,
    email: g.email,
    assigned: g.assigned,
  }));

  return (
    <EventGuestsManager
      guests={guestRows}
      eventId={id}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      query={query}
      filter={filter}
    />
  );
}
