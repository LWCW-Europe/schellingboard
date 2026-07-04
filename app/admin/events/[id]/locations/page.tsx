import { notFound, redirect } from "next/navigation";
import { getRepositories } from "@/db/container";
import { outOfRangePageRedirect } from "@/utils/pagination";
import { requireAdminPage } from "../../../require-admin";
import {
  EventLocationsManager,
  type LocationFilter,
  type LocationRow,
} from "../event-locations-manager";

const PAGE_SIZE = 25;

function parseFilter(value: string | undefined): LocationFilter {
  return value === "assigned" || value === "not-assigned" ? value : "all";
}

function parsePage(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export default async function AdminEventLocationsPage({
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

  const { rows, total } = await repos.locations.searchForEventAssignment(id, {
    query: query || undefined,
    assigned,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const redirectTarget = outOfRangePageRedirect({
    basePath: `/admin/events/${id}/locations`,
    page,
    total,
    pageSize: PAGE_SIZE,
    params: { q: query, filter: filter === "all" ? "" : filter },
  });
  if (redirectTarget) redirect(redirectTarget);

  const locationRows: LocationRow[] = rows.map((l) => ({
    id: l.id,
    name: l.name,
    capacity: l.capacity,
    assigned: l.assigned,
  }));

  return (
    <EventLocationsManager
      locations={locationRows}
      eventId={id}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      query={query}
      filter={filter}
    />
  );
}
