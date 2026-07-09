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
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import { GET } from "@/app/api/admin/users/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

type User = { id: string; name: string; email: string };

async function readUsers(res: Response): Promise<User[]> {
  return ((await res.json()) as { users: User[] }).users;
}

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("GET /api/admin/users", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("rejects the request without an admin cookie", async () => {
    cookieJar.clear();
    const res = await GET();
    expect(res.status).toBe(401);
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("returns an empty list when there are no users", async () => {
    const res = await GET();
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

    const res = await GET();
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

    const res = await GET();
    expect(res.status).toBe(500);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({ error: "Failed to fetch users" });
  });
});
