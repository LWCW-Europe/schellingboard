import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import type { Event, Guest, Session } from "@/db/repositories/interfaces";
import { getRepositories } from "@/db/container";
import { callThroughProxy } from "../helpers/through-proxy";
import { POST } from "@/app/api/admin/create-rsvp/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars
const PATH = "/api/admin/create-rsvp";

function post(rawBody: string, opts?: { authed?: boolean }): Promise<Response> {
  return callThroughProxy(POST, PATH, { method: "POST", body: rawBody }, opts);
}

function postJson(
  body: unknown,
  opts?: { authed?: boolean }
): Promise<Response> {
  return post(JSON.stringify(body), opts);
}

async function readJson(
  res: Response
): Promise<{ id: string; created: boolean }> {
  return (await res.json()) as { id: string; created: boolean };
}

describe("POST /api/admin/create-rsvp", () => {
  beforeAll(() => setupTestDb());

  let event: Event;
  let session: Session;
  let guest: Guest;

  beforeEach(async () => {
    resetTestDb();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    // Proposal phase on purpose: unlike toggle-rsvp, this route must work
    // in any phase.
    event = await createEvent({ phase: "proposal" });
    session = await createSession(event.id);
    guest = await createGuest();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("rejects the request without an admin cookie", async () => {
    const res = await postJson(
      { sessionId: session.id, guestId: guest.id },
      { authed: false }
    );
    expect(res.status).toBe(401);
    expect(await getRepositories().rsvps.listBySession(session.id)).toEqual([]);
  });

  it("creates an RSVP regardless of phase and returns its id", async () => {
    const res = await postJson({ sessionId: session.id, guestId: guest.id });
    expect(res.status).toBe(201);
    const body = await readJson(res);
    expect(body.created).toBe(true);

    const rsvps = await getRepositories().rsvps.listBySession(session.id);
    expect(rsvps).toHaveLength(1);
    expect(rsvps[0].id).toBe(body.id);
    expect(rsvps[0].guestId).toBe(guest.id);
  });

  it("assigns the guest to the session's event", async () => {
    await postJson({ sessionId: session.id, guestId: guest.id });
    const members = await getRepositories().guests.listByEvent(event.id);
    expect(members.map((g) => g.id)).toContain(guest.id);
  });

  it("is idempotent per session and guest", async () => {
    const first = await readJson(
      await postJson({ sessionId: session.id, guestId: guest.id })
    );
    const res = await postJson({ sessionId: session.id, guestId: guest.id });
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body.created).toBe(false);
    expect(body.id).toBe(first.id);
    expect(
      await getRepositories().rsvps.listBySession(session.id)
    ).toHaveLength(1);
  });

  it("returns 404 for an unknown session", async () => {
    const res = await postJson({ sessionId: "nope", guestId: guest.id });
    expect(res.status).toBe(404);
  });

  it("returns 404 for an unknown guest", async () => {
    const res = await postJson({ sessionId: session.id, guestId: "nope" });
    expect(res.status).toBe(404);
    expect(await getRepositories().rsvps.listBySession(session.id)).toEqual([]);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
  });

  it("rejects missing ids with 400", async () => {
    expect((await postJson({ guestId: guest.id })).status).toBe(400);
    expect((await postJson({ sessionId: session.id })).status).toBe(400);
  });

  it("rejects non-string ids with 400", async () => {
    expect((await postJson({ sessionId: 1, guestId: guest.id })).status).toBe(
      400
    );
    expect((await postJson({ sessionId: session.id, guestId: 1 })).status).toBe(
      400
    );
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

    const okRes = await postJson({
      sessionId: cappedSession.id,
      guestId: first.id,
    });
    expect(okRes.status).toBe(201);

    const fullRes = await postJson({
      sessionId: cappedSession.id,
      guestId: second.id,
    });
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

    await postJson({ sessionId: cappedSession.id, guestId: first.id });
    const res = await postJson({
      sessionId: cappedSession.id,
      guestId: first.id,
    });
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body.created).toBe(false);
  });
});
