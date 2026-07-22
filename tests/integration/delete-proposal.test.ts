import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const cookieJar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => {
        const value = cookieJar.get(name);
        return value === undefined ? undefined : { name, value };
      },
    }),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createProposal,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import {
  GUEST_COOKIE_NAME,
  openGuestValue,
  verifiedGuestValue,
} from "../helpers/guest-cookie";
import { VoteChoice } from "@/db/repositories/interfaces";
import { deleteProposal } from "@/app/(site)/[eventSlug]/proposals/actions";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function protectGuest(guestId: string): Promise<void> {
  await getRepositories().guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: null,
  });
}

describe("deleteProposal", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });
  afterEach(() => vi.unstubAllEnvs());

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

    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(host.id));
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

  it("rejects a non-host attempting to delete", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    const host = await createGuest({ name: "Host" });
    const nonHost = await createGuest({ name: "NonHost" });
    const proposal = await createProposal(event.id, [host.id]);
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(nonHost.id));

    const result = await deleteProposal(proposal.id, "test-event");
    expect(result).toHaveProperty("error");

    expect(await repos.sessionProposals.findById(proposal.id)).toBeDefined();
  });

  it("rejects deleting with no acting guest at all", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    const host = await createGuest({ name: "Host" });
    const proposal = await createProposal(event.id, [host.id]);

    const result = await deleteProposal(proposal.id, "test-event");
    expect(result).toHaveProperty("error");

    expect(await repos.sessionProposals.findById(proposal.id)).toBeDefined();
  });

  it("allows anyone to delete a hostless proposal", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    const proposal = await createProposal(event.id, []);

    const result = await deleteProposal(proposal.id, "test-event");
    expect(result).toEqual({ success: true });

    expect(await repos.sessionProposals.findById(proposal.id)).toBeUndefined();
  });

  it("rejects a protected host without a verified session", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    const host = await createGuest({ name: "Host" });
    await protectGuest(host.id);
    const proposal = await createProposal(event.id, [host.id]);
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(host.id));

    const result = await deleteProposal(proposal.id, "test-event");
    expect(result).toHaveProperty("error");

    expect(await repos.sessionProposals.findById(proposal.id)).toBeDefined();
  });

  it("accepts a protected host with a verified session", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    const host = await createGuest({ name: "Host" });
    await protectGuest(host.id);
    const proposal = await createProposal(event.id, [host.id]);
    cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(host.id));

    const result = await deleteProposal(proposal.id, "test-event");
    expect(result).toEqual({ success: true });

    expect(await repos.sessionProposals.findById(proposal.id)).toBeUndefined();
  });
});
