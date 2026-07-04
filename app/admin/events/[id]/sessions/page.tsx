import { notFound, redirect } from "next/navigation";
import { getRepositories } from "@/db/container";
import { outOfRangePageRedirect } from "@/utils/pagination";
import { requireAdminPage } from "../../../require-admin";
import {
  EventSessionsManager,
  type SessionRow,
  type EventGuest,
  type EventLocation,
} from "../event-sessions-manager";

const PAGE_SIZE = 25;

function parsePage(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export default async function AdminEventSessionsPage({
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
  // RSVP names resolve against all guests, not just currently-assigned ones.
  const guestNameById = new Map(
    (await repos.guests.list()).map((g) => [g.id, g.name])
  );

  const allLocations = await repos.locations.list();
  const assignedLocationIds = new Set(
    await repos.locations.listLocationIdsByEvent(id)
  );
  const eventLocations: EventLocation[] = allLocations
    .filter((l) => assignedLocationIds.has(l.id))
    .map((l) => ({ id: l.id, name: l.name }));

  const { rows, total } = await repos.sessions.searchByEvent(id, {
    query: query || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const redirectTarget = outOfRangePageRedirect({
    basePath: `/admin/events/${id}/sessions`,
    page,
    total,
    pageSize: PAGE_SIZE,
    params: { q: query },
  });
  if (redirectTarget) redirect(redirectTarget);

  const sessionRows: SessionRow[] = await Promise.all(
    rows.map(async (s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      startTime: s.startTime ? s.startTime.toISOString() : null,
      endTime: s.endTime ? s.endTime.toISOString() : null,
      capacity: s.capacity,
      attendeeScheduled: s.attendeeScheduled,
      blocker: s.blocker,
      closed: s.closed,
      hosts: s.hosts.map((h) => ({ id: h.id, name: h.name })),
      locations: s.locations.map((l) => ({ id: l.id, name: l.name })),
      numRsvps: s.numRsvps,
      rsvps: (await repos.rsvps.listBySession(s.id)).map((r) => ({
        guestId: r.guestId,
        name: guestNameById.get(r.guestId) ?? "Unknown guest",
      })),
    }))
  );

  return (
    <EventSessionsManager
      sessions={sessionRows}
      eventGuests={eventGuests}
      eventLocations={eventLocations}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      query={query}
    />
  );
}
