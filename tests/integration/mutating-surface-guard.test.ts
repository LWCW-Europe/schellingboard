import fs from "node:fs";
import path from "node:path";
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

// Guards the invariant in CONTRIBUTING.md § Authorization: every mutating
// handler must resolve the acting guest and refuse to act as a protected
// guest without a verified session. This file enumerates app/api route
// files so a newly added, unguarded handler fails the suite instead of
// silently shipping — it must be added to VERIFIERS (with a check that
// proves the 403) or to READ_ONLY (with a reason).
//
// `app/(site)/[eventSlug]/proposals/actions.ts` is covered the same way:
// its export list is asserted below so a new export must be added to
// PROPOSAL_ACTION_VERIFIERS too.

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
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

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createDay,
  createProposal,
  createSession,
} from "../helpers/factories";
import { GUEST_COOKIE_NAME, openGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function protectGuest(guestId: string): Promise<void> {
  await getRepositories().guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: null,
  });
}

function apiRouteFiles(): string[] {
  const root = path.join(process.cwd(), "app/api");
  const results: string[] = [];
  function walk(dir: string, rel: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), `${rel}${entry.name}/`);
      } else if (entry.name === "route.ts") {
        results.push(rel.replace(/\/$/, ""));
      }
    }
  }
  walk(root, "");
  return results.sort();
}

// Independent auth layers (admin/site gates), not the acting-guest
// invariant this guard covers; and the unauthenticated health check.
const OUT_OF_SCOPE_PREFIXES = ["admin/", "auth/"];
const OUT_OF_SCOPE_EXACT = new Set(["health"]);

// Read-only surfaces are exempt from the invariant per CONTRIBUTING.md.
const READ_ONLY = new Set(["rsvps", "votes"]);

type Verifier = () => Promise<void>;

const VERIFIERS: Record<string, Verifier> = {
  "add-session": async () => {
    const { POST } = await import("@/app/api/add-session/route");
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    await protectGuest(guest.id);
    const location = await createLocation();
    const day = await createDay(event.id);
    const res = await POST(
      new NextRequest("http://test/api/add-session", {
        method: "POST",
        body: JSON.stringify({
          title: "T",
          description: "",
          closed: false,
          hosts: [guest],
          location,
          day,
          startTimeMinutes: 600,
          duration: 60,
          timezone: "UTC",
        }),
        headers: { cookie: `${GUEST_COOKIE_NAME}=${openGuestValue(guest.id)}` },
      })
    );
    expect(res.status).toBe(403);
  },

  "update-session": async () => {
    const { POST } = await import("@/app/api/update-session/route");
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation();
    const day = await createDay(event.id);
    const session = await createSession(event.id, {
      hostIds: [host.id],
      locationIds: [location.id],
      startTime: new Date(Date.now() + 60 * 60 * 1000),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });
    await protectGuest(host.id);
    const res = await POST(
      new NextRequest("http://test/api/update-session", {
        method: "POST",
        body: JSON.stringify({
          id: session.id,
          title: "Renamed",
          description: "",
          closed: false,
          hosts: [host],
          location,
          day,
          startTimeMinutes: 600,
          duration: 60,
          timezone: "UTC",
        }),
        headers: { cookie: `${GUEST_COOKIE_NAME}=${openGuestValue(host.id)}` },
      })
    );
    expect(res.status).toBe(403);
  },

  "delete-session": async () => {
    const { POST } = await import("@/app/api/delete-session/route");
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const location = await createLocation();
    const session = await createSession(event.id, {
      hostIds: [host.id],
      locationIds: [location.id],
      startTime: new Date(Date.now() + 60 * 60 * 1000),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });
    await protectGuest(host.id);
    const res = await POST(
      new NextRequest("http://test/api/delete-session", {
        method: "POST",
        body: JSON.stringify({ id: session.id }),
        headers: { cookie: `${GUEST_COOKIE_NAME}=${openGuestValue(host.id)}` },
      })
    );
    expect(res.status).toBe(403);
  },

  "add-vote": async () => {
    const { POST } = await import("@/app/api/add-vote/route");
    const guest = await createGuest();
    await protectGuest(guest.id);
    const res = await POST(
      new Request("http://test/api/add-vote", {
        method: "POST",
        body: JSON.stringify({
          proposalId: "nonexistent",
          guestId: guest.id,
          choice: "interested",
        }),
      })
    );
    expect(res.status).toBe(403);
  },

  "delete-vote": async () => {
    const { POST } = await import("@/app/api/delete-vote/route");
    const guest = await createGuest();
    await protectGuest(guest.id);
    const res = await POST(
      new Request("http://test/api/delete-vote", {
        method: "POST",
        body: JSON.stringify({
          proposalId: "nonexistent",
          guestId: guest.id,
        }),
      })
    );
    expect(res.status).toBe(403);
  },

  "toggle-rsvp": async () => {
    const { POST } = await import("@/app/api/toggle-rsvp/route");
    const guest = await createGuest();
    await protectGuest(guest.id);
    const res = await POST(
      new Request("http://test/api/toggle-rsvp", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "nonexistent",
          guestId: guest.id,
        }),
      })
    );
    expect(res.status).toBe(403);
  },
};

