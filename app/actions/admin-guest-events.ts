"use server";

import { revalidatePath } from "next/cache";
import { getRepositories } from "@/db/container";
import { isAdminRequest } from "@/utils/acting-admin";
import type { AdminActionResult } from "./admin-guests";

function revalidateEventPaths(eventId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
}

export async function assignGuestsToEventAction(input: {
  eventId: string;
  guestIds: string[];
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { events, guests } = getRepositories();
  const event = await events.findById(input.eventId);
  if (!event) return { ok: false, error: "Event not found" };

  const uniqueGuestIds = [...new Set(input.guestIds)];
  if (uniqueGuestIds.length > 0) {
    const existing = await guests.findExistingIds(uniqueGuestIds);
    if (existing.length !== uniqueGuestIds.length) {
      return { ok: false, error: "Guest not found" };
    }
  }

  await guests.assignToEvent(input.eventId, input.guestIds);
  revalidateEventPaths(input.eventId);
  return { ok: true };
}

export async function removeGuestsFromEventAction(input: {
  eventId: string;
  guestIds: string[];
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const event = await getRepositories().events.findById(input.eventId);
  if (!event) return { ok: false, error: "Event not found" };

  await getRepositories().guests.removeFromEvent(input.eventId, input.guestIds);
  revalidateEventPaths(input.eventId);
  return { ok: true };
}
