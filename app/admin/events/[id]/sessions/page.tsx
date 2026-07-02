import { notFound } from "next/navigation";
import { getRepositories } from "@/db/container";
import { requireAdminPage } from "../../../require-admin";
import {
  EventSessionsManager,
  type SessionRow,
  type EventGuest,
  type EventLocation,
} from "../event-sessions-manager";

export default async function AdminEventSessionsPage({
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
  // RSVP names resolve against all guests, not just currently-assigned ones.
  const guestNameById = new Map(
    (await repos.guests.list()).map((g) => [g.id, g.name])
  );

  const allLocations = await repos.locations.list();
  const eventLocations: EventLocation[] = (
    await Promise.all(
      allLocations.map(async (l) => ({
        location: l,
        assigned: (await repos.locations.listEventIds(l.id)).includes(id),
      }))
    )
  )
    .filter((l) => l.assigned)
    .map((l) => ({ id: l.location.id, name: l.location.name }));

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

  return (
    <EventSessionsManager
      sessions={sessionRows}
      eventGuests={eventGuests}
      eventLocations={eventLocations}
    />
  );
}