const PROPOSAL_ACTION_EXPORTS = [
  "createProposal",
  "updateProposal",
  "deleteProposal",
] as const;

const PROPOSAL_ACTION_VERIFIERS: Record<
  (typeof PROPOSAL_ACTION_EXPORTS)[number],
  Verifier
> = {
  createProposal: async () => {
    const { createProposal } =
      await import("@/app/(site)/[eventSlug]/proposals/actions");
    const event = await createEvent();
    const guest = await createGuest({ eventId: event.id });
    await protectGuest(guest.id);
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const fd = new FormData();
    fd.set("event", event.id);
    fd.set("eventSlug", "test-event");
    fd.set("title", "T");
    fd.append("hosts", guest.id);
    const result = await createProposal(fd);
    expect(result).toHaveProperty("error");
  },

  updateProposal: async () => {
    const { updateProposal } =
      await import("@/app/(site)/[eventSlug]/proposals/actions");
    const event = await createEvent();
    const host = await createGuest({ eventId: event.id });
    await protectGuest(host.id);
    const proposal = await createProposal(event.id, [host.id]);
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(host.id));
    const fd = new FormData();
    fd.set("eventSlug", "test-event");
    fd.set("title", "Renamed");
    const result = await updateProposal(proposal.id, fd);
    expect(result).toHaveProperty("error");
  },

  deleteProposal: async () => {
    const { deleteProposal } =
      await import("@/app/(site)/[eventSlug]/proposals/actions");
    const event = await createEvent();
    const host = await createGuest({ eventId: event.id });
    await protectGuest(host.id);
    const proposal = await createProposal(event.id, [host.id]);
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(host.id));
    const result = await deleteProposal(proposal.id, "test-event");
    expect(result).toHaveProperty("error");
  },
};

describe("mutating-surface regression guard", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });
  afterEach(() => vi.unstubAllEnvs());

  const files = apiRouteFiles().filter(
    (f) =>
      !OUT_OF_SCOPE_PREFIXES.some((p) => f.startsWith(p)) &&
      !OUT_OF_SCOPE_EXACT.has(f)
  );

  for (const f of files) {
    it(`app/api/${f}/route.ts is guarded or explicitly read-only`, () => {
      expect(
        READ_ONLY.has(f) || f in VERIFIERS,
        `app/api/${f}/route.ts is neither in READ_ONLY nor VERIFIERS in ` +
          `tests/integration/mutating-surface-guard.test.ts — add it to one`
      ).toBe(true);
    });
  }

  for (const [name, verify] of Object.entries(VERIFIERS)) {
    it(
      `app/api/${name} rejects acting as a protected guest without a verified session`,
      verify
    );
  }

  it("proposals/actions.ts exports exactly the known mutating actions", async () => {
    const actions = await import("@/app/(site)/[eventSlug]/proposals/actions");
    const exported = Object.keys(actions).sort();
    expect(
      exported,
      "a new export in proposals/actions.ts needs a matching entry in " +
        "PROPOSAL_ACTION_VERIFIERS in this file"
    ).toEqual([...PROPOSAL_ACTION_EXPORTS].sort());
  });

  for (const [name, verify] of Object.entries(PROPOSAL_ACTION_VERIFIERS)) {
    it(
      `${name} rejects acting as a protected guest without a verified session`,
      verify
    );
  }
});
