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

export type AdminSessionInput = {
  id: string;
  title: string;
  description: string;
  startTime: string | null;
  endTime: string | null;
  capacity: number;
  attendeeScheduled: boolean;
  blocker: boolean;
  closed: boolean;
  hostIds: string[];
  locationIds: string[];
};

function revalidateEventPaths(eventId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
}

export async function adminUpdateSessionAction(
  input: AdminSessionInput
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required" };

  const { sessions } = getRepositories();
  const session = await sessions.findById(input.id);
  if (!session) return { ok: false, error: "Session not found" };

  await sessions.update(input.id, {
    title,
    description: input.description.trim(),
    startTime: input.startTime ? new Date(input.startTime) : undefined,
    endTime: input.endTime ? new Date(input.endTime) : undefined,
    capacity: input.capacity,
    attendeeScheduled: input.attendeeScheduled,
    blocker: input.blocker,
    closed: input.closed,
    hostIds: input.hostIds,
    locationIds: input.locationIds,
  });

  revalidateEventPaths(session.eventId);
  return { ok: true };
}

export async function adminDeleteSessionAction(input: {
  id: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { sessions } = getRepositories();
  const session = await sessions.findById(input.id);
  if (!session) return { ok: false, error: "Session not found" };

  await sessions.delete(input.id);

  revalidateEventPaths(session.eventId);
  return { ok: true };
}
