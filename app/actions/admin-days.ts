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

export type DayInput = {
  eventId: string;
  start: string;
  end: string;
  startBookings: string;
  endBookings: string;
};

function parseDateTime(value: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + "Z");
  return isNaN(d.getTime()) ? undefined : d;
}

type ParsedDay = {
  eventId: string;
  start: Date;
  end: Date;
  startBookings: Date;
  endBookings: Date;
};

function parseDayInput(
  input: DayInput
): { data: ParsedDay } | { error: string } {
  const start = parseDateTime(input.start);
  if (!start) {
    return { error: "Invalid start date/time" };
  }

  const end = parseDateTime(input.end);
  if (!end) {
    return { error: "Invalid end date/time" };
  }

  if (end <= start) {
    return { error: "Day end must be after start" };
  }

  const startBookings = parseDateTime(input.startBookings);
  if (!startBookings) {
    return { error: "Invalid bookings start date/time" };
  }

  const endBookings = parseDateTime(input.endBookings);
  if (!endBookings) {
    return { error: "Invalid bookings end date/time" };
  }

  if (endBookings <= startBookings) {
    return { error: "Bookings end must be after bookings start" };
  }

  if (startBookings < start || endBookings > end) {
    return { error: "Bookings window must be within the day window" };
  }

  return {
    data: { eventId: input.eventId, start, end, startBookings, endBookings },
  };
}

function daysOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

function revalidateDayPaths(eventId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
}

export async function createDayAction(
  input: DayInput
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = parseDayInput(input);
  if ("error" in parsed) {
    return { ok: false, error: parsed.error };
  }

  const repos = getRepositories();
  const event = await repos.events.findById(input.eventId);
  if (!event) {
    return { ok: false, error: "Event not found" };
  }

  const existingDays = await repos.days.listByEvent(input.eventId);
  if (
    existingDays.some((d) =>
      daysOverlap(parsed.data.start, parsed.data.end, d.start, d.end)
    )
  ) {
    return { ok: false, error: "Day overlaps an existing day" };
  }

  try {
    await repos.days.create(parsed.data);
  } catch {
    return { ok: false, error: "Failed to create day" };
  }
  revalidateDayPaths(input.eventId);
  return { ok: true };
}

export async function updateDayAction(
  input: DayInput & { id: string }
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const existing = await getRepositories().days.findById(input.id);
  if (!existing) {
    return { ok: false, error: "Day not found" };
  }

  const parsed = parseDayInput(input);
  if ("error" in parsed) {
    return { ok: false, error: parsed.error };
  }

  const { start, end, startBookings, endBookings } = parsed.data;

  const existingDays = await getRepositories().days.listByEvent(
    existing.eventId
  );
  if (
    existingDays.some(
      (d) => d.id !== input.id && daysOverlap(start, end, d.start, d.end)
    )
  ) {
    return { ok: false, error: "Day overlaps an existing day" };
  }

  let updated;
  try {
    updated = await getRepositories().days.update(input.id, {
      start,
      end,
      startBookings,
      endBookings,
    });
  } catch {
    return { ok: false, error: "Failed to update day" };
  }

  if (!updated) {
    return { ok: false, error: "Day not found" };
  }

  revalidateDayPaths(existing.eventId);
  return { ok: true };
}

export async function deleteDayAction(input: {
  id: string;
  eventId: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const day = await getRepositories().days.findById(input.id);
  if (!day) {
    return { ok: false, error: "Day not found" };
  }

  await getRepositories().days.delete(input.id);
  revalidateDayPaths(day.eventId);
  return { ok: true };
}
