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

// Server-side phase gating mirrors the UI: voting only during the voting
// phase, session creation only during the scheduling phase, and proposal
// creation during the proposal *and* voting phases (the UI's "Add Proposal"
// button is disabled only once scheduling starts).

function makeReq(url: string, payload: unknown): Request {
  return new Request(url, { method: "POST", body: JSON.stringify(payload) });
}

async function voteOnProposalIn(phase: "proposal" | "scheduling") {
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

async function addSessionIn(phase: "proposal" | "voting") {
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

async function proposeIn(phase: "voting" | "scheduling") {
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

  it("rejects voting during the proposal phase", async () => {
    const { res, votes } = await voteOnProposalIn("proposal");
    expect(res.ok).toBe(false);
    expect(votes).toHaveLength(0);
  });

  it("rejects voting during the scheduling phase", async () => {
    const { res, votes } = await voteOnProposalIn("scheduling");
    expect(res.ok).toBe(false);
    expect(votes).toHaveLength(0);
  });

  it("rejects session creation during the proposal phase", async () => {
    const { res, sessions } = await addSessionIn("proposal");
    expect(res.ok).toBe(false);
    expect(sessions).toHaveLength(0);
  });

  it("rejects session creation during the voting phase", async () => {
    const { res, sessions } = await addSessionIn("voting");
    expect(res.ok).toBe(false);
    expect(sessions).toHaveLength(0);
  });

  // The UI allows adding proposals during the voting phase (only scheduling
  // disables it), so the server accepts them too.
  it("allows proposal creation during the voting phase", async () => {
    const { result, proposals } = await proposeIn("voting");
    expect(result).toHaveProperty("success");
    expect(proposals).toHaveLength(1);
  });

  it("rejects proposal creation during the scheduling phase", async () => {
    const { result, proposals } = await proposeIn("scheduling");
    expect(result).toHaveProperty("error");
    expect(proposals).toHaveLength(0);
  });
});
