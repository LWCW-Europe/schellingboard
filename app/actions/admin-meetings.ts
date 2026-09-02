"use server";

import { revalidatePath } from "next/cache";
import { getRepositories } from "@/db/container";
import { isAdminRequest } from "@/utils/acting-admin";
import type { AdminActionResult } from "./admin-guests";

export type EventMeetingsInput = {
  id: string;
  meetingsEnabled: boolean;
  maxOpenMeetingRequests: string;
};

export type MeetingPointInput = {
  eventId: string;
  name: string;
  description?: string;
};

function revalidateMeetingPaths(eventId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
}

type ParsedMeetings =
  | { meetingsEnabled: false }
  | { meetingsEnabled: true; maxOpenMeetingRequests: number };

function parseMeetingsInput(
  input: EventMeetingsInput
): { data: ParsedMeetings } | { error: string } {
  // The cap is hidden while meetings are off, so judging it then would reject
  // a save with an error about a field the organizer cannot see -- and leave
  // them unable to switch meetings off at all.
  if (!input.meetingsEnabled) {
    return { data: { meetingsEnabled: false } };
  }

  const maxOpenMeetingRequests = parseInt(input.maxOpenMeetingRequests, 10);
  // Zero would leave meetings switched on but nobody able to ask for one.
  if (isNaN(maxOpenMeetingRequests) || maxOpenMeetingRequests < 1) {
    return { error: "Maximum open requests must be at least 1" };
  }

  return { data: { meetingsEnabled: true, maxOpenMeetingRequests } };
}

export async function updateEventMeetingsAction(
  input: EventMeetingsInput
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = parseMeetingsInput(input);
  if ("error" in parsed) {
    return { ok: false, error: parsed.error };
  }

  const updated = await getRepositories().events.update(input.id, parsed.data);
  if (!updated) return { ok: false, error: "Event not found" };

  revalidateMeetingPaths(input.id);
  return { ok: true };
}

export async function createMeetingPointAction(
  input: MeetingPointInput
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Name is required" };

  const repos = getRepositories();
  const event = await repos.events.findById(input.eventId);
  if (!event) return { ok: false, error: "Event not found" };

  const existing = await repos.meetingPoints.listByEvent(input.eventId);
  await repos.meetingPoints.create({
    eventId: input.eventId,
    name,
    description: input.description?.trim() ?? "",
    // Append: max rather than length, so the order survives a deletion.
    sortIndex: existing.reduce((max, p) => Math.max(max, p.sortIndex), -1) + 1,
  });

  revalidateMeetingPaths(input.eventId);
  return { ok: true };
}

export async function updateMeetingPointAction(
  input: MeetingPointInput & { id: string }
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Name is required" };

  const repos = getRepositories();
  // Scoped to the event whose section is open, so an id from elsewhere can't
  // reach another event's points.
  const points = await repos.meetingPoints.listByEvent(input.eventId);
  if (!points.some((p) => p.id === input.id)) {
    return { ok: false, error: "Meeting point not found" };
  }

  await repos.meetingPoints.update(input.id, {
    name,
    description: input.description?.trim() ?? "",
  });

  revalidateMeetingPaths(input.eventId);
  return { ok: true };
}

export async function deleteMeetingPointAction(input: {
  id: string;
  eventId: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const repos = getRepositories();
  const points = await repos.meetingPoints.listByEvent(input.eventId);
  if (!points.some((p) => p.id === input.id)) {
    return { ok: false, error: "Meeting point not found" };
  }

  await repos.meetingPoints.delete(input.id);

  revalidateMeetingPaths(input.eventId);
  return { ok: true };
}
