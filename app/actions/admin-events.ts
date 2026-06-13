"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import type { Event } from "@/db/repositories/interfaces";
import type { AdminActionResult } from "./admin-guests";

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
  icon?: string;
  proposalPhaseStart?: string;
  proposalPhaseEnd?: string;
  votingPhaseStart?: string;
  votingPhaseEnd?: string;
  schedulingPhaseStart?: string;
  schedulingPhaseEnd?: string;
};

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

type ParsedEvent = Omit<Event, "id">;
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
      icon: input.icon?.trim() || undefined,
      proposalPhaseStart: parseDate(input.proposalPhaseStart),
      proposalPhaseEnd: parseDate(input.proposalPhaseEnd),
      votingPhaseStart: parseDate(input.votingPhaseStart),
      votingPhaseEnd: parseDate(input.votingPhaseEnd),
      schedulingPhaseStart: parseDate(input.schedulingPhaseStart),
      schedulingPhaseEnd: parseDate(input.schedulingPhaseEnd),
    },
  };
}

export async function createEventAction(
  input: EventInput
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const parsed = parseEventInput(input);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  await getRepositories().events.create(parsed.data);
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
