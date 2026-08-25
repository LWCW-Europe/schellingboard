import { redirect } from "next/navigation";
import { isAdminRequest } from "@/utils/acting-admin";

/**
 * Defense in depth: the proxy already guards /admin, but every admin server
 * component re-checks the cookie and redirects to the login on failure.
 */
export async function requireAdminPage(): Promise<void> {
  if (!(await isAdminRequest())) {
    redirect("/admin/login");
  }
}
