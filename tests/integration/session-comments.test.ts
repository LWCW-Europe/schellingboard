import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { resetTestDb, setupTestDb } from "../helpers/db";
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
import {
  createProposalComment,
  createSessionComment as createComment,
  deleteComment,
  updateComment,
} from "@/app/(site)/[eventSlug]/comment-actions";

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

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function setup() {
  const event = await createEvent({ phase: "scheduling" });
  const guest = await createGuest({ eventId: event.id });
  const session = await createSession(event.id);
  return { event, guest, session };
}

function act(guestId: string): void {
  cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guestId));
}

describe("session comments", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  it("stores a comment and reads it back with its author and time", async () => {
    const { guest, session } = await setup();
    act(guest.id);
    const before = new Date();

    const result = await createComment({
      sessionId: session.id,
      body: "See you there",
    });

    expect(result).toEqual({ success: true });
    const comments = await getRepositories().sessionComments.listBySession(
      session.id
    );
    expect(comments).toHaveLength(1);
    expect(comments[0].body).toBe("See you there");
    expect(comments[0].author).toEqual({ id: guest.id, name: guest.name });
    expect(comments[0].createdTime.getTime()).toBeGreaterThanOrEqual(
      before.getTime() - 1000
    );
  });

  it("lists comments oldest first", async () => {
    const { guest, session } = await setup();
    act(guest.id);

    await createComment({
      sessionId: session.id,
      body: "first",
    });
    await createComment({
      sessionId: session.id,
      body: "second",
    });

    const comments = await getRepositories().sessionComments.listBySession(
      session.id
    );
    expect(comments.map((c) => c.body)).toEqual(["first", "second"]);
  });

  it("lists comments posted in the same millisecond in the order they were posted", async () => {
    const { guest, session } = await setup();
    const { sessionComments } = getRepositories();
    const sameMillisecond = new Date();
    const bodies = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

    for (const body of bodies) {
      await sessionComments.createForSession({
        sessionId: session.id,
        authorId: guest.id,
        body,
        createdTime: sameMillisecond,
      });
    }

    // Comment ids are random, so a tiebreak on the id would shuffle these.
    expect(
      (await sessionComments.listBySession(session.id)).map((c) => c.body)
    ).toEqual(bodies);
  });

  it("keeps each session's comments separate", async () => {
    const { event, guest, session } = await setup();
    const other = await createSession(event.id);
    act(guest.id);

    await createComment({
      sessionId: session.id,
      body: "on the first",
    });

    expect(
      await getRepositories().sessionComments.listBySession(other.id)
    ).toHaveLength(0);
  });

  it("keeps sessions' and proposals' comments separate", async () => {
    const { event, guest, session } = await setup();
    const proposal = await createProposal(event.id, []);
    act(guest.id);

    await createComment({
      sessionId: session.id,
      body: "on the session",
    });
    await createProposalComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "on the proposal",
    });

    expect(
      (await getRepositories().sessionComments.listBySession(session.id)).map(
        (c) => c.body
      )
    ).toEqual(["on the session"]);
    expect(
      (
        await getRepositories().proposalComments.listByProposal(proposal.id)
      ).map((c) => c.body)
    ).toEqual(["on the proposal"]);
  });

  it("refuses to comment without a selected name", async () => {
    const { session } = await setup();

    const result = await createComment({
      sessionId: session.id,
      body: "anonymous",
    });

    expect(result).toHaveProperty("error");
    expect(
      await getRepositories().sessionComments.listBySession(session.id)
    ).toHaveLength(0);
  });

  it("refuses to comment as a protected guest without a verified session", async () => {
    const { guest, session } = await setup();
    await getRepositories().guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: null,
    });
    act(guest.id);

    const result = await createComment({
      sessionId: session.id,
      body: "impersonated",
    });

    expect(result).toHaveProperty("error");
    expect(
      await getRepositories().sessionComments.listBySession(session.id)
    ).toHaveLength(0);
  });

  it("allows a verified protected guest to comment", async () => {
    const { guest, session } = await setup();
    await getRepositories().guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: null,
    });
    cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guest.id));

    const result = await createComment({
      sessionId: session.id,
      body: "verified",
    });

    expect(result).toEqual({ success: true });
    expect(
      await getRepositories().sessionComments.listBySession(session.id)
    ).toHaveLength(1);
  });

  it("rejects an empty comment", async () => {
    const { guest, session } = await setup();
    act(guest.id);

    const result = await createComment({
      sessionId: session.id,
      body: "   ",
    });

    expect(result).toHaveProperty("error");
    expect(
      await getRepositories().sessionComments.listBySession(session.id)
    ).toHaveLength(0);
  });

  it("rejects a comment on an unknown session", async () => {
    const { guest } = await setup();
    act(guest.id);

    const result = await createComment({
      sessionId: "does-not-exist",
      body: "hello",
    });

    expect(result).toHaveProperty("error");
  });

  it("removes a session's comments when the session is deleted", async () => {
    const { guest, session } = await setup();
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "doomed",
    });

    await getRepositories().sessions.delete(session.id);

    expect(
      await getRepositories().sessionComments.listBySession(session.id)
    ).toEqual([]);
  });
});

async function onlyComment(sessionId: string) {
  const comments =
    await getRepositories().sessionComments.listBySession(sessionId);
  expect(comments).toHaveLength(1);
  return comments[0];
}

