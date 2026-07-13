import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createProposal } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { VoteChoice, type Vote } from "@/db/repositories/interfaces";
import { POST as addVote } from "@/app/api/add-vote/route";
import { POST as deleteVote } from "@/app/api/delete-vote/route";
import { GET as getVotes } from "@/app/api/votes/route";

function makeAddReq(payload: unknown): Request {
  return new Request("http://test/api/add-vote", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function makeDeleteReq(payload: unknown): Request {
  return new Request("http://test/api/delete-vote", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Read surface: GET /api/votes?user=<guestId>&event=<eventSlug>
async function votesFor(guestId: string, eventSlug: string): Promise<Vote[]> {
  const res = await getVotes(
    new NextRequest(
      `http://test/api/votes?user=${guestId}&event=${encodeURIComponent(eventSlug)}`
    )
  );
  expect(res.ok).toBe(true);
  return (await res.json()) as Vote[];
}

describe("voting API", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("add-vote creates a vote visible via GET /api/votes", async () => {
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const guest = await createGuest({ eventId: event.id });
    const proposal = await createProposal(event.id, []);

    const res = await addVote(
      makeAddReq({
        proposalId: proposal.id,
        guestId: guest.id,
        choice: VoteChoice.interested,
      })
    );
    expect(res.ok).toBe(true);

    const votes = await votesFor(guest.id, "Vote-Event");
    expect(votes).toHaveLength(1);
    expect(votes[0]).toMatchObject({
      proposalId: proposal.id,
      guestId: guest.id,
      choice: VoteChoice.interested,
    });
  });

  it("rejects a voter who is not part of the event", async () => {
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const outsider = await createGuest(); // not assigned to the event
    const proposal = await createProposal(event.id, []);

    const res = await addVote(
      makeAddReq({
        proposalId: proposal.id,
        guestId: outsider.id,
        choice: VoteChoice.interested,
      })
    );
    expect(res.status).toBe(403);
    expect(await votesFor(outsider.id, "Vote-Event")).toHaveLength(0);
  });

  it("repeated add-vote for the same (guest, proposal) replaces instead of duplicating", async () => {
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const guest = await createGuest({ eventId: event.id });
    const proposal = await createProposal(event.id, []);

    for (const choice of [
      VoteChoice.interested,
      VoteChoice.maybe,
      VoteChoice.skip,
    ]) {
      const res = await addVote(
        makeAddReq({ proposalId: proposal.id, guestId: guest.id, choice })
      );
      expect(res.ok).toBe(true);
    }

    const votes = await votesFor(guest.id, "Vote-Event");
    expect(votes).toHaveLength(1);
    expect(votes[0].choice).toBe(VoteChoice.skip);
  });

  it("database rejects duplicate votes for the same (guest, proposal)", async () => {
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const guest = await createGuest({ eventId: event.id });
    const proposal = await createProposal(event.id, []);
    const repos = getRepositories();

    await repos.votes.create({
      proposalId: proposal.id,
      guestId: guest.id,
      choice: VoteChoice.interested,
    });
    await expect(
      repos.votes.create({
        proposalId: proposal.id,
        guestId: guest.id,
        choice: VoteChoice.maybe,
      })
    ).rejects.toThrow(/unique/i);
  });

  it("upsert atomically replaces an existing vote", async () => {
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const guest = await createGuest({ eventId: event.id });
    const proposal = await createProposal(event.id, []);
    const repos = getRepositories();

    await repos.votes.upsert({
      proposalId: proposal.id,
      guestId: guest.id,
      choice: VoteChoice.interested,
    });
    await repos.votes.upsert({
      proposalId: proposal.id,
      guestId: guest.id,
      choice: VoteChoice.maybe,
    });

    const votes = await votesFor(guest.id, "Vote-Event");
    expect(votes).toHaveLength(1);
    expect(votes[0].choice).toBe(VoteChoice.maybe);
  });

  it("delete-vote removes only the deleting guest's vote", async () => {
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const alice = await createGuest({ name: "Alice", eventId: event.id });
    const bob = await createGuest({ name: "Bob", eventId: event.id });
    const proposal = await createProposal(event.id, []);

    for (const guest of [alice, bob]) {
      await addVote(
        makeAddReq({
          proposalId: proposal.id,
          guestId: guest.id,
          choice: VoteChoice.interested,
        })
      );
    }

    const res = await deleteVote(
      makeDeleteReq({ guestId: alice.id, proposalId: proposal.id })
    );
    expect(res.ok).toBe(true);

    expect(await votesFor(alice.id, "Vote-Event")).toHaveLength(0);
    expect(await votesFor(bob.id, "Vote-Event")).toHaveLength(1);
  });

  it("delete-vote is rejected outside the voting phase", async () => {
    // Create the vote while voting is open...
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const guest = await createGuest({ eventId: event.id });
    const proposal = await createProposal(event.id, []);
    await addVote(
      makeAddReq({
        proposalId: proposal.id,
        guestId: guest.id,
        choice: VoteChoice.interested,
      })
    );

    // ...then move the event into the scheduling phase so voting is over.
    const now = new Date();
    const DAY_MS = 24 * 60 * 60 * 1000;
    await getRepositories().events.update(event.id, {
      votingPhaseStart: new Date(now.getTime() - 14 * DAY_MS),
      votingPhaseEnd: new Date(now.getTime() - 7 * DAY_MS),
      schedulingPhaseStart: new Date(now.getTime() - 7 * DAY_MS),
      schedulingPhaseEnd: new Date(now.getTime() + 7 * DAY_MS),
    });

    const res = await deleteVote(
      makeDeleteReq({ guestId: guest.id, proposalId: proposal.id })
    );
    expect(res.status).toBe(403);
    // The vote must still be there.
    expect(await votesFor(guest.id, "Vote-Event")).toHaveLength(1);
  });

  it("delete-vote returns 404 for a missing proposal", async () => {
    // Membership is never reached: the missing proposal short-circuits first.
    const orphan = await createGuest();
    const res = await deleteVote(
      makeDeleteReq({ guestId: orphan.id, proposalId: "does-not-exist" })
    );
    expect(res.status).toBe(404);
  });

  it("GET /api/votes scopes votes to the given guest and event", async () => {
    const eventA = await createEvent({ name: "Event A", phase: "voting" });
    const eventB = await createEvent({ name: "Event B", phase: "voting" });
    const guest = await createGuest({ eventId: eventA.id });
    await getRepositories().guests.assignToEvent(eventB.id, [guest.id]);
    const proposalA = await createProposal(eventA.id, []);
    const proposalB = await createProposal(eventB.id, []);

    await addVote(
      makeAddReq({
        proposalId: proposalA.id,
        guestId: guest.id,
        choice: VoteChoice.interested,
      })
    );
    await addVote(
      makeAddReq({
        proposalId: proposalB.id,
        guestId: guest.id,
        choice: VoteChoice.maybe,
      })
    );

    const votesA = await votesFor(guest.id, "Event-A");
    expect(votesA).toHaveLength(1);
    expect(votesA[0].proposalId).toBe(proposalA.id);
  });

  it("GET /api/votes finds events whose name contains hyphens", async () => {
    const event = await createEvent({
      name: "Vote-Event 2026",
      phase: "voting",
    });
    const guest = await createGuest({ eventId: event.id });
    const proposal = await createProposal(event.id, []);

    await addVote(
      makeAddReq({
        proposalId: proposal.id,
        guestId: guest.id,
        choice: VoteChoice.interested,
      })
    );

    const votes = await votesFor(guest.id, "Vote-Event-2026");
    expect(votes).toHaveLength(1);
  });

  it("GET /api/votes requires user and event and rejects unknown events", async () => {
    const missingParams = await getVotes(
      new NextRequest("http://test/api/votes?user=someone")
    );
    expect(missingParams.status).toBe(400);

    const unknownEvent = await getVotes(
      new NextRequest("http://test/api/votes?user=someone&event=No%20Such")
    );
    expect(unknownEvent.status).toBe(404);
  });

  it("proposal tallies reflect mixed interested/maybe/skip votes", async () => {
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const guests = await Promise.all([
      createGuest({ name: "G1", eventId: event.id }),
      createGuest({ name: "G2", eventId: event.id }),
      createGuest({ name: "G3", eventId: event.id }),
      createGuest({ name: "G4", eventId: event.id }),
    ]);
    const proposal = await createProposal(event.id, []);
    const other = await createProposal(event.id, []);

    const choices = [
      VoteChoice.interested,
      VoteChoice.interested,
      VoteChoice.maybe,
      VoteChoice.skip,
    ];
    for (let i = 0; i < guests.length; i++) {
      await addVote(
        makeAddReq({
          proposalId: proposal.id,
          guestId: guests[i].id,
          choice: choices[i],
        })
      );
    }

    const proposals = await getRepositories().sessionProposals.listByEvent(
      event.id
    );
    const tallied = proposals.find((p) => p.id === proposal.id)!;
    // votesCount counts every vote, including skips
    expect(tallied.votesCount).toBe(4);
    expect(tallied.interestedVotesCount).toBe(2);
    expect(tallied.maybeVotesCount).toBe(1);

    const untouched = proposals.find((p) => p.id === other.id)!;
    expect(untouched.votesCount).toBe(0);
  });
});
