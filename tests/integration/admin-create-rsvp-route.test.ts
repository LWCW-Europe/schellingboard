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

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import type { Event, Guest, Session } from "@/db/repositories/interfaces";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import { POST } from "@/app/api/admin/create-rsvp/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

function makeReq(body: unknown): Request {
  return new Request("http://test/api/admin/create-rsvp", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function readJson(
  res: Response
): Promise<{ id: string; created: boolean }> {
  return (await res.json()) as { id: string; created: boolean };
}

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("POST /api/admin/create-rsvp", () => {
  beforeAll(() => setupTestDb());

  let event: Event;
  let session: Session;
  let guest: Guest;

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
    // Proposal phase on purpose: unlike toggle-rsvp, this route must work
    // in any phase.
    event = await createEvent({ phase: "proposal" });
    session = await createSession(event.id);
    guest = await createGuest();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("rejects the request without an admin cookie", async () => {
    cookieJar.clear();
    const res = await POST(
      makeReq({ sessionId: session.id, guestId: guest.id })
    );
    expect(res.status).toBe(401);
    expect(await getRepositories().rsvps.listBySession(session.id)).toEqual([]);
  });

  it("creates an RSVP regardless of phase and returns its id", async () => {
    const res = await POST(
      makeReq({ sessionId: session.id, guestId: guest.id })
    );
    expect(res.status).toBe(201);
    const body = await readJson(res);
    expect(body.created).toBe(true);

    const rsvps = await getRepositories().rsvps.listBySession(session.id);
    expect(rsvps).toHaveLength(1);
    expect(rsvps[0].id).toBe(body.id);
    expect(rsvps[0].guestId).toBe(guest.id);
  });

  it("assigns the guest to the session's event", async () => {
    await POST(makeReq({ sessionId: session.id, guestId: guest.id }));
    const members = await getRepositories().guests.listByEvent(event.id);
    expect(members.map((g) => g.id)).toContain(guest.id);
  });

  it("is idempotent per session and guest", async () => {
    const first = await readJson(
      await POST(makeReq({ sessionId: session.id, guestId: guest.id }))
    );
    const res = await POST(
      makeReq({ sessionId: session.id, guestId: guest.id })
    );
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body.created).toBe(false);
    expect(body.id).toBe(first.id);
    expect(
      await getRepositories().rsvps.listBySession(session.id)
    ).toHaveLength(1);
  });

  it("returns 404 for an unknown session", async () => {
    const res = await POST(makeReq({ sessionId: "nope", guestId: guest.id }));
    expect(res.status).toBe(404);
  });

  it("returns 404 for an unknown guest", async () => {
    const res = await POST(makeReq({ sessionId: session.id, guestId: "nope" }));
    expect(res.status).toBe(404);
    expect(await getRepositories().rsvps.listBySession(session.id)).toEqual([]);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await POST(
      new Request("http://test/api/admin/create-rsvp", {
        method: "POST",
        body: "{not json",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects missing ids with 400", async () => {
    expect((await POST(makeReq({ guestId: guest.id }))).status).toBe(400);
    expect((await POST(makeReq({ sessionId: session.id }))).status).toBe(400);
  });

  it("rejects non-string ids with 400", async () => {
    expect(
      (await POST(makeReq({ sessionId: 1, guestId: guest.id }))).status
    ).toBe(400);
    expect(
      (await POST(makeReq({ sessionId: session.id, guestId: 1 }))).status
    ).toBe(400);
  });

  it("returns 409 when the session is full under a hard capacity limit", async () => {
    const cappedEvent = await createEvent({
      phase: "proposal",
      rsvpCapacityHardLimit: true,
    });
    const cappedSession = await createSession(cappedEvent.id, {
      capacity: 1,
    });
    const first = await createGuest();
    const second = await createGuest();

    const okRes = await POST(
      makeReq({ sessionId: cappedSession.id, guestId: first.id })
    );
    expect(okRes.status).toBe(201);

    const fullRes = await POST(
      makeReq({ sessionId: cappedSession.id, guestId: second.id })
    );
    expect(fullRes.status).toBe(409);
    expect(
      await getRepositories().rsvps.listBySession(cappedSession.id)
    ).toHaveLength(1);
  });

  it("re-adding an existing RSVP succeeds even at hard capacity", async () => {
    const cappedEvent = await createEvent({
      phase: "proposal",
      rsvpCapacityHardLimit: true,
    });
    const cappedSession = await createSession(cappedEvent.id, {
      capacity: 1,
    });
    const first = await createGuest();

    await POST(makeReq({ sessionId: cappedSession.id, guestId: first.id }));
    const res = await POST(
      makeReq({ sessionId: cappedSession.id, guestId: first.id })
    );
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body.created).toBe(false);
  });
});
