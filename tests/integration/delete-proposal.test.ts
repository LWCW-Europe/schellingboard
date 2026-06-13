import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createProposal,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { VoteChoice } from "@/db/repositories/interfaces";
import { deleteProposal } from "@/app/(site)/[eventSlug]/proposals/actions";

describe("deleteProposal", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => resetTestDb());

  it("cascade-deletes votes and host links and nulls the session's proposalId, leaving other data intact", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    const host = await createGuest({ name: "Host" });
    const voter = await createGuest({ name: "Voter" });

    const proposal = await createProposal(event.id, [host.id]);
    const otherProposal = await createProposal(event.id, [host.id]);

    await repos.votes.create({
      proposalId: proposal.id,
      guestId: voter.id,
      choice: VoteChoice.interested,
    });
    await repos.votes.create({
      proposalId: otherProposal.id,
      guestId: voter.id,
      choice: VoteChoice.maybe,
    });

    const session = await createSession(event.id, { hostIds: [host.id] });
    await repos.sessions.update(session.id, { proposalId: proposal.id });

    const result = await deleteProposal(proposal.id, "test-event");
    expect(result).toEqual({ success: true });

    expect(await repos.sessionProposals.findById(proposal.id)).toBeUndefined();

    // The voter's vote for the deleted proposal is gone, the other remains.
    const votesAfter = await repos.votes.listByGuestAndEvent(
      voter.id,
      event.id
    );
    expect(votesAfter.map((v) => v.proposalId)).toEqual([otherProposal.id]);

    // The session survives but no longer references the deleted proposal.
    const sessionAfter = await repos.sessions.findById(session.id);
    expect(sessionAfter).toBeDefined();
    expect(sessionAfter?.proposalId).toBeUndefined();

    // Host guest and the other proposal are untouched.
    expect(await repos.guests.findById(host.id)).toBeDefined();
    const otherAfter = await repos.sessionProposals.findById(otherProposal.id);
    expect(otherAfter?.hosts.map((h) => h.id)).toEqual([host.id]);
  });
});
