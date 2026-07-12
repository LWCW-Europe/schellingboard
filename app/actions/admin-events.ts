"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { eventNameToSlug, RESERVED_EVENT_SLUGS } from "@/utils/utils";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import type { Event } from "@/db/repositories/interfaces";
import type { AdminActionResult } from "./admin-guests";
import { isEventIconName } from "@/app/event-icons";
import {
  SLOT_INCREMENT_OPTIONS,
  isValidSlotIncrement,
  isSlotAligned,
} from "@/utils/slots";
import { sessionOverlapsWindow } from "@/utils/day-window";

async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export type EventInput = {
  name: string;
  description: string;
  website: string;
  start: string;
  end: string;
  timezone: string;
  maxSessionDuration: string;
  breakMinutes: string;
  slotIncrementMinutes: string;
  rsvpCapacityHardLimit?: boolean;
  icon?: string;
};

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

// Phase dates are deliberately excluded: they are managed only by
// updateEventPhasesAction. Including the keys here (even as undefined) would
// make the repository update NULL them out on every basic-info save.
type ParsedEvent = Omit<
  Event,
  | "id"
  | "slug"
  | "proposalPhaseStart"
  | "proposalPhaseEnd"
  | "votingPhaseStart"
  | "votingPhaseEnd"
  | "schedulingPhaseStart"
  | "schedulingPhaseEnd"
>;
type ParseResult = { data: ParsedEvent } | { error: string };

function parseEventInput(input: EventInput): ParseResult {
  const name = input.name.trim();
  if (!name) return { error: "Name is required" };

  const start = parseDate(input.start);
  if (!start) return { error: "Invalid start date" };

  const end = parseDate(input.end);
  if (!end) return { error: "Invalid end date" };

  if (end <= start) return { error: "End date must be after start date" };

  const timezone = input.timezone.trim() || "UTC";

  const maxSessionDuration = parseInt(input.maxSessionDuration, 10);
  if (isNaN(maxSessionDuration) || maxSessionDuration <= 0) {
    return { error: "Max session duration must be a positive number" };
  }

  const breakMinutes = parseInt(input.breakMinutes, 10);
  if (isNaN(breakMinutes) || breakMinutes < 0) {
    return { error: "Break must be zero or a positive number" };
  }

  const slotIncrementMinutes = parseInt(input.slotIncrementMinutes, 10);
  if (!isValidSlotIncrement(slotIncrementMinutes)) {
    return {
      error: `Slot increment must be one of ${SLOT_INCREMENT_OPTIONS.join(", ")} minutes`,
    };
  }

  const icon = input.icon?.trim() || undefined;
  if (icon && !isEventIconName(icon)) {
    return { error: "Unknown icon" };
  }

  return {
    data: {
      name,
      description: input.description.trim(),
      website: input.website.trim(),
      start,
      end,
      timezone,
      maxSessionDuration,
      breakMinutes,
      slotIncrementMinutes,
      rsvpCapacityHardLimit: input.rsvpCapacityHardLimit ?? false,
      icon,
    },
  };
}

// A new increment only works if every day window and every scheduled session
// still falls on slot boundaries; otherwise sessions would silently drop out
// of the schedule grid. The admin must fix the misaligned data first.
async function slotIncrementChangeError(
  eventId: string,
  incrementMinutes: number
): Promise<string | null> {
  const repos = getRepositories();
  const days = await repos.days.listByEvent(eventId);
  const dayAligned = (d: (typeof days)[number]) =>
    isSlotAligned(d.end, d.start, incrementMinutes) &&
    isSlotAligned(d.startBookings, d.start, incrementMinutes) &&
    isSlotAligned(d.endBookings, d.start, incrementMinutes);
  if (!days.every(dayAligned)) {
    return `Cannot change the slot increment: some day windows are not aligned to ${incrementMinutes}-minute slots. Adjust the days first.`;
  }

  const sessions = await repos.sessions.listScheduledByEvent(eventId);
  const misaligned = sessions.filter((s) => {
    const day = days.find((d) => sessionOverlapsWindow(s, d.start, d.end));
    if (!day || !s.startTime || !s.endTime) return false;
    return (
      !isSlotAligned(s.startTime, day.start, incrementMinutes) ||
      !isSlotAligned(s.endTime, day.start, incrementMinutes)
    );
  });
  if (misaligned.length > 0) {
    const titles = misaligned.map((s) => `"${s.title}"`).join(", ");
    return `Cannot change the slot increment: ${titles} would not align to ${incrementMinutes}-minute slots. Reschedule or delete ${
      misaligned.length === 1 ? "it" : "them"
    } first.`;
  }
  return null;
}

export async function createEventAction(
  input: EventInput
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const parsed = parseEventInput(input);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const { events } = getRepositories();
  const slug = eventNameToSlug(parsed.data.name);
  if (!slug) {
    return { ok: false, error: "Name must contain a letter or number" };
  }
  if (RESERVED_EVENT_SLUGS.has(slug.toLowerCase())) {
    return {
      ok: false,
      error: `"${slug}" is a reserved URL and cannot be used as an event name`,
    };
  }
  const existing = await events.findBySlug(slug);
  if (existing) {
    return {
      ok: false,
      error: `An event with the URL "${slug}" already exists ("${existing.name}")`,
    };
  }

  try {
    await events.create(parsed.data);
  } catch (e) {
    // A concurrent create can win the race between the findBySlug check
    // above and this insert; translate the constraint violation into the
    // same friendly error instead of surfacing a 500.
    if (
      e instanceof Error &&
      e.message.includes("UNIQUE constraint failed: events.slug")
    ) {
      return {
        ok: false,
        error: `An event with the URL "${slug}" already exists`,
      };
    }
    throw e;
  }
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  return { ok: true };
}

