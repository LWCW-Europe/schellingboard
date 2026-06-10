import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import { GuestsManager } from "./guests-manager";

export default async function AdminPage() {
  // Defense in depth: the proxy already guards /admin, but verify here too
  const cookieStore = await cookies();
  const isAdmin = await isAdminCookieValid(
    cookieStore.get(ADMIN_COOKIE_NAME)?.value
  );
  if (!isAdmin) {
    redirect("/admin/login");
  }

  const guests = await getRepositories().guests.list();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Administration</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Users</h2>
        <GuestsManager guests={guests} />
      </section>
    </div>
  );
}