describe("editing a session comment", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  it("replaces the body and records when it was edited", async () => {
    const { guest, session } = await setup();
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "original",
    });
    const before = await onlyComment(session.id);
    expect(before.editedTime).toBeNull();

    const result = await updateComment({
      commentId: before.id,
      body: "revised",
    });

    expect(result).toEqual({ success: true });
    const after = await onlyComment(session.id);
    expect(after.body).toBe("revised");
    expect(after.editedTime).toBeInstanceOf(Date);
    expect(after.createdTime).toEqual(before.createdTime);
  });

  it("refuses to edit someone else's comment", async () => {
    const { event, guest, session } = await setup();
    const other = await createGuest({ eventId: event.id });
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "mine",
    });
    const comment = await onlyComment(session.id);

    act(other.id);
    const result = await updateComment({
      commentId: comment.id,
      body: "hijacked",
    });

    expect(result).toHaveProperty("error");
    expect((await onlyComment(session.id)).body).toBe("mine");
  });

  it("rejects an empty edit", async () => {
    const { guest, session } = await setup();
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "mine",
    });
    const comment = await onlyComment(session.id);

    const result = await updateComment({
      commentId: comment.id,
      body: "  ",
    });

    expect(result).toHaveProperty("error");
    expect((await onlyComment(session.id)).body).toBe("mine");
  });
});

describe("deleting a session comment", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  it("removes a childless comment outright", async () => {
    const { guest, session } = await setup();
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "never mind",
    });
    const comment = await onlyComment(session.id);

    const result = await deleteComment({
      commentId: comment.id,
    });

    expect(result).toEqual({ success: true });
    expect(
      await getRepositories().sessionComments.listBySession(session.id)
    ).toEqual([]);
  });

  it("leaves a tombstone when the comment has replies", async () => {
    const { event, guest, session } = await setup();
    const other = await createGuest({ eventId: event.id });
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "the question",
    });
    const parent = await onlyComment(session.id);
    act(other.id);
    await createComment({
      sessionId: session.id,
      parentId: parent.id,
      body: "the answer",
    });

    act(guest.id);
    await deleteComment({ commentId: parent.id });

    const comments = await getRepositories().sessionComments.listBySession(
      session.id
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
    const { guest, session } = await setup();
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "parent",
    });
    const parent = await onlyComment(session.id);
    await createComment({
      sessionId: session.id,
      parentId: parent.id,
      body: "child",
    });
    const child = (
      await getRepositories().sessionComments.listBySession(session.id)
    ).find((c) => c.id !== parent.id)!;

    await deleteComment({ commentId: parent.id });
    await deleteComment({ commentId: child.id });

    expect(
      await getRepositories().sessionComments.listBySession(session.id)
    ).toEqual([]);
  });

  it("refuses to delete someone else's comment", async () => {
    const { event, guest, session } = await setup();
    const other = await createGuest({ eventId: event.id });
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "mine",
    });
    const comment = await onlyComment(session.id);

    act(other.id);
    const result = await deleteComment({
      commentId: comment.id,
    });

    expect(result).toHaveProperty("error");
    expect((await onlyComment(session.id)).body).toBe("mine");
  });

  it("refuses to edit a tombstone", async () => {
    const { guest, session } = await setup();
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "parent",
    });
    const parent = await onlyComment(session.id);
    await createComment({
      sessionId: session.id,
      parentId: parent.id,
      body: "child",
    });
    await deleteComment({ commentId: parent.id });

    const result = await updateComment({
      commentId: parent.id,
      body: "back from the dead",
    });

    expect(result).toHaveProperty("error");
  });
});

describe("threaded session replies", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  it("records the parent of a reply", async () => {
    const { guest, session } = await setup();
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "top level",
    });
    const parent = await onlyComment(session.id);

    await createComment({
      sessionId: session.id,
      parentId: parent.id,
      body: "a reply",
    });

    const comments = await getRepositories().sessionComments.listBySession(
      session.id
    );
    expect(comments.map((c) => c.parentId)).toEqual([null, parent.id]);
  });

  it("rejects a reply to a comment on another session", async () => {
    const { event, guest, session } = await setup();
    const elsewhere = await createSession(event.id);
    act(guest.id);
    await createComment({
      sessionId: elsewhere.id,
      body: "top level elsewhere",
    });
    const parent = await onlyComment(elsewhere.id);

    const result = await createComment({
      sessionId: session.id,
      parentId: parent.id,
      body: "misfiled reply",
    });

    expect(result).toHaveProperty("error");
    expect(
      await getRepositories().sessionComments.listBySession(session.id)
    ).toEqual([]);
  });

  it("rejects a reply to a comment left on a proposal", async () => {
    const { event, guest, session } = await setup();
    const proposal = await createProposal(event.id, []);
    act(guest.id);
    await createProposalComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      body: "top level on a proposal",
    });
    const parent = (
      await getRepositories().proposalComments.listByProposal(proposal.id)
    )[0];

    const result = await createComment({
      sessionId: session.id,
      parentId: parent.id,
      body: "misfiled reply",
    });

    expect(result).toHaveProperty("error");
    expect(
      await getRepositories().sessionComments.listBySession(session.id)
    ).toEqual([]);
  });

  it("deletes a whole thread with its session", async () => {
    const { guest, session } = await setup();
    act(guest.id);
    await createComment({
      sessionId: session.id,
      body: "top level",
    });
    const parent = await onlyComment(session.id);
    await createComment({
      sessionId: session.id,
      parentId: parent.id,
      body: "a reply",
    });

    await getRepositories().sessions.delete(session.id);

    expect(
      await getRepositories().sessionComments.listBySession(session.id)
    ).toEqual([]);
  });
});
