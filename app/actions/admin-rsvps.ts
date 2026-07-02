"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import type { AdminActionResult } from "./admin-guests";

async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function adminRemoveRsvpAction(input: {
  sessionId: string;
  guestId: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { sessions, rsvps } = getRepositories();
  const session = await sessions.findById(input.sessionId);
  if (!session) return { ok: false, error: "Session not found" };

  await rsvps.deleteBySessionAndGuest(input.sessionId, input.guestId);

  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${session.eventId}`);
  return { ok: true };
}
