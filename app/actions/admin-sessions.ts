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

// Times must form a valid interval: both set (end after start) or both empty.
function parseTimeRange(
  startTime: string | null,
  endTime: string | null
): { start?: Date; end?: Date } | { error: string } {
  if (!startTime && !endTime) return {};
  if (!startTime || !endTime)
    return { error: "Start and end time must both be set or both empty" };
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return { error: "Invalid start or end time" };
  if (end <= start) return { error: "End time must be after start time" };
  return { start, end };
}

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

  const range = parseTimeRange(input.startTime, input.endTime);
  if ("error" in range) return { ok: false, error: range.error };

  if (!Number.isInteger(input.capacity) || input.capacity < 0)
    return { ok: false, error: "Capacity must be a non-negative whole number" };

  const { sessions } = getRepositories();
  const session = await sessions.findById(input.id);
  if (!session) return { ok: false, error: "Session not found" };

  try {
    await sessions.update(input.id, {
      title,
      description: input.description.trim(),
      startTime: range.start,
      endTime: range.end,
      capacity: input.capacity,
      attendeeScheduled: input.attendeeScheduled,
      blocker: input.blocker,
      closed: input.closed,
      hostIds: input.hostIds,
      locationIds: input.locationIds,
    });
  } catch {
    return { ok: false, error: "Failed to update session" };
  }

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

  try {
    await sessions.delete(input.id);
  } catch {
    return { ok: false, error: "Failed to delete session" };
  }

  revalidateEventPaths(session.eventId);
  return { ok: true };
}
