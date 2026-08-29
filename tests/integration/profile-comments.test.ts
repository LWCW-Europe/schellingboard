import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";

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

import { setupTestDb, resetTestDb } from "../helpers/db";
import { siteAuthenticate } from "../helpers/site-auth";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import {
  GUEST_COOKIE_NAME,
  openGuestValue,
  verifiedGuestValue,
} from "../helpers/guest-cookie";
import {
  createProfileComment as createComment,
  deleteComment,
  updateComment,
} from "@/app/(site)/[eventSlug]/comment-actions";
import { sendMail } from "@/utils/mailer";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function setup() {
  const event = await createEvent({ phase: "scheduling" });
  const owner = await createGuest({ eventId: event.id });
  const commenter = await createGuest({ eventId: event.id });
  return { event, owner, commenter };
}

function act(guestId: string): void {
  cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guestId));
}

describe("profile comments", () => {
  beforeAll(() => setupTestDb());
  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    vi.mocked(sendMail).mockReset();
    afterTasks.length = 0;
    await siteAuthenticate(cookieJar);
  });

  it("emails the profile's owner about a new comment", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const owner = await createGuest({
      eventId: event.id,
      email: "owner@test.example",
    });
    const commenter = await createGuest({ eventId: event.id });
    act(commenter.id);
    vi.stubEnv("SITE_URL", "https://site.example");

    await createComment({ profileId: owner.id, body: "Great to meet you" });
    await flushAfter();

    expect(vi.mocked(sendMail).mock.calls.map((c) => c[0].to)).toEqual([
      "owner@test.example",
    ]);
  });

  it("stores a comment and reads it back with its author and time", async () => {
    const { commenter, owner } = await setup();
    act(commenter.id);
    const before = new Date();

    const result = await createComment({
      profileId: owner.id,
      body: "Loved your talk",
    });

    expect(result).toEqual({ success: true });
    const comments = await getRepositories().profileComments.list(owner.id);
    expect(comments).toHaveLength(1);
    expect(comments[0].body).toBe("Loved your talk");
    expect(comments[0].author).toEqual({
      id: commenter.id,
      name: commenter.name,
    });
    expect(comments[0].createdTime.getTime()).toBeGreaterThanOrEqual(
      before.getTime() - 1000
    );
  });

  it("lists comments oldest first", async () => {
    const { commenter, owner } = await setup();
    act(commenter.id);

    await createComment({ profileId: owner.id, body: "first" });
    await createComment({ profileId: owner.id, body: "second" });

    const comments = await getRepositories().profileComments.list(owner.id);
    expect(comments.map((c) => c.body)).toEqual(["first", "second"]);
  });

  it("lists comments posted in the same millisecond in the order they were posted", async () => {
    const { owner } = await setup();
    const commenter = await createGuest();
    const { profileComments } = getRepositories();
    const sameMillisecond = new Date();
    const bodies = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

    for (const body of bodies) {
      await profileComments.create({
        subjectId: owner.id,
        authorId: commenter.id,
        body,
        createdTime: sameMillisecond,
      });
    }

    // Comment ids are random, so a tiebreak on the id would shuffle these.
    expect((await profileComments.list(owner.id)).map((c) => c.body)).toEqual(
      bodies
    );
  });

  it("keeps each profile's comments separate", async () => {
    const { commenter, owner } = await setup();
    const other = await createGuest();
    act(commenter.id);

    await createComment({ profileId: owner.id, body: "on the first" });

    expect(await getRepositories().profileComments.list(other.id)).toHaveLength(
      0
    );
  });

  it("keeps profiles' and sessions' comments separate", async () => {
    const { event, commenter, owner } = await setup();
    const session = await createSession(event.id);
    act(commenter.id);

    await createComment({ profileId: owner.id, body: "on the profile" });
    await getRepositories().sessionComments.create({
      subjectId: session.id,
      authorId: commenter.id,
      body: "on the session",
      createdTime: new Date(),
    });

    expect(
      (await getRepositories().profileComments.list(owner.id)).map(
        (c) => c.body
      )
    ).toEqual(["on the profile"]);
    expect(
      (await getRepositories().sessionComments.list(session.id)).map(
        (c) => c.body
      )
    ).toEqual(["on the session"]);
  });

  it("refuses to comment without a selected name", async () => {
    const { owner } = await setup();

    const result = await createComment({
      profileId: owner.id,
      body: "anonymous",
    });

    expect(result).toHaveProperty("error");
    expect(await getRepositories().profileComments.list(owner.id)).toHaveLength(
      0
    );
  });

  it("refuses to comment as a protected guest without a verified session", async () => {
    const { commenter, owner } = await setup();
    await getRepositories().guests.setAuthProtection(commenter.id, {
      authProtected: true,
      passwordHash: null,
    });
    act(commenter.id);

    const result = await createComment({
      profileId: owner.id,
      body: "impersonated",
    });

    expect(result).toHaveProperty("error");
    expect(await getRepositories().profileComments.list(owner.id)).toHaveLength(
      0
    );
  });

  it("allows a verified protected guest to comment", async () => {
    const { commenter, owner } = await setup();
    await getRepositories().guests.setAuthProtection(commenter.id, {
      authProtected: true,
      passwordHash: null,
    });
    cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(commenter.id));

    const result = await createComment({
      profileId: owner.id,
      body: "verified",
    });

    expect(result).toEqual({ success: true });
    expect(await getRepositories().profileComments.list(owner.id)).toHaveLength(
      1
    );
  });

  it("rejects an empty comment", async () => {
    const { commenter, owner } = await setup();
    act(commenter.id);

    const result = await createComment({
      profileId: owner.id,
      body: "   ",
    });

    expect(result).toHaveProperty("error");
    expect(await getRepositories().profileComments.list(owner.id)).toHaveLength(
      0
    );
  });

  it("rejects a comment on an unknown profile", async () => {
    const { commenter } = await setup();
    act(commenter.id);

    const result = await createComment({
      profileId: "does-not-exist",
      body: "hello",
    });

    expect(result).toHaveProperty("error");
  });

  it("removes a profile's comments when the guest is deleted", async () => {
    const { commenter, owner } = await setup();
    act(commenter.id);
    await createComment({ profileId: owner.id, body: "doomed" });

    await getRepositories().guests.delete(owner.id);

    expect(await getRepositories().profileComments.list(owner.id)).toEqual([]);
  });
});

