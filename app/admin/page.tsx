import { redirect } from "next/navigation";
import { requireAdminPage } from "./require-admin";

export default async function AdminPage() {
  await requireAdminPage();
  // The events list is the admin landing page; there is no separate dashboard.
  redirect("/admin/events");
}
