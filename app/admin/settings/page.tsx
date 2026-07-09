import { getRepositories } from "@/db/container";
import { requireAdminPage } from "../require-admin";
import { SettingsManager } from "../settings-manager";

export default async function AdminSettingsPage() {
  await requireAdminPage();

  const settings = await getRepositories().settings.get();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <section aria-label="Site settings" className="space-y-4">
        <SettingsManager settings={settings} />
      </section>
    </div>
  );
}
