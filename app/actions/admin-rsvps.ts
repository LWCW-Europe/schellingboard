"use server";

import { revalidatePath } from "next/cache";
import { getRepositories } from "@/db/container";
import { isAdminRequest } from "@/utils/acting-admin";
import type { AdminActionResult } from "./admin-guests";

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