async function onlyComment(profileId: string) {
  const comments = await getRepositories().profileComments.list(profileId);
  expect(comments).toHaveLength(1);
  return comments[0];
}

describe("editing a profile comment", () => {
  beforeAll(() => setupTestDb());
  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await siteAuthenticate(cookieJar);
  });

  it("replaces the body and records when it was edited", async () => {
    const { commenter, owner } = await setup();
    act(commenter.id);
    await createComment({ profileId: owner.id, body: "original" });
    const before = await onlyComment(owner.id);
    expect(before.editedTime).toBeNull();

    const result = await updateComment({
      commentId: before.id,
      body: "revised",
    });

    expect(result).toEqual({ success: true });
    const after = await onlyComment(owner.id);
    expect(after.body).toBe("revised");
    expect(after.editedTime).toBeInstanceOf(Date);
    expect(after.createdTime).toEqual(before.createdTime);
  });

  it("refuses to edit someone else's comment", async () => {
    const { commenter, owner } = await setup();
    const other = await createGuest();
    act(commenter.id);
    await createComment({ profileId: owner.id, body: "mine" });
    const comment = await onlyComment(owner.id);

    act(other.id);
    const result = await updateComment({
      commentId: comment.id,
      body: "hijacked",
    });

    expect(result).toHaveProperty("error");
    expect((await onlyComment(owner.id)).body).toBe("mine");
  });

  it("rejects an empty edit", async () => {
    const { commenter, owner } = await setup();
    act(commenter.id);
    await createComment({ profileId: owner.id, body: "mine" });
    const comment = await onlyComment(owner.id);

    const result = await updateComment({
      commentId: comment.id,
      body: "  ",
    });

    expect(result).toHaveProperty("error");
    expect((await onlyComment(owner.id)).body).toBe("mine");
  });
});

