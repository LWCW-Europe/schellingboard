import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";

/**
 * Defense in depth: the proxy already guards /admin, but every admin server
 * component re-checks the cookie and redirects to the login on failure.
 */
export async function requireAdminPage(): Promise<void> {
  const cookieStore = await cookies();
  const isAdmin = await isAdminCookieValid(
    cookieStore.get(ADMIN_COOKIE_NAME)?.value
  );
  if (!isAdmin) {
    redirect("/admin/login");
  }
}
