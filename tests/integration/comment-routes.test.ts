import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { GET as sessionComments } from "@/app/api/session/[sessionId]/comments/route";
import { GET as profileComments } from "@/app/api/profile/[profileId]/comments/route";

describe("comment read endpoints", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("serves a session's comments", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    const session = await createSession(event.id);
    await getRepositories().sessionComments.create({
      subjectId: session.id,
      authorId: guest.id,
      body: "See you there",
      createdTime: new Date(),
    });

    const res = await sessionComments(
      new Request(`http://test/api/session/${session.id}/comments`),
      { params: Promise.resolve({ sessionId: session.id }) }
    );

    expect(res.status).toBe(200);
    const comments = (await res.json()) as { body: string }[];
    expect(comments.map((c) => c.body)).toEqual(["See you there"]);
  });

  // Without this a typo'd or deleted id is indistinguishable from a session
  // nobody has commented on yet.
  it("answers 404 for a session that does not exist", async () => {
    const res = await sessionComments(
      new Request("http://test/api/session/nope/comments"),
      { params: Promise.resolve({ sessionId: "nope" }) }
    );

    expect(res.status).toBe(404);
  });

  it("serves a profile's comments", async () => {
    const owner = await createGuest();
    const commenter = await createGuest();
    await getRepositories().profileComments.create({
      subjectId: owner.id,
      authorId: commenter.id,
      body: "Nice to meet you",
      createdTime: new Date(),
    });

    const res = await profileComments(
      new Request(`http://test/api/profile/${owner.id}/comments`),
      { params: Promise.resolve({ profileId: owner.id }) }
    );

    expect(res.status).toBe(200);
    const comments = (await res.json()) as { body: string }[];
    expect(comments.map((c) => c.body)).toEqual(["Nice to meet you"]);
  });

  it("answers 404 for a profile that does not exist", async () => {
    const res = await profileComments(
      new Request("http://test/api/profile/nope/comments"),
      { params: Promise.resolve({ profileId: "nope" }) }
    );

    expect(res.status).toBe(404);
  });
});
