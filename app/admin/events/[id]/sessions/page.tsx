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
  const assignedLocationIds = new Set(
    await repos.locations.listLocationIdsByEvent(id)
  );
  const eventLocations: EventLocation[] = allLocations
    .filter((l) => assignedLocationIds.has(l.id))
    .map((l) => ({ id: l.id, name: l.name }));

  const sessions = await repos.sessions.listByEvent(id);
  const rsvpsBySession = new Map<string, { guestId: string; name: string }[]>();
  for (const r of await repos.rsvps.listBySessions(sessions.map((s) => s.id))) {
    let list = rsvpsBySession.get(r.sessionId);
    if (!list) rsvpsBySession.set(r.sessionId, (list = []));
    list.push({
      guestId: r.guestId,
      name: guestNameById.get(r.guestId) ?? "Unknown guest",
    });
  }

  const sessionRows: SessionRow[] = sessions.map((s) => ({
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
    rsvps: rsvpsBySession.get(s.id) ?? [],
  }));

  return (
    <EventSessionsManager
      sessions={sessionRows}
      eventGuests={eventGuests}
      eventLocations={eventLocations}
    />
  );
}
