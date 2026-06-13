import { getRepositories } from "@/db/container";
import { requireAdminPage } from "../require-admin";
import { GuestsManager } from "../guests-manager";

export default async function AdminUsersPage() {
  await requireAdminPage();

  const repositories = getRepositories();
  const guests = await repositories.guests.list();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      <section aria-label="Users" className="space-y-4">
        <GuestsManager guests={guests} />
      </section>
    </div>
  );
}
