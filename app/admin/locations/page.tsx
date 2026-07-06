import { getRepositories } from "@/db/container";
import { requireAdminPage } from "../require-admin";
import { LocationsManager, type AdminLocation } from "../locations-manager";

export default async function AdminLocationsPage() {
  await requireAdminPage();

  const repositories = getRepositories();
  const events = await repositories.events.list();
  const allLocations = await repositories.locations.list();
  const locationIds = allLocations.map((l) => l.id);
  const eventIdsByLocation =
    await repositories.locations.listEventIdsByLocations(locationIds);
  const sessionLinkCounts =
    await repositories.locations.countSessionLinksByLocations(locationIds);
  const locations: AdminLocation[] = allLocations.map((location) => ({
    location,
    eventIds: eventIdsByLocation.get(location.id) ?? [],
    sessionLinkCount: sessionLinkCounts.get(location.id) ?? 0,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
      <section aria-label="Locations" className="space-y-4">
        <LocationsManager
          locations={locations}
          events={events.map((e) => ({ id: e.id, name: e.name }))}
        />
      </section>
    </div>
  );
}
