"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getRepositories } from "@/db/container";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { serverNow } from "@/utils/dev-clock-server";
import { requireSiteAuth } from "@/utils/action-auth";

export type NotificationActionResult =
  { ok: true } | { ok: false; error: string };

const NO_USER = "No user is logged in";

export async function markNotificationReadAction(
  id: string
): Promise<NotificationActionResult> {
  await requireSiteAuth();
  const currentUser = await verifiedCurrentUser(await cookies());
  if (!currentUser) return { ok: false, error: NO_USER };

  const marked = await getRepositories().notifications.markRead(
    currentUser,
    id,
    await serverNow()
  );
  if (!marked) return { ok: false, error: "Notification not found" };

  // Only this page: the badge sits in a layout that reads cookies, so it is
  // never statically cached, and the caller refreshes the router anyway.
  // revalidatePath("/", "layout") would purge every route for every visitor.
  revalidatePath("/notifications");
  return { ok: true };
}

export async function markAllNotificationsReadAction(): Promise<NotificationActionResult> {
  await requireSiteAuth();
  const currentUser = await verifiedCurrentUser(await cookies());
  if (!currentUser) return { ok: false, error: NO_USER };

  await getRepositories().notifications.markAllRead(
    currentUser,
    await serverNow()
  );
  revalidatePath("/notifications");
  return { ok: true };
}

/**
 * What clicking a notification does: mark it read, then go to what happened.
 * One step rather than a fire-and-forget call racing the navigation away from
 * the page. Silently does nothing when the notification isn't the caller's —
 * there is no page left to report an error on.
 */
export async function openNotificationAction(id: string): Promise<void> {
  await requireSiteAuth();
  const currentUser = await verifiedCurrentUser(await cookies());
  if (!currentUser) return;

  const { notifications } = getRepositories();
  const notification = await notifications.findForGuest(currentUser, id);
  if (!notification) return;

  await notifications.markRead(currentUser, id, await serverNow());
  revalidatePath("/notifications");
  redirect(notification.url);
}