describe("deleting a profile comment", () => {
  beforeAll(() => setupTestDb());
  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await siteAuthenticate(cookieJar);
  });

  it("removes a childless comment outright", async () => {
    const { commenter, owner } = await setup();
    act(commenter.id);
    await createComment({ profileId: owner.id, body: "never mind" });
    const comment = await onlyComment(owner.id);

    const result = await deleteComment({ commentId: comment.id });

    expect(result).toEqual({ success: true });
    expect(await getRepositories().profileComments.list(owner.id)).toEqual([]);
  });

  it("leaves a tombstone when the comment has replies", async () => {
    const { commenter, owner } = await setup();
    const other = await createGuest();
    act(commenter.id);
    await createComment({ profileId: owner.id, body: "the question" });
    const parent = await onlyComment(owner.id);
    act(other.id);
    await createComment({
      profileId: owner.id,
      parentId: parent.id,
      body: "the answer",
    });

    act(commenter.id);
    await deleteComment({ commentId: parent.id });

    const comments = await getRepositories().profileComments.list(owner.id);
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
    const { commenter, owner } = await setup();
    act(commenter.id);
    await createComment({ profileId: owner.id, body: "parent" });
    const parent = await onlyComment(owner.id);
    await createComment({
      profileId: owner.id,
      parentId: parent.id,
      body: "child",
    });
    const child = (await getRepositories().profileComments.list(owner.id)).find(
      (c) => c.id !== parent.id
    )!;

    await deleteComment({ commentId: parent.id });
    await deleteComment({ commentId: child.id });

    expect(await getRepositories().profileComments.list(owner.id)).toEqual([]);
  });

  it("refuses to delete someone else's comment", async () => {
    const { commenter, owner } = await setup();
    const other = await createGuest();
    act(commenter.id);
    await createComment({ profileId: owner.id, body: "mine" });
    const comment = await onlyComment(owner.id);

    act(other.id);
    const result = await deleteComment({ commentId: comment.id });

    expect(result).toHaveProperty("error");
    expect((await onlyComment(owner.id)).body).toBe("mine");
  });
});

describe("threaded profile replies", () => {
  beforeAll(() => setupTestDb());
  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await siteAuthenticate(cookieJar);
  });

  it("records the parent of a reply", async () => {
    const { commenter, owner } = await setup();
    act(commenter.id);
    await createComment({ profileId: owner.id, body: "top level" });
    const parent = await onlyComment(owner.id);

    await createComment({
      profileId: owner.id,
      parentId: parent.id,
      body: "a reply",
    });

    const comments = await getRepositories().profileComments.list(owner.id);
    expect(comments.map((c) => c.parentId)).toEqual([null, parent.id]);
  });

  it("rejects a reply to a comment on another profile", async () => {
    const { commenter, owner } = await setup();
    const elsewhere = await createGuest();
    act(commenter.id);
    await createComment({
      profileId: elsewhere.id,
      body: "top level elsewhere",
    });
    const parent = await onlyComment(elsewhere.id);

    const result = await createComment({
      profileId: owner.id,
      parentId: parent.id,
      body: "misfiled reply",
    });

    expect(result).toHaveProperty("error");
    expect(await getRepositories().profileComments.list(owner.id)).toEqual([]);
  });

  it("rejects a reply to a comment left on a session", async () => {
    const { event, commenter, owner } = await setup();
    const session = await createSession(event.id);
    act(commenter.id);
    await getRepositories().sessionComments.create({
      subjectId: session.id,
      authorId: commenter.id,
      body: "top level on a session",
      createdTime: new Date(),
    });
    const parent = (
      await getRepositories().sessionComments.list(session.id)
    )[0];

    const result = await createComment({
      profileId: owner.id,
      parentId: parent.id,
      body: "misfiled reply",
    });

    expect(result).toHaveProperty("error");
    expect(await getRepositories().profileComments.list(owner.id)).toEqual([]);
  });

  it("deletes a whole thread with its profile", async () => {
    const { commenter, owner } = await setup();
    act(commenter.id);
    await createComment({ profileId: owner.id, body: "top level" });
    const parent = await onlyComment(owner.id);
    await createComment({
      profileId: owner.id,
      parentId: parent.id,
      body: "a reply",
    });

    await getRepositories().guests.delete(owner.id);

    expect(await getRepositories().profileComments.list(owner.id)).toEqual([]);
  });
});
