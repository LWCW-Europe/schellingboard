import { notFound } from "next/navigation";
import Link from "next/link";
import { getRepositories } from "@/db/container";
import { requireAdminPage } from "../../require-admin";
import { EventDetailForm } from "./event-detail-form";
import { EventPhasesForm } from "./event-phases-form";
import { EventDaysManager, type SerializedDay } from "./event-days-manager";

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

  const days: SerializedDay[] = (await repos.days.listByEvent(id)).map((d) => ({
    id: d.id,
    eventId: d.eventId,
    start: d.start.toISOString(),
    end: d.end.toISOString(),
    startBookings: d.startBookings.toISOString(),
    endBookings: d.endBookings.toISOString(),
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
    </div>
  );
}
