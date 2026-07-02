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

export type AdminProposalInput = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number | null;
  hostIds: string[];
};

function revalidateEventPaths(eventId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
}

export async function adminUpdateProposalAction(
  input: AdminProposalInput
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required" };

  if (
    input.durationMinutes !== null &&
    (!Number.isInteger(input.durationMinutes) ||
      !Number.isFinite(input.durationMinutes) ||
      input.durationMinutes < 0)
  ) {
    return { ok: false, error: "Duration must be a non-negative integer" };
  }

  const hostIds = [...new Set(input.hostIds.filter(Boolean))];

  const { sessionProposals, guests } = getRepositories();
  const proposal = await sessionProposals.findById(input.id);
  if (!proposal) return { ok: false, error: "Proposal not found" };

  for (const guestId of hostIds) {
    if (!(await guests.findById(guestId))) {
      return { ok: false, error: `Guest not found: ${guestId}` };
    }
  }

  await sessionProposals.update(input.id, {
    title,
    description: input.description.trim(),
    durationMinutes: input.durationMinutes,
    hostIds,
  });

  revalidateEventPaths(proposal.eventId);
  return { ok: true };
}

export async function adminDeleteProposalAction(input: {
  id: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { sessionProposals } = getRepositories();
  const proposal = await sessionProposals.findById(input.id);
  if (!proposal) return { ok: false, error: "Proposal not found" };

  try {
    await sessionProposals.delete(input.id);
  } catch {
    return { ok: false, error: "Failed to delete proposal" };
  }

  revalidateEventPaths(proposal.eventId);
  return { ok: true };
}
