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
import { createEvent, createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import { POST } from "@/app/api/admin/create-proposal/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

function makeReq(body: unknown): Request {
  return new Request("http://test/api/admin/create-proposal", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("POST /api/admin/create-proposal", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("rejects the request without an admin cookie", async () => {
    cookieJar.clear();
    const event = await createEvent({ phase: "voting" });
    const res = await POST(
      makeReq({ eventSlug: event.slug, title: "T", hostIds: [] })
    );
    expect(res.status).toBe(401);
  });

  it("creates a proposal with hosts and duration, returning its id", async () => {
    const event = await createEvent({ phase: "voting" });
    const host = await createGuest();
    const res = await POST(
      makeReq({
        eventSlug: event.slug,
        title: "Prompt engineering basics",
        description: "hands-on intro",
        durationMinutes: 45,
        hostIds: [host.id],
      })
    );
    expect(res.status).toBe(200);
    const { id } = (await res.json()) as { id: string };

    const proposal = await getRepositories().sessionProposals.findById(id);
    expect(proposal?.title).toBe("Prompt engineering basics");
    expect(proposal?.durationMinutes).toBe(45);
    expect(proposal?.hosts.map((h) => h.id)).toEqual([host.id]);
  });

  it("assigns the hosts to the event", async () => {
    const event = await createEvent({ phase: "voting" });
    const host = await createGuest();
    await POST(
      makeReq({ eventSlug: event.slug, title: "T", hostIds: [host.id] })
    );
    const members = await getRepositories().guests.listByEvent(event.id);
    expect(members.map((g) => g.id)).toContain(host.id);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await POST(
      new Request("http://test/api/admin/create-proposal", {
        method: "POST",
        body: "{not json",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects a missing title with 400", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await POST(
      makeReq({ eventSlug: event.slug, title: "  ", hostIds: [] })
    );
    expect(res.status).toBe(400);
  });

  it("rejects an unknown host id with 400", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await POST(
      makeReq({ eventSlug: event.slug, title: "T", hostIds: ["nope"] })
    );
    expect(res.status).toBe(400);
  });

  it("rejects a non-string title with 400", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await POST(
      makeReq({ eventSlug: event.slug, title: 123, hostIds: [] })
    );
    expect(res.status).toBe(400);
  });

  it("rejects a non-string description with 400", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await POST(
      makeReq({
        eventSlug: event.slug,
        title: "T",
        description: 123,
        hostIds: [],
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects a non-array hostIds with 400", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await POST(
      makeReq({ eventSlug: event.slug, title: "T", hostIds: "nope" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown eventSlug", async () => {
    const res = await POST(
      makeReq({ eventSlug: "does-not-exist", title: "T", hostIds: [] })
    );
    expect(res.status).toBe(404);
  });
});
