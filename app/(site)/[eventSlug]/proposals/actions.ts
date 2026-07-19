"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { inSchedPhase } from "@/app/(site)/utils/events";
import {
  actingUserIsVerified,
  NAME_PROTECTED_ERROR,
  verifiedCurrentUser,
} from "@/utils/acting-guest";

export async function createProposal(formData: FormData) {
  if (!(await actingUserIsVerified(await cookies()))) {
    return { error: NAME_PROTECTED_ERROR };
  }

  const eventId = formData.get("event") as string;
  const eventSlug = formData.get("eventSlug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const hostIds = formData.getAll("hosts") as string[];
  const durationMinutes =
    parseInt(formData.get("durationMinutes") as string) || undefined;

  if (!title) {
    return { error: "Title is required" };
  }

  if (!eventId) {
    return { error: "Event is required" };
  }

  try {
    // Mirrors the UI: proposals may be added during the proposal and voting
    // phases; once scheduling starts they are closed.
    const event = await getRepositories().events.findById(eventId);
    if (!event || inSchedPhase(event)) {
      return { error: "The proposal phase is over" };
    }

    const eventGuestIds = new Set(
      (await getRepositories().guests.listByEvent(eventId)).map((g) => g.id)
    );
    if (!hostIds.every((id) => eventGuestIds.has(id))) {
      return { error: "A host is not part of this event" };
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
export async function updateProposal(id: string, formData: FormData) {
  const eventSlug = formData.get("eventSlug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const hostIds = formData.getAll("hosts") as string[];
  const durationMinutesRaw = formData.get("durationMinutes") as string;
  const durationMinutes = durationMinutesRaw
    ? parseInt(durationMinutesRaw) || null
    : null;

  if (!title) {
    return { error: "Title is required" };
  }

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
      return { error: "A host is not part of this event" };
    }

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
