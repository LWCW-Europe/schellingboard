import { getRepositories } from "@/db/container";
import { requireAdminPage } from "../../require-admin";
import { UserImportForm } from "./user-import-form";

export default async function AdminUserImportPage() {
  await requireAdminPage();

  const events = await getRepositories().events.list();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Import users</h1>
      <p className="text-sm text-gray-600">
        Upload a CSV file with a header row containing <code>name</code> and{" "}
        <code>email</code> columns (extra columns are ignored). Users are
        matched by email: existing users are left unchanged, new ones are
        created. Both are assigned to the selected events, so re-running an
        import is safe.
      </p>
      <UserImportForm
        events={events.map((e) => ({ id: e.id, name: e.name }))}
      />
    </div>
  );
}
