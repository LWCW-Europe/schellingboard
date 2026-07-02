import { getRepositories } from "@/db/container";
import { requireAdminPage } from "../require-admin";
import { LocationsManager, type AdminLocation } from "../locations-manager";

export default async function AdminLocationsPage() {
  await requireAdminPage();

  const repositories = getRepositories();
  const events = await repositories.events.list();
  const locations: AdminLocation[] = await Promise.all(
    (await repositories.locations.list()).map(async (location) => ({
      location,
      eventIds: await repositories.locations.listEventIds(location.id),
      sessionLinkCount: await repositories.locations.countSessionLinks(
        location.id
      ),
    }))
  );

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
