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
  revalidatePath("/admin/locations");
}

export async function assignLocationsToEventAction(input: {
  eventId: string;
  locationIds: string[];
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { events, locations } = getRepositories();
  const event = await events.findById(input.eventId);
  if (!event) return { ok: false, error: "Event not found" };

  if (input.locationIds.length > 0) {
    const existing = await locations.findExistingIds(input.locationIds);
    if (existing.length !== input.locationIds.length) {
      return { ok: false, error: "Location not found" };
    }
  }

  await locations.assignToEvent(input.eventId, input.locationIds);

  revalidateEventPaths(input.eventId);
  return { ok: true };
}

export async function removeLocationsFromEventAction(input: {
  eventId: string;
  locationIds: string[];
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { events, locations } = getRepositories();
  const event = await events.findById(input.eventId);
  if (!event) return { ok: false, error: "Event not found" };

  await locations.removeFromEvent(input.eventId, input.locationIds);

  revalidateEventPaths(input.eventId);
  return { ok: true };
}
