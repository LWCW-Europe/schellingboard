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
import { getRepositories } from "@/db/container";
import { callThroughProxy } from "../helpers/through-proxy";
import { GET } from "@/app/api/admin/users/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars
const PATH = "/api/admin/users";

type User = { id: string; name: string; email: string };

function get(opts?: { authed?: boolean }): Promise<Response> {
  return callThroughProxy(GET, PATH, {}, opts);
}

async function readUsers(res: Response): Promise<User[]> {
  return ((await res.json()) as { users: User[] }).users;
}

describe("GET /api/admin/users", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("rejects the request without an admin cookie", async () => {
    const res = await get({ authed: false });
    expect(res.status).toBe(401);
  });

  it("returns an empty list when there are no users", async () => {
    const res = await get();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await readUsers(res)).toEqual([]);
  });

  it("returns every user with id, name and email", async () => {
    const { guests } = getRepositories();
    const anna = await guests.create({
      name: "Anna Beck",
      info: { email: "anna@foocorp.com" },
    });
    const tom = await guests.create({
      name: "Tom Tailor",
      info: { email: "tom@foocorp.com" },
    });

    const res = await get();
    expect(res.status).toBe(200);
    const users = await readUsers(res);

    expect(users).toHaveLength(2);
    const byId = new Map(users.map((u) => [u.id, u]));
    expect(byId.get(anna.id)).toEqual({
      id: anna.id,
      name: "Anna Beck",
      email: "anna@foocorp.com",
    });
    expect(byId.get(tom.id)).toEqual({
      id: tom.id,
      name: "Tom Tailor",
      email: "tom@foocorp.com",
    });
  });

  it("returns a structured 500 when the repository throws", async () => {
    const { guests } = getRepositories();
    vi.spyOn(guests, "listFull").mockRejectedValue(new Error("db down"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await get();
    expect(res.status).toBe(500);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({ error: "Failed to fetch users" });
  });
});
