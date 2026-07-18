import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { NextRequest } from "next/server";

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
import { createUserAuthCookie, USER_AUTH_COOKIE_NAME } from "@/utils/auth";
import { POST as toggleRsvp } from "@/app/api/toggle-rsvp/route";
import { POST as addVote } from "@/app/api/add-vote/route";
import { POST as deleteVote } from "@/app/api/delete-vote/route";
import { GET as getVotes } from "@/app/api/votes/route";
import { updateProfileAction } from "@/app/actions/profile";
import { updateEmailSettingsAction } from "@/app/actions/settings";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function protectGuest(guestId: string): Promise<void> {
  await getRepositories().guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: null,
  });
}

async function authCookieHeader(guestId: string): Promise<string> {
  const cookie = await createUserAuthCookie(guestId);
  return `${cookie.name}=${cookie.value}`;
}

function postReq(path: string, payload: unknown, cookie?: string): NextRequest {
  return new NextRequest(`http://test${path}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: cookie ? { cookie } : {},
  });
}

describe("write enforcement for protected guests", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  describe("POST /api/toggle-rsvp", () => {
    async function setup() {
      const event = await createEvent({ phase: "scheduling" });
      const guest = await createGuest({ eventId: event.id });
      const session = await createSession(event.id);
      await protectGuest(guest.id);
      return { guest, session };
    }

    it("rejects an RSVP for a protected guest without a verified session", async () => {
      const { guest, session } = await setup();
      const res = await toggleRsvp(
        postReq("/api/toggle-rsvp", {
          sessionId: session.id,
          guestId: guest.id,
        })
      );
      expect(res.status).toBe(403);
      expect(await getRepositories().rsvps.listByGuest(guest.id)).toHaveLength(
        0
      );
    });

    it("accepts an RSVP with a verified session", async () => {
      const { guest, session } = await setup();
      const res = await toggleRsvp(
        postReq(
          "/api/toggle-rsvp",
          { sessionId: session.id, guestId: guest.id },
          await authCookieHeader(guest.id)
        )
      );
      expect(res.ok).toBe(true);
      expect(await getRepositories().rsvps.listByGuest(guest.id)).toHaveLength(
        1
      );
    });

    it("rejects a session verified for a different guest", async () => {
      const { guest, session } = await setup();
      const other = await createGuest();
      const res = await toggleRsvp(
        postReq(
          "/api/toggle-rsvp",
          { sessionId: session.id, guestId: guest.id },
          await authCookieHeader(other.id)
        )
      );
      expect(res.status).toBe(403);
    });
  });

  describe("voting routes", () => {
    async function setup() {
      const event = await createEvent({ phase: "voting" });
      const guest = await createGuest({ eventId: event.id });
      const proposal = await createProposal(event.id, []);
      await protectGuest(guest.id);
      return { event, guest, proposal };
    }

    it("rejects voting as a protected guest without a verified session", async () => {
      const { guest, proposal } = await setup();
      const res = await addVote(
        postReq("/api/add-vote", {
          proposalId: proposal.id,
          guestId: guest.id,
          choice: "interested",
        })
      );
      expect(res.status).toBe(403);
    });

    it("accepts a vote with a verified session and protects its deletion", async () => {
      const { event, guest, proposal } = await setup();
      const cookie = await authCookieHeader(guest.id);
      const res = await addVote(
        postReq(
          "/api/add-vote",
          { proposalId: proposal.id, guestId: guest.id, choice: "interested" },
          cookie
        )
      );
      expect(res.ok).toBe(true);

      const unauthorizedDelete = await deleteVote(
        postReq("/api/delete-vote", {
          proposalId: proposal.id,
          guestId: guest.id,
        })
      );
      expect(unauthorizedDelete.status).toBe(403);
      expect(
        await getRepositories().votes.listByGuestAndEvent(guest.id, event.id)
      ).toHaveLength(1);

      const authorizedDelete = await deleteVote(
        postReq(
          "/api/delete-vote",
          { proposalId: proposal.id, guestId: guest.id },
          cookie
        )
      );
      expect(authorizedDelete.ok).toBe(true);
    });

    it("hides a protected guest's votes from unverified readers", async () => {
      const { event, guest, proposal } = await setup();
      const cookie = await authCookieHeader(guest.id);
      await addVote(
        postReq(
          "/api/add-vote",
          { proposalId: proposal.id, guestId: guest.id, choice: "interested" },
          cookie
        )
      );

      const eventSlug = (await getRepositories().events.findById(event.id))!
        .slug;
      const unverified = await getVotes(
        new NextRequest(
          `http://test/api/votes?user=${guest.id}&event=${eventSlug}`
        )
      );
      expect(unverified.status).toBe(403);

      const verified = await getVotes(
        new NextRequest(
          `http://test/api/votes?user=${guest.id}&event=${eventSlug}`,
          { headers: { cookie } }
        )
      );
      expect(verified.ok).toBe(true);
      expect(await verified.json()).toHaveLength(1);
    });
  });

  describe("profile and settings actions", () => {
    it("rejects edits as a protected guest without a verified session", async () => {
      const guest = await createGuest({ name: "Before" });
      await protectGuest(guest.id);
      cookieJar.set("user", guest.id);

      const profileResult = await updateProfileAction({
        name: "After",
        aboutMe: null,
      });
      expect(profileResult.ok).toBe(false);
      expect((await getRepositories().guests.findById(guest.id))?.name).toBe(
        "Before"
      );

      const settingsResult = await updateEmailSettingsAction({
        rsvpChange: false,
        hostChange: false,
        cohostAdd: false,
      });
      expect(settingsResult.ok).toBe(false);
    });

    it("accepts edits with a verified session", async () => {
      const guest = await createGuest({ name: "Before" });
      await protectGuest(guest.id);
      cookieJar.set("user", guest.id);
      cookieJar.set(
        USER_AUTH_COOKIE_NAME,
        (await createUserAuthCookie(guest.id)).value
      );

      const result = await updateProfileAction({
        name: "After",
        aboutMe: null,
      });
      expect(result).toEqual({ ok: true });
      expect((await getRepositories().guests.findById(guest.id))?.name).toBe(
        "After"
      );
    });
  });
});
