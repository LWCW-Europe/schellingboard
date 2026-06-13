import Link from "next/link";
import { getRepositories } from "@/db/container";
import { requireAdminPage } from "./require-admin";

export default async function AdminPage() {
  await requireAdminPage();

  const repositories = getRepositories();
  const events = await repositories.events.list();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Administration</h1>

      <section aria-label="Events" className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Events</h2>
        {events.length === 0 ? (
          <p className="text-sm text-gray-500">No events yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {events.map((event) => (
              <li key={event.id} className="py-3">
                <p className="font-medium text-gray-900">{event.name}</p>
                <p className="text-sm text-gray-500">
                  {event.start.toLocaleDateString()} –{" "}
                  {event.end.toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Global sections" className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Global</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/users"
            className="block rounded-md border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <p className="font-medium text-gray-900">Users</p>
            <p className="text-sm text-gray-500">
              Manage the global pool of users.
            </p>
          </Link>
          <Link
            href="/admin/locations"
            className="block rounded-md border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <p className="font-medium text-gray-900">Locations</p>
            <p className="text-sm text-gray-500">
              Manage the global pool of locations.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
