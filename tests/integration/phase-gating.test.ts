import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createDay,
  createProposal as createProposalFixture,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { VoteChoice } from "@/db/repositories/interfaces";
import type { SessionParams } from "@/app/api/session-form-utils";
import { POST as addVote } from "@/app/api/add-vote/route";
import { POST as addSession } from "@/app/api/add-session/route";
import { createProposal } from "@/app/(site)/[eventSlug]/proposals/actions";

// FINDING: the server does not enforce event phases at all — phase gating is
// UI-only. The `.fails` tests below assert the *correct* behavior (rejection
// outside the right phase) and are marked `.fails` because the server
// currently accepts the request. When server-side gating lands, these tests
// will start "passing" and Vitest will flag them — remove `.fails` then. Do
// NOT rewrite the assertions to match the current, broken behavior.
//
// The "allows ..." tests document the flip side: the request already
// succeeds in the right phase today, and must keep succeeding once gating is
// added.

function makeReq(url: string, payload: unknown): Request {
  return new Request(url, { method: "POST", body: JSON.stringify(payload) });
}

async function voteOnProposalIn(phase: "proposal" | "voting" | "scheduling") {
  const event = await createEvent({ phase });
  const guest = await createGuest();
  const proposal = await createProposalFixture(event.id, []);

  const res = await addVote(
    makeReq("http://test/api/add-vote", {
      proposalId: proposal.id,
      guestId: guest.id,
      choice: VoteChoice.interested,
    })
  );
  const votes = await getRepositories().votes.listByGuestAndEvent(
    guest.id,
    event.id
  );
  return { res, votes };
}

async function addSessionIn(phase: "proposal" | "voting" | "scheduling") {
  const event = await createEvent({ phase });
  const guest = await createGuest();
  const location = await createLocation();
  const day = await createDay(event.id);

  const payload: SessionParams = {
    title: "Premature Session",
    description: "",
    closed: false,
    hosts: [guest],
    location,
    day,
    startTimeMinutes: 10 * 60,
    duration: 60,
    timezone: "UTC",
  };
  const res = await addSession(makeReq("http://test/api/add-session", payload));
  const sessions = await getRepositories().sessions.listByEvent(event.id);
  return { res, sessions };
}

async function proposeIn(phase: "proposal" | "voting" | "scheduling") {
  const event = await createEvent({ phase });
  const fd = new FormData();
  fd.set("event", event.id);
  fd.set("eventSlug", "test-event");
  fd.set("title", "Late Proposal");
  const result = await createProposal(fd);
  const proposals = await getRepositories().sessionProposals.listByEvent(
    event.id
  );
  return { result, proposals };
}

describe("server-side phase gating", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it.fails("rejects voting during the proposal phase", async () => {
    const { res, votes } = await voteOnProposalIn("proposal");
    expect(res.ok).toBe(false);
    expect(votes).toHaveLength(0);
  });

  it.fails("rejects voting during the scheduling phase", async () => {
    const { res, votes } = await voteOnProposalIn("scheduling");
    expect(res.ok).toBe(false);
    expect(votes).toHaveLength(0);
  });

  it.fails("rejects session creation during the proposal phase", async () => {
    const { res, sessions } = await addSessionIn("proposal");
    expect(res.ok).toBe(false);
    expect(sessions).toHaveLength(0);
  });

  it.fails("rejects session creation during the voting phase", async () => {
    const { res, sessions } = await addSessionIn("voting");
    expect(res.ok).toBe(false);
    expect(sessions).toHaveLength(0);
  });

  it.fails("rejects proposal creation during the voting phase", async () => {
    const { result, proposals } = await proposeIn("voting");
    expect(result).toHaveProperty("error");
    expect(proposals).toHaveLength(0);
  });

  it.fails(
    "rejects proposal creation during the scheduling phase",
    async () => {
      const { result, proposals } = await proposeIn("scheduling");
      expect(result).toHaveProperty("error");
      expect(proposals).toHaveLength(0);
    }
  );

  it("allows voting during the voting phase", async () => {
    const { res, votes } = await voteOnProposalIn("voting");
    expect(res.ok).toBe(true);
    expect(votes).toHaveLength(1);
  });

  it("allows session creation during the scheduling phase", async () => {
    const { res, sessions } = await addSessionIn("scheduling");
    expect(res.ok).toBe(true);
    expect(sessions).toHaveLength(1);
  });

  it("allows proposal creation during the proposal phase", async () => {
    const { result, proposals } = await proposeIn("proposal");
    expect(result).toEqual({ success: true });
    expect(proposals).toHaveLength(1);
  });
});
