import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: () => undefined,
    }),
}));

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createDay,
  createProposal as createProposalFixture,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { VoteChoice } from "@/db/repositories/interfaces";
import type { SessionParams } from "@/app/api/session-form-utils";
import { POST as addVote } from "@/app/api/add-vote/route";
import { POST as addSession } from "@/app/api/add-session/route";
import { POST as toggleRsvp } from "@/app/api/toggle-rsvp/route";
import { createProposal } from "@/app/(site)/[eventSlug]/proposals/actions";

// Server-side phase gating mirrors the UI: voting only during the voting
// phase, session creation only during the scheduling phase, and proposal
// creation during the proposal *and* voting phases (the UI's "Add Proposal"
// button is disabled only once scheduling starts).

function makeReq(url: string, payload: unknown): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function voteOnProposalIn(phase: "proposal" | "voting" | "scheduling") {
  const event = await createEvent({ phase });
  const guest = await createGuest({ eventId: event.id });
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
  const guest = await createGuest({ eventId: event.id });
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

async function toggleRsvpIn(
  phase: "proposal" | "voting",
  opts?: { remove?: boolean }
) {
  const event = await createEvent({ phase });
  const guest = await createGuest({ eventId: event.id });
  const session = await createSession(event.id);
  const repos = getRepositories();
  if (opts?.remove) {
    await repos.rsvps.create({ sessionId: session.id, guestId: guest.id });
  }
  const res = await toggleRsvp(
    makeReq("http://test/api/toggle-rsvp", {
      sessionId: session.id,
      guestId: guest.id,
      remove: opts?.remove,
    })
  );
  const rsvps = await repos.rsvps.listBySession(session.id);
  return { res, rsvps };
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

  it("rejects RSVP creation during the proposal phase", async () => {
    const { res, rsvps } = await toggleRsvpIn("proposal");
    expect(res.status).toBe(403);
    expect(rsvps).toHaveLength(0);
  });

  it("rejects RSVP creation during the voting phase", async () => {
    const { res, rsvps } = await toggleRsvpIn("voting");
    expect(res.status).toBe(403);
    expect(rsvps).toHaveLength(0);
  });

  it("rejects RSVP removal outside the scheduling phase", async () => {
    const { res, rsvps } = await toggleRsvpIn("voting", { remove: true });
    expect(res.status).toBe(403);
    expect(rsvps).toHaveLength(1);
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
