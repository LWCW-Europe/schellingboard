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
import { createEvent } from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("events repo", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", "0123456789abcdef0123456789abcdef");
  });

  afterEach(() => vi.unstubAllEnvs());

  describe("update", () => {
    it("updates event fields", async () => {
      const event = await createEvent({ name: "Original" });
      const updated = await getRepositories().events.update(event.id, {
        name: "Updated",
        description: "New description",
      });
      expect(updated).toMatchObject({
        id: event.id,
        name: "Updated",
        description: "New description",
      });
      const fetched = await getRepositories().events.findById(event.id);
      expect(fetched?.name).toBe("Updated");
    });

    it("returns undefined for unknown id", async () => {
      const result = await getRepositories().events.update("no-such-id", {
        name: "X",
      });
      expect(result).toBeUndefined();
    });

    it("preserves unpatched fields", async () => {
      const event = await createEvent({ name: "Keep" });
      await getRepositories().events.update(event.id, {
        description: "Patched",
      });
      const fetched = await getRepositories().events.findById(event.id);
      expect(fetched?.name).toBe("Keep");
    });
  });
});
