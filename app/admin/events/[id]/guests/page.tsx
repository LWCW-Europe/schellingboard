import { notFound } from "next/navigation";
import { getRepositories } from "@/db/container";
import { requireAdminPage } from "../../../require-admin";
import { EventGuestsManager, type GuestRow } from "../event-guests-manager";

export default async function AdminEventGuestsPage({
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

  return <EventGuestsManager guests={guestRows} eventId={id} />;
}
