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
