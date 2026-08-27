import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
}));

const { afterTasks } = vi.hoisted(() => ({
  afterTasks: [] as Promise<unknown>[],
}));

vi.mock("next/server", () => ({
  after: (task: () => unknown) => {
    afterTasks.push(Promise.resolve(task()));
  },
}));

async function flushAfter(): Promise<void> {
  await Promise.all(afterTasks);
}

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

import { resetTestDb, setupTestDb } from "../helpers/db";
import { createEvent, createGuest, createProposal } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import {
  GUEST_COOKIE_NAME,
  openGuestValue,
  verifiedGuestValue,
} from "../helpers/guest-cookie";
import {
  createProposalComment as createComment,
  deleteComment,
  updateComment,
} from "@/app/(site)/[eventSlug]/comment-actions";
import { sendMail } from "@/utils/mailer";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function setup() {
  const event = await createEvent({ phase: "voting" });
  const guest = await createGuest({ eventId: event.id });
  const proposal = await createProposal(event.id, []);
  return { event, guest, proposal };
}

function act(guestId: string): void {
  cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guestId));
}

describe("comments", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    vi.mocked(sendMail).mockReset();
    afterTasks.length = 0;
  });

  it("emails the proposal's host about a new comment", async () => {
    const event = await createEvent({ phase: "voting" });
    const host = await createGuest({
      eventId: event.id,
      email: "host@test.example",
    });
    const commenter = await createGuest({ eventId: event.id });
    const proposal = await createProposal(event.id, [host.id]);
    act(commenter.id);
    vi.stubEnv("SITE_URL", "https://site.example");

    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "Sounds great",
    });
    await flushAfter();

    expect(vi.mocked(sendMail).mock.calls.map((c) => c[0].to)).toEqual([
      "host@test.example",
    ]);
  });

  it("stores a comment and reads it back with its author and time", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);
    const before = new Date();

    const result = await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "Sounds **great**",
    });

    expect(result).toEqual({ success: true });
    const comments = await getRepositories().proposalComments.listByProposal(
      proposal.id
    );
    expect(comments).toHaveLength(1);
    expect(comments[0].body).toBe("Sounds **great**");
    expect(comments[0].author).toEqual({ id: guest.id, name: guest.name });
    expect(comments[0].createdTime.getTime()).toBeGreaterThanOrEqual(
      before.getTime() - 1000
    );
  });

  it("lists comments oldest first", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);

    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "first",
    });
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "second",
    });

    const comments = await getRepositories().proposalComments.listByProposal(
      proposal.id
    );
    expect(comments.map((c) => c.body)).toEqual(["first", "second"]);
  });

  it("lists comments posted in the same millisecond in the order they were posted", async () => {
    const { guest, proposal } = await setup();
    const { proposalComments } = getRepositories();
    const sameMillisecond = new Date();
    const bodies = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

    for (const body of bodies) {
      await proposalComments.createForProposal({
        proposalId: proposal.id,
        authorId: guest.id,
        body,
        createdTime: sameMillisecond,
      });
    }

    // Comment ids are random, so a tiebreak on the id would shuffle these.
    expect(
      (await proposalComments.listByProposal(proposal.id)).map((c) => c.body)
    ).toEqual(bodies);
  });

  it("keeps each proposal's comments separate", async () => {
    const { event, guest, proposal } = await setup();
    const other = await createProposal(event.id, []);
    act(guest.id);

    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "on the first",
    });

    expect(
      await getRepositories().proposalComments.listByProposal(other.id)
    ).toHaveLength(0);
  });

  it("refuses to comment without a selected name", async () => {
    const { event, proposal } = await setup();

    const result = await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "anonymous",
    });

    expect(result).toHaveProperty("error");
    expect(
      await getRepositories().proposalComments.listByProposal(proposal.id)
    ).toHaveLength(0);
  });

  it("refuses to comment as a protected guest without a verified session", async () => {
    const { event, guest, proposal } = await setup();
    await getRepositories().guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: null,
    });
    act(guest.id);

    const result = await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "impersonated",
    });

    expect(result).toHaveProperty("error");
    expect(
      await getRepositories().proposalComments.listByProposal(proposal.id)
    ).toHaveLength(0);
  });

  it("allows a verified protected guest to comment", async () => {
    const { event, guest, proposal } = await setup();
    await getRepositories().guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: null,
    });
    cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guest.id));

    const result = await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "verified",
    });

    expect(result).toEqual({ success: true });
    expect(
      await getRepositories().proposalComments.listByProposal(proposal.id)
    ).toHaveLength(1);
  });

  it("rejects an empty comment", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);

    const result = await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "   ",
    });

    expect(result).toHaveProperty("error");
    expect(
      await getRepositories().proposalComments.listByProposal(proposal.id)
    ).toHaveLength(0);
  });

  it("rejects a comment on an unknown proposal", async () => {
    const { event, guest } = await setup();
    act(guest.id);

    const result = await createComment({
      proposalId: "does-not-exist",
      eventSlug: event.slug,
      body: "hello",
    });

    expect(result).toHaveProperty("error");
  });

  it("removes a proposal's comments when the proposal is deleted", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "doomed",
    });

    await getRepositories().sessionProposals.delete(proposal.id);

    expect(
      await getRepositories().proposalComments.listByProposal(proposal.id)
    ).toEqual([]);
    expect(
      await getRepositories().sessionProposals.listByEvent(event.id)
    ).toEqual([]);
  });
});

