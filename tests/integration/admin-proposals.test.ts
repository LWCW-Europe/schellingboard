import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

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
import { createAdminAuthCookie } from "@/utils/auth";
import {
  adminUpdateProposalAction,
  adminDeleteProposalAction,
} from "@/app/actions/admin-proposals";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("adminUpdateProposalAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("updates title, description, duration and hosts", async () => {
    const event = await createEvent();
    const h1 = await createGuest({ name: "Host One" });
    const h2 = await createGuest({ name: "Host Two" });
    const proposal = await createProposal(event.id, [h1.id], {
      title: "Old title",
    });

    const result = await adminUpdateProposalAction({
      id: proposal.id,
      title: "New title",
      description: "New description",
      durationMinutes: 60,
      hostIds: [h2.id],
    });
    expect(result.ok).toBe(true);

    const updated = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(updated?.title).toBe("New title");
    expect(updated?.description).toBe("New description");
    expect(updated?.durationMinutes).toBe(60);
    expect(updated?.hosts.map((h) => h.id)).toEqual([h2.id]);
  });

  it("clears duration when durationMinutes is null", async () => {
    const event = await createEvent();
    const h1 = await createGuest();
    const proposal = await createProposal(event.id, [h1.id], {
      durationMinutes: 30,
    });

    const result = await adminUpdateProposalAction({
      id: proposal.id,
      title: "Keeps title",
      description: "",
      durationMinutes: null,
      hostIds: [h1.id],
    });
    expect(result.ok).toBe(true);

    const updated = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(updated?.durationMinutes).toBeUndefined();
  });

  it("rejects an empty title", async () => {
    const event = await createEvent();
    const h1 = await createGuest();
    const proposal = await createProposal(event.id, [h1.id]);

    const result = await adminUpdateProposalAction({
      id: proposal.id,
      title: "   ",
      description: "",
      durationMinutes: null,
      hostIds: [h1.id],
    });
    expect(!result.ok && result.error).toBe("Title is required");
  });

  it("rejects when not authenticated", async () => {
    const event = await createEvent();
    const h1 = await createGuest();
    const proposal = await createProposal(event.id, [h1.id]);
    cookieJar.clear();

    const result = await adminUpdateProposalAction({
      id: proposal.id,
      title: "x",
      description: "",
      durationMinutes: null,
      hostIds: [h1.id],
    });
    expect(!result.ok && result.error).toBe("Unauthorized");
  });

  it("errors for an unknown proposal", async () => {
    const result = await adminUpdateProposalAction({
      id: "no-such-proposal",
      title: "x",
      description: "",
      durationMinutes: null,
      hostIds: [],
    });
    expect(!result.ok && result.error).toBe("Proposal not found");
  });
});

describe("adminDeleteProposalAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("deletes the proposal with its votes and host links, keeping derived sessions (unlinked)", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    const host = await createGuest({ name: "Host" });
    const voter = await createGuest({ name: "Voter" });
    const proposal = await createProposal(event.id, [host.id]);
    await repos.votes.create({
      proposalId: proposal.id,
      guestId: voter.id,
      choice: VoteChoice.interested,
    });
    const session = await createSession(event.id, { hostIds: [host.id] });
    await repos.sessions.update(session.id, { proposalId: proposal.id });

    const result = await adminDeleteProposalAction({ id: proposal.id });
    expect(result.ok).toBe(true);

    expect(await repos.sessionProposals.findById(proposal.id)).toBeUndefined();
    expect(
      await repos.votes.listByGuestAndEvent(voter.id, event.id)
    ).toHaveLength(0);
    const sessionAfter = await repos.sessions.findById(session.id);
    expect(sessionAfter).toBeDefined();
    expect(sessionAfter?.proposalId).toBeUndefined();
  });

  it("rejects when not authenticated", async () => {
    const event = await createEvent();
    const proposal = await createProposal(event.id, []);
    cookieJar.clear();

    const result = await adminDeleteProposalAction({ id: proposal.id });
    expect(!result.ok && result.error).toBe("Unauthorized");
  });

  it("errors for an unknown proposal", async () => {
    const result = await adminDeleteProposalAction({ id: "no-such-proposal" });
    expect(!result.ok && result.error).toBe("Proposal not found");
  });
});
