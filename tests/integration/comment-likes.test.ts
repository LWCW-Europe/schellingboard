import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";

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
import { createEvent, createGuest, createProposal } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { GUEST_COOKIE_NAME, openGuestValue } from "../helpers/guest-cookie";
import {
  createProposalComment as createComment,
  deleteComment,
  toggleCommentLike,
} from "@/app/(site)/[eventSlug]/comment-actions";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

function act(guestId: string): void {
  cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guestId));
}

async function setup() {
  const event = await createEvent({ phase: "voting" });
  const guest = await createGuest({ eventId: event.id });
  const proposal = await createProposal(event.id, []);
  act(guest.id);
  await createComment({
    proposalId: proposal.id,
    eventSlug: event.slug,
    body: "worth liking",
  });
  const [comment] = await getRepositories().comments.listByProposal(
    proposal.id
  );
  return { event, guest, proposal, comment };
}

async function likesOn(proposalId: string, commentId: string) {
  const comments = await getRepositories().comments.listByProposal(proposalId);
  return comments.find((c) => c.id === commentId)!.likes;
}

describe("comment likes", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  it("starts with no likes", async () => {
    const { proposal, comment } = await setup();

    expect(await likesOn(proposal.id, comment.id)).toEqual([]);
  });

  it("records who liked the comment", async () => {
    const { event, guest, proposal, comment } = await setup();

    const result = await toggleCommentLike({
      commentId: comment.id,
      eventSlug: event.slug,
    });

    expect(result).toEqual({ success: true, liked: true });
    expect(await likesOn(proposal.id, comment.id)).toEqual([
      { id: guest.id, name: guest.name, avatarUrl: null },
    ]);
  });

  it("carries each liker's avatar, so it can be shown next to their name", async () => {
    const { event, guest, proposal, comment } = await setup();
    await getRepositories().guests.updateProfile(guest.id, {
      name: guest.name,
      aboutMe: null,
      avatarUrl: "/uploads/avatar.webp",
      pronouns: null,
      basedIn: null,
      prompts: null,
      languages: null,
      contacts: null,
    });

    await toggleCommentLike({ commentId: comment.id, eventSlug: event.slug });

    expect(await likesOn(proposal.id, comment.id)).toEqual([
      { id: guest.id, name: guest.name, avatarUrl: "/uploads/avatar.webp" },
    ]);
  });

  it("takes the like back when pressed again", async () => {
    const { event, proposal, comment } = await setup();
    await toggleCommentLike({ commentId: comment.id, eventSlug: event.slug });

    const result = await toggleCommentLike({
      commentId: comment.id,
      eventSlug: event.slug,
    });

    expect(result).toEqual({ success: true, liked: false });
    expect(await likesOn(proposal.id, comment.id)).toEqual([]);
  });

  it("keeps every guest's like, oldest first", async () => {
    const { event, guest, proposal, comment } = await setup();
    const other = await createGuest({ eventId: event.id });

    await toggleCommentLike({ commentId: comment.id, eventSlug: event.slug });
    act(other.id);
    await toggleCommentLike({ commentId: comment.id, eventSlug: event.slug });

    expect(await likesOn(proposal.id, comment.id)).toEqual([
      { id: guest.id, name: guest.name, avatarUrl: null },
      { id: other.id, name: other.name, avatarUrl: null },
    ]);
  });

  it("refuses to like without a selected name", async () => {
    const { event, proposal, comment } = await setup();
    cookieJar.clear();

    const result = await toggleCommentLike({
      commentId: comment.id,
      eventSlug: event.slug,
    });

    expect(result).toHaveProperty("error");
    expect(await likesOn(proposal.id, comment.id)).toEqual([]);
  });

  it("refuses to like as a protected guest without a verified session", async () => {
    const { event, guest, proposal, comment } = await setup();
    await getRepositories().guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: null,
    });

    const result = await toggleCommentLike({
      commentId: comment.id,
      eventSlug: event.slug,
    });

    expect(result).toHaveProperty("error");
    expect(await likesOn(proposal.id, comment.id)).toEqual([]);
  });

  it("refuses to like a comment that does not exist", async () => {
    const { event } = await setup();

    const result = await toggleCommentLike({
      commentId: "does-not-exist",
      eventSlug: event.slug,
    });

    expect(result).toHaveProperty("error");
  });

  it("refuses to like a deleted comment kept as a tombstone", async () => {
    const { event, guest, proposal, comment } = await setup();
    const other = await createGuest({ eventId: event.id });
    act(other.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      parentId: comment.id,
      body: "a surviving reply",
    });
    act(guest.id);
    await deleteComment({ commentId: comment.id, eventSlug: event.slug });

    const result = await toggleCommentLike({
      commentId: comment.id,
      eventSlug: event.slug,
    });

    expect(result).toHaveProperty("error");
  });

  it("discards the likes of a comment deleted into a tombstone", async () => {
    const { event, guest, proposal, comment } = await setup();
    const other = await createGuest({ eventId: event.id });
    act(other.id);
    await createComment({
      proposalId: proposal.id,
      eventSlug: event.slug,
      parentId: comment.id,
      body: "a surviving reply",
    });
    await toggleCommentLike({ commentId: comment.id, eventSlug: event.slug });
    expect(await likesOn(proposal.id, comment.id)).toHaveLength(1);

    act(guest.id);
    await deleteComment({ commentId: comment.id, eventSlug: event.slug });

    expect(await likesOn(proposal.id, comment.id)).toEqual([]);
  });

  it("discards the likes of a comment removed outright", async () => {
    const { event, proposal, comment } = await setup();
    await toggleCommentLike({ commentId: comment.id, eventSlug: event.slug });

    await deleteComment({ commentId: comment.id, eventSlug: event.slug });

    expect(
      await getRepositories().comments.listByProposal(proposal.id)
    ).toEqual([]);
  });
});
