"use server";

import { getRepositories } from "@/db/container";
import { requireVerifiedGuest } from "@/utils/action-auth";
import {
  clashesForInterval,
  loadGuestSchedules,
  type GuestClash,
} from "@/utils/guest-clashes";

export type { GuestClash };

export async function detectGuestClashes(input: {
  eventId: string;
  guestIds: string[];
  start: string; // ISO — candidate session start
  end: string; // ISO — candidate session end
  excludeSessionId?: string | null;
}): Promise<GuestClash[]> {
  // Site auth is shared with every attendee, so it can't be the gate on a
  // reply that reports when another guest is privately busy.
  await requireVerifiedGuest("checking guest availability");
  const { eventId, guestIds, start, end, excludeSessionId } = input;
  if (guestIds.length === 0) return [];

  const event = await getRepositories().events.findById(eventId);
  if (!event) return [];

  const schedules = await loadGuestSchedules(eventId, guestIds);
  return clashesForInterval(schedules, {
    eventId,
    start: new Date(start),
    end: new Date(end),
    breakMinutes: event.breakMinutes,
    excludeSessionId,
  });
}
