"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { inSchedPhase } from "@/app/(site)/utils/events";
import { z } from "zod";
import {
  sessionProposalSchema,
  sessionProposalUpdateSchema,
} from "@/model/session";
import { serverNow } from "@/utils/dev-clock-server";
import {
  actingUserIsVerified,
  NAME_PROTECTED_ERROR,
  verifiedCurrentUser,
} from "@/utils/acting-guest";

export async function createProposal(
  sessionProposal: z.input<typeof sessionProposalSchema>
): Promise<{ error: string | z.core.$ZodIssue[] } | { success: true }>;
export async function createProposal(
  input: unknown
): Promise<{ error: string | z.core.$ZodIssue[] } | { success: true }> {
  if (!(await actingUserIsVerified(await cookies()))) {
    return { error: NAME_PROTECTED_ERROR };
  }

  const parseResult = await sessionProposalSchema.safeParseAsync(input);
  if (!parseResult.success) {
    return { error: parseResult.error.issues };
  }

  const {
    data: { eventId, eventSlug, title, description, hostIds, durationMinutes },
  } = parseResult;

  try {
    // Mirrors the UI: proposals may be added during the proposal and voting
    // phases; once scheduling starts they are closed.
    const event = await getRepositories().events.findById(eventId);
    if (!event || inSchedPhase(event, await serverNow())) {
      return { error: "The proposal phase is over" };
    }

    const eventGuestIds = new Set(
      (await getRepositories().guests.listByEvent(eventId)).map((g) => g.id)
    );
    if (!hostIds.every((id) => eventGuestIds.has(id))) {
      return {
        error: [
          {
            code: "custom",
            path: ["hostIds"],
            message: "A host is not part of this event",
            input: hostIds,
          },
        ],
      };
    }

    await getRepositories().sessionProposals.create({
      eventId,
      title,
      description: description || undefined,
      hostIds,
      durationMinutes,
    });
    revalidatePath(`/${eventSlug}/proposals`);
  } catch (error) {
    console.error("Error creating proposal:", error);
    return { error: "Failed to create proposal" };
  }
  return { success: true };
}

// Unlike createProposal, this intentionally has no event/phase check: the
// UI's canEdit() gates editing by ownership only (host or unclaimed
// proposal), not by phase, so hosts can still fix up or withdraw their own
// proposal after scheduling starts. Adding a phase gate here would make the
// server reject an action the UI still offers.
export async function updateProposal(
  id: string,
  sessionProposal: z.input<typeof sessionProposalUpdateSchema>
): Promise<{ error: string | z.core.$ZodIssue[] } | { success: true }>;
export async function updateProposal(
  id: string,
  input: unknown
): Promise<{ error: string | z.core.$ZodIssue[] } | { success: true }> {
  const parseResult = await sessionProposalUpdateSchema.safeParseAsync(input);
  if (!parseResult.success) {
    return { error: parseResult.error.issues };
  }

  const {
    data: { eventSlug, title, description, hostIds, durationMinutes },
  } = parseResult;

  try {
    const proposal = await getRepositories().sessionProposals.findById(id);
    if (!proposal) {
      return { error: "Proposal not found" };
    }

    if (proposal.hosts.length > 0) {
      const actor = await verifiedCurrentUser(await cookies());
      if (!actor || !proposal.hosts.some((h) => h.id === actor)) {
        return {
          error:
            "Only a host may edit this proposal — switch to your name first",
        };
      }
    }

    const eventGuestIds = new Set(
      (await getRepositories().guests.listByEvent(proposal.eventId)).map(
        (g) => g.id
      )
    );
    if (!hostIds.every((hostId) => eventGuestIds.has(hostId))) {
      return {
        error: [
          {
            code: "custom",
            path: ["hostIds"],
            message: "A host is not part of this event",
            input: hostIds,
          },
        ],
      };
    }

    // The repository clears durationMinutes only when the key is present, and
    // zod drops absent optional keys, so it has to be spelled out here for
    // "no duration selected" to actually clear a previously chosen one.
    await getRepositories().sessionProposals.update(id, {
      title,
      description: description || undefined,
      hostIds,
      durationMinutes,
    });
    revalidatePath(`/${eventSlug}/proposals`);
  } catch (error) {
    console.error("Error updating proposal:", error);
    return { error: "Failed to update proposal" };
  }
  return { success: true };
}

// Same reasoning as updateProposal: no phase gate, so a host can withdraw
// their proposal in any phase, including scheduling.
export async function deleteProposal(id: string, eventSlug: string) {
  try {
    const proposal = await getRepositories().sessionProposals.findById(id);
    if (!proposal) {
      return { error: "Proposal not found" };
    }

    if (proposal.hosts.length > 0) {
      const actor = await verifiedCurrentUser(await cookies());
      if (!actor || !proposal.hosts.some((h) => h.id === actor)) {
        return {
          error:
            "Only a host may delete this proposal — switch to your name first",
        };
      }
    }

    await getRepositories().sessionProposals.delete(id);
    revalidatePath(`/${eventSlug}/proposals`);
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return { error: "Failed to delete proposal" };
  }
  return { success: true };
}
