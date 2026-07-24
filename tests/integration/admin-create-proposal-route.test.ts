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
import { createEvent, createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { callThroughProxy } from "../helpers/through-proxy";
import { POST } from "@/app/api/admin/create-proposal/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars
const PATH = "/api/admin/create-proposal";

function post(rawBody: string, opts?: { authed?: boolean }): Promise<Response> {
  return callThroughProxy(POST, PATH, { method: "POST", body: rawBody }, opts);
}

function postJson(
  body: unknown,
  opts?: { authed?: boolean }
): Promise<Response> {
  return post(JSON.stringify(body), opts);
}

describe("POST /api/admin/create-proposal", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("rejects the request without an admin cookie", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await postJson(
      { eventSlug: event.slug, title: "T", hostIds: [] },
      { authed: false }
    );
    expect(res.status).toBe(401);
  });

  it("creates a proposal with hosts and duration, returning its id", async () => {
    const event = await createEvent({ phase: "voting" });
    const host = await createGuest();
    const res = await postJson({
      eventSlug: event.slug,
      title: "Prompt engineering basics",
      description: "hands-on intro",
      durationMinutes: 45,
      hostIds: [host.id],
    });
    expect(res.status).toBe(201);
    const { id } = (await res.json()) as { id: string };

    const proposal = await getRepositories().sessionProposals.findById(id);
    expect(proposal?.title).toBe("Prompt engineering basics");
    expect(proposal?.durationMinutes).toBe(45);
    expect(proposal?.hosts.map((h) => h.id)).toEqual([host.id]);
  });

  it("assigns the hosts to the event", async () => {
    const event = await createEvent({ phase: "voting" });
    const host = await createGuest();
    await postJson({ eventSlug: event.slug, title: "T", hostIds: [host.id] });
    const members = await getRepositories().guests.listByEvent(event.id);
    expect(members.map((g) => g.id)).toContain(host.id);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
  });

  it("rejects a missing title with 400", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await postJson({
      eventSlug: event.slug,
      title: "  ",
      hostIds: [],
    });
    expect(res.status).toBe(400);
  });

  it("rejects an unknown host id with 400", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await postJson({
      eventSlug: event.slug,
      title: "T",
      hostIds: ["nope"],
    });
    expect(res.status).toBe(400);
  });

  it("rejects a non-string title with 400", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await postJson({
      eventSlug: event.slug,
      title: 123,
      hostIds: [],
    });
    expect(res.status).toBe(400);
  });

  it("rejects a non-string description with 400", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await postJson({
      eventSlug: event.slug,
      title: "T",
      description: 123,
      hostIds: [],
    });
    expect(res.status).toBe(400);
  });

  it("rejects a non-array hostIds with 400", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await postJson({
      eventSlug: event.slug,
      title: "T",
      hostIds: "nope",
    });
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown eventSlug", async () => {
    const res = await postJson({
      eventSlug: "does-not-exist",
      title: "T",
      hostIds: [],
    });
    expect(res.status).toBe(404);
  });
});
