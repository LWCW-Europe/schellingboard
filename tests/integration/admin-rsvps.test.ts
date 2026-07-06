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
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import { adminRemoveRsvpAction } from "@/app/actions/admin-rsvps";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("adminRemoveRsvpAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("removes a single RSVP, leaving others intact", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    const g1 = await createGuest({ name: "Attendee One" });
    const g2 = await createGuest({ name: "Attendee Two" });
    const session = await createSession(event.id);
    await repos.rsvps.create({ sessionId: session.id, guestId: g1.id });
    await repos.rsvps.create({ sessionId: session.id, guestId: g2.id });

    const result = await adminRemoveRsvpAction({
      sessionId: session.id,
      guestId: g1.id,
    });
    expect(result.ok).toBe(true);

    const remaining = await repos.rsvps.listBySession(session.id);
    expect(remaining.map((r) => r.guestId)).toEqual([g2.id]);
  });

  it("rejects when not authenticated", async () => {
    const event = await createEvent();
    const guest = await createGuest();
    const session = await createSession(event.id);
    await getRepositories().rsvps.create({
      sessionId: session.id,
      guestId: guest.id,
    });
    cookieJar.clear();

    const result = await adminRemoveRsvpAction({
      sessionId: session.id,
      guestId: guest.id,
    });
    expect(!result.ok && result.error).toBe("Unauthorized");
  });

  it("errors for an unknown session", async () => {
    const result = await adminRemoveRsvpAction({
      sessionId: "no-such-session",
      guestId: "whoever",
    });
    expect(!result.ok && result.error).toBe("Session not found");
  });
});

describe("rsvps.listBySessions", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
  });

  it("returns RSVPs for all given sessions in one call", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    const g1 = await createGuest({ name: "Attendee One" });
    const g2 = await createGuest({ name: "Attendee Two" });
    const s1 = await createSession(event.id);
    const s2 = await createSession(event.id);
    const other = await createSession(event.id);
    await repos.rsvps.create({ sessionId: s1.id, guestId: g1.id });
    await repos.rsvps.create({ sessionId: s2.id, guestId: g1.id });
    await repos.rsvps.create({ sessionId: s2.id, guestId: g2.id });
    await repos.rsvps.create({ sessionId: other.id, guestId: g2.id });

    const rsvps = await repos.rsvps.listBySessions([s1.id, s2.id]);

    expect(rsvps.map((r) => [r.sessionId, r.guestId]).sort()).toEqual(
      [
        [s1.id, g1.id],
        [s2.id, g1.id],
        [s2.id, g2.id],
      ].sort()
    );
  });

  it("returns an empty list for no session ids", async () => {
    const repos = getRepositories();
    expect(await repos.rsvps.listBySessions([])).toEqual([]);
  });
});