export async function updateEventAction(
  input: EventInput & { id: string }
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const parsed = parseEventInput(input);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const existing = await getRepositories().events.findById(input.id);
  if (!existing) return { ok: false, error: "Event not found" };

  if (parsed.data.slotIncrementMinutes !== existing.slotIncrementMinutes) {
    const error = await slotIncrementChangeError(
      input.id,
      parsed.data.slotIncrementMinutes
    );
    if (error) return { ok: false, error };
  }

  const updated = await getRepositories().events.update(input.id, parsed.data);
  if (!updated) return { ok: false, error: "Event not found" };

  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${input.id}`);
  return { ok: true };
}

export type EventPhasesInput = {
  id: string;
  proposalPhaseStart?: string;
  proposalPhaseEnd?: string;
  votingPhaseStart?: string;
  votingPhaseEnd?: string;
  schedulingPhaseStart?: string;
  schedulingPhaseEnd?: string;
};

function parseDateTime(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  // datetime-local input gives "YYYY-MM-DDTHH:mm" without timezone; treat as UTC
  const d = new Date(value + "Z");
  return isNaN(d.getTime()) ? undefined : d;
}

type ParsedPhaseDates = {
  proposalPhaseStart: Date | undefined;
  proposalPhaseEnd: Date | undefined;
  votingPhaseStart: Date | undefined;
  votingPhaseEnd: Date | undefined;
  schedulingPhaseStart: Date | undefined;
  schedulingPhaseEnd: Date | undefined;
};

function validatePhasesInput(
  input: EventPhasesInput
): string | ParsedPhaseDates {
  const fieldDefs: [keyof Omit<EventPhasesInput, "id">, string][] = [
    ["proposalPhaseStart", "proposal phase start"],
    ["proposalPhaseEnd", "proposal phase end"],
    ["votingPhaseStart", "voting phase start"],
    ["votingPhaseEnd", "voting phase end"],
    ["schedulingPhaseStart", "scheduling phase start"],
    ["schedulingPhaseEnd", "scheduling phase end"],
  ];

  const parsed: Partial<ParsedPhaseDates> = {};
  for (const [field, label] of fieldDefs) {
    const raw = input[field]?.trim();
    if (raw) {
      const d = parseDateTime(raw);
      if (d === undefined) return `Invalid ${label}`;
      parsed[field] = d;
    } else {
      parsed[field] = undefined;
    }
  }

  const {
    proposalPhaseStart: pStart,
    proposalPhaseEnd: pEnd,
    votingPhaseStart: vStart,
    votingPhaseEnd: vEnd,
    schedulingPhaseStart: sStart,
    schedulingPhaseEnd: sEnd,
  } = parsed as ParsedPhaseDates;

  if (pStart && pEnd && pEnd <= pStart) {
    return "Proposal phase end must be after its start";
  }
  if (vStart && vEnd && vEnd <= vStart) {
    return "Voting phase end must be after its start";
  }
  if (sStart && sEnd && sEnd <= sStart) {
    return "Scheduling phase end must be after its start";
  }
  if (pEnd && vStart && vStart < pEnd) {
    return "Voting phase must not start before proposal phase ends";
  }
  if (vEnd && sStart && sStart < vEnd) {
    return "Scheduling phase must not start before voting phase ends";
  }
  // A phase without an explicit end implicitly ends when the next phase starts,
  // so the starts themselves must stay in order.
  if (pStart && vStart && vStart < pStart) {
    return "Voting phase must not start before proposal phase starts";
  }
  if (vStart && sStart && sStart < vStart) {
    return "Scheduling phase must not start before voting phase starts";
  }
  // When voting is unset, the checks above leave scheduling unconstrained
  // relative to the proposal phase. Constrain it directly so scheduling can
  // never start before the proposal phase starts or ends.
  if (pStart && sStart && sStart < pStart) {
    return "Scheduling phase must not start before proposal phase starts";
  }
  if (pEnd && sStart && sStart < pEnd) {
    return "Scheduling phase must not start before proposal phase ends";
  }
  return parsed as ParsedPhaseDates;
}

export async function updateEventPhasesAction(
  input: EventPhasesInput
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const result = validatePhasesInput(input);
  if (typeof result === "string") {
    return { ok: false, error: result };
  }

  const updated = await getRepositories().events.update(input.id, result);
  if (!updated) return { ok: false, error: "Event not found" };

  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${input.id}`);
  return { ok: true };
}

export async function deleteEventAction(input: {
  id: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { events } = getRepositories();
  const event = await events.findById(input.id);
  if (!event) return { ok: false, error: "Event not found" };

  await events.delete(input.id);
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  return { ok: true };
}
