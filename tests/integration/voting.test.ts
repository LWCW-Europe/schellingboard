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

// Read surface: GET /api/votes?user=<guestId>&event=<eventName>
async function votesFor(guestId: string, eventName: string): Promise<Vote[]> {
  const res = await getVotes(
    new NextRequest(
      `http://test/api/votes?user=${guestId}&event=${encodeURIComponent(eventName)}`
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
    const guest = await createGuest();
    const proposal = await createProposal(event.id, []);

    const res = await addVote(
      makeAddReq({
        proposalId: proposal.id,
        guestId: guest.id,
        choice: VoteChoice.interested,
      })
    );
    expect(res.ok).toBe(true);

    const votes = await votesFor(guest.id, "Vote Event");
    expect(votes).toHaveLength(1);
    expect(votes[0]).toMatchObject({
      proposalId: proposal.id,
      guestId: guest.id,
      choice: VoteChoice.interested,
    });
  });

  it("repeated add-vote for the same (guest, proposal) replaces instead of duplicating", async () => {
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const guest = await createGuest();
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

    const votes = await votesFor(guest.id, "Vote Event");
    expect(votes).toHaveLength(1);
    expect(votes[0].choice).toBe(VoteChoice.skip);
  });

  it("database rejects duplicate votes for the same (guest, proposal)", async () => {
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const guest = await createGuest();
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
    const guest = await createGuest();
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

    const votes = await votesFor(guest.id, "Vote Event");
    expect(votes).toHaveLength(1);
    expect(votes[0].choice).toBe(VoteChoice.maybe);
  });

  it("delete-vote removes only the deleting guest's vote", async () => {
    const event = await createEvent({ name: "Vote Event", phase: "voting" });
    const alice = await createGuest({ name: "Alice" });
    const bob = await createGuest({ name: "Bob" });
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

    expect(await votesFor(alice.id, "Vote Event")).toHaveLength(0);
    expect(await votesFor(bob.id, "Vote Event")).toHaveLength(1);
  });

  it("GET /api/votes scopes votes to the given guest and event", async () => {
    const eventA = await createEvent({ name: "Event A", phase: "voting" });
    const eventB = await createEvent({ name: "Event B", phase: "voting" });
    const guest = await createGuest();
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

    const votesA = await votesFor(guest.id, "Event A");
    expect(votesA).toHaveLength(1);
    expect(votesA[0].proposalId).toBe(proposalA.id);
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
      createGuest({ name: "G1" }),
      createGuest({ name: "G2" }),
      createGuest({ name: "G3" }),
      createGuest({ name: "G4" }),
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
