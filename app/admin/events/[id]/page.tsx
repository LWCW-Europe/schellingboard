import { notFound } from "next/navigation";
import Link from "next/link";
import { getRepositories } from "@/db/container";
import { sessionOverlapsWindow } from "@/utils/day-window";
import { requireAdminPage } from "../../require-admin";
import { EventDetailForm } from "./event-detail-form";
import { EventPhasesForm } from "./event-phases-form";
import { EventDaysManager, type SerializedDay } from "./event-days-manager";
import { EventGuestsManager, type GuestRow } from "./event-guests-manager";
import {
  EventLocationsManager,
  type LocationRow,
} from "./event-locations-manager";
import {
  EventProposalsManager,
  type ProposalRow,
  type EventGuest,
} from "./event-proposals-manager";
import {
  EventSessionsManager,
  type SessionRow,
  type EventLocation,
} from "./event-sessions-manager";

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  const repos = getRepositories();
  const event = await repos.events.findById(id);
  if (!event) notFound();

  const allGuests = await repos.guests.listFull();
  const assignedGuestIds = new Set(
    (await repos.guests.listByEvent(id)).map((g) => g.id)
  );
  const guestRows: GuestRow[] = allGuests.map((g) => ({
    id: g.id,
    name: g.name,
    email: g.info.email,
    assigned: assignedGuestIds.has(g.id),
  }));
  const eventGuests: EventGuest[] = allGuests
    .filter((g) => assignedGuestIds.has(g.id))
    .map((g) => ({ id: g.id, name: g.name }));

  const allLocations = await repos.locations.list();
  const assignedLocationIds = new Set(
    await repos.locations.listLocationIdsByEvent(id)
  );
  const locationRows: LocationRow[] = allLocations.map((l) => ({
    id: l.id,
    name: l.name,
    capacity: l.capacity,
    assigned: assignedLocationIds.has(l.id),
  }));

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

  const eventLocations: EventLocation[] = locationRows
    .filter((l) => l.assigned)
    .map((l) => ({ id: l.id, name: l.name }));

  const guestNameById = new Map(allGuests.map((g) => [g.id, g.name]));
  const sessionRows: SessionRow[] = await Promise.all(
    (await repos.sessions.listByEvent(id)).map(async (s) => ({
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
  const scheduledSessions = await repos.sessions.listScheduledByEvent(id);
  const days: SerializedDay[] = (await repos.days.listByEvent(id)).map((d) => ({
    id: d.id,
    eventId: d.eventId,
    start: d.start.toISOString(),
    end: d.end.toISOString(),
    startBookings: d.startBookings.toISOString(),
    endBookings: d.endBookings.toISOString(),
    affectedSessionTitles: scheduledSessions
      .filter((s) => sessionOverlapsWindow(s, d.start, d.end))
      .map((s) => s.title),
  }));

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Events
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
      <EventDetailForm event={event} />
      <hr className="border-gray-200" />
      <EventPhasesForm event={event} />
      <hr className="border-gray-200" />
      <EventDaysManager days={days} eventId={id} />
      <hr className="border-gray-200" />
      <EventGuestsManager guests={guestRows} eventId={id} />
      <hr className="border-gray-200" />
      <EventLocationsManager locations={locationRows} eventId={id} />
      <hr className="border-gray-200" />
      <EventProposalsManager
        proposals={proposalRows}
        eventGuests={eventGuests}
      />
      <hr className="border-gray-200" />
      <EventSessionsManager
        sessions={sessionRows}
        eventGuests={eventGuests}
        eventLocations={eventLocations}
      />
    </div>
  );
}