async function onlyComment(proposalId: string) {
  const comments =
    await getRepositories().proposalComments.listByProposal(proposalId);
  expect(comments).toHaveLength(1);
  return comments[0];
}

describe("editing a comment", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  it("replaces the body and records when it was edited", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "original",
    });
    const before = await onlyComment(proposal.id);
    expect(before.editedTime).toBeNull();

    const result = await updateComment({
      commentId: before.id,
      eventSlug: event.slug,
      body: "revised",
    });

    expect(result).toEqual({ success: true });
    const after = await onlyComment(proposal.id);
    expect(after.body).toBe("revised");
    expect(after.editedTime).toBeInstanceOf(Date);
    expect(after.createdTime).toEqual(before.createdTime);
  });

  it("refuses to edit someone else's comment", async () => {
    const { event, guest, proposal } = await setup();
    const other = await createGuest({ eventId: event.id });
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "mine",
    });
    const comment = await onlyComment(proposal.id);

    act(other.id);
    const result = await updateComment({
      commentId: comment.id,
      eventSlug: event.slug,
      body: "hijacked",
    });

    expect(result).toHaveProperty("error");
    expect((await onlyComment(proposal.id)).body).toBe("mine");
  });

  it("rejects an empty edit", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "mine",
    });
    const comment = await onlyComment(proposal.id);

    const result = await updateComment({
      commentId: comment.id,
      eventSlug: event.slug,
      body: "  ",
    });

    expect(result).toHaveProperty("error");
    expect((await onlyComment(proposal.id)).body).toBe("mine");
  });
});

describe("deleting a comment", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  it("removes a childless comment outright", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "never mind",
    });
    const comment = await onlyComment(proposal.id);

    const result = await deleteComment({
      commentId: comment.id,
      eventSlug: event.slug,
    });

    expect(result).toEqual({ success: true });
    expect(
      await getRepositories().proposalComments.listByProposal(proposal.id)
    ).toEqual([]);
  });

  it("leaves a tombstone when the comment has replies", async () => {
    const { event, guest, proposal } = await setup();
    const other = await createGuest({ eventId: event.id });
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "the question",
    });
    const parent = await onlyComment(proposal.id);
    act(other.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      parentId: parent.id,
      body: "the answer",
    });

    act(guest.id);
    await deleteComment({ commentId: parent.id, eventSlug: event.slug });

    const comments = await getRepositories().proposalComments.listByProposal(
      proposal.id
    );
    expect(comments).toHaveLength(2);
    const tombstone = comments.find((c) => c.id === parent.id)!;
    expect(tombstone.deleted).toBe(true);
    expect(tombstone.body).toBe("");
    expect(tombstone.author).toBeNull();
    const reply = comments.find((c) => c.id !== parent.id)!;
    expect(reply.body).toBe("the answer");
    expect(reply.parentId).toBe(parent.id);
  });

  it("clears a tombstone once its last reply goes", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "parent",
    });
    const parent = await onlyComment(proposal.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      parentId: parent.id,
      body: "child",
    });
    const child = (
      await getRepositories().proposalComments.listByProposal(proposal.id)
    ).find((c) => c.id !== parent.id)!;

    await deleteComment({ commentId: parent.id, eventSlug: event.slug });
    await deleteComment({ commentId: child.id, eventSlug: event.slug });

    expect(
      await getRepositories().proposalComments.listByProposal(proposal.id)
    ).toEqual([]);
  });

  it("refuses to delete someone else's comment", async () => {
    const { event, guest, proposal } = await setup();
    const other = await createGuest({ eventId: event.id });
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "mine",
    });
    const comment = await onlyComment(proposal.id);

    act(other.id);
    const result = await deleteComment({
      commentId: comment.id,
      eventSlug: event.slug,
    });

    expect(result).toHaveProperty("error");
    expect((await onlyComment(proposal.id)).body).toBe("mine");
  });

  it("refuses to edit a tombstone", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "parent",
    });
    const parent = await onlyComment(proposal.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      parentId: parent.id,
      body: "child",
    });
    await deleteComment({ commentId: parent.id, eventSlug: event.slug });

    const result = await updateComment({
      commentId: parent.id,
      eventSlug: event.slug,
      body: "back from the dead",
    });

    expect(result).toHaveProperty("error");
  });
});

describe("threaded replies", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  it("records the parent of a reply", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "top level",
    });
    const parent = await onlyComment(proposal.id);

    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      parentId: parent.id,
      body: "a reply",
    });

    const comments = await getRepositories().proposalComments.listByProposal(
      proposal.id
    );
    expect(comments.map((c) => c.parentId)).toEqual([null, parent.id]);
  });

  it("rejects a reply to a comment on another proposal", async () => {
    const { event, guest, proposal } = await setup();
    const elsewhere = await createProposal(event.id, []);
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "top level",
    });
    const parent = await onlyComment(proposal.id);

    const result = await createComment({
      proposalId: elsewhere.id,
      eventSlug: event.slug,
      parentId: parent.id,
      body: "misfiled reply",
    });

    expect(result).toHaveProperty("error");
    expect(
      await getRepositories().proposalComments.listByProposal(elsewhere.id)
    ).toEqual([]);
  });

  it("deletes a whole thread with its proposal", async () => {
    const { event, guest, proposal } = await setup();
    act(guest.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "top level",
    });
    const parent = await onlyComment(proposal.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      parentId: parent.id,
      body: "a reply",
    });

    await getRepositories().sessionProposals.delete(proposal.id);

    expect(
      await getRepositories().proposalComments.listByProposal(proposal.id)
    ).toEqual([]);
  });
});
