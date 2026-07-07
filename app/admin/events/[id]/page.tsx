import { notFound } from "next/navigation";
import { getRepositories } from "@/db/container";
import { sessionOverlapsWindow } from "@/utils/day-window";
import { requireAdminPage } from "../../require-admin";
import { EventDetailForm } from "./event-detail-form";
import { EventPhasesForm } from "./event-phases-form";
import { EventDaysManager, type SerializedDay } from "./event-days-manager";
import {
  EventLocationsManager,
  type LocationRow,
} from "./event-locations-manager";

export default async function AdminEventConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  const repos = getRepositories();
  const event = await repos.events.findById(id);
  if (!event) notFound();

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
    <div className="space-y-6">
      {/* Config forms stay in a readable column; the tables below go wide. */}
      <div className="max-w-3xl">
        <EventDetailForm event={event} />
      </div>
      <hr className="border-gray-200" />
      <div className="max-w-3xl">
        <EventPhasesForm event={event} />
      </div>
      <hr className="border-gray-200" />
      <EventDaysManager days={days} eventId={id} />
      <hr className="border-gray-200" />
      <EventLocationsManager locations={locationRows} eventId={id} />
    </div>
  );
}
