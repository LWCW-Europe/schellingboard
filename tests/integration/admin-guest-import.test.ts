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
import { createEvent, createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import { importGuestsAction } from "@/app/actions/admin-guest-import";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("guests.findByEmails", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns guests matching any of the emails, case-insensitively", async () => {
    const g1 = await createGuest({ email: "Alice@Example.com" });
    await createGuest({ email: "bob@example.com" });
    const { guests } = getRepositories();

    const found = await guests.findByEmails(["alice@example.com"]);
    expect(found.map((g) => g.id)).toEqual([g1.id]);
  });

  it("returns [] for an empty input", async () => {
    const { guests } = getRepositories();
    expect(await guests.findByEmails([])).toEqual([]);
  });
});

describe("guests.importAndAssign", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("rolls back created guests when assignment fails partway through", async () => {
    const { guests } = getRepositories();

    await expect(
      guests.importAndAssign(
        [
          { name: "Alice", email: "alice@example.com" },
          { name: "Bob", email: "bob@example.com" },
        ],
        // No event with this id exists, so the event_guests insert violates
        // its foreign key constraint partway through the transaction.
        ["no-such-event"]
      )
    ).rejects.toThrow();

    expect(await guests.list()).toHaveLength(0);
  });
});

describe("importGuestsAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("creates new users from CSV", async () => {
    const result = await importGuestsAction({
      csvText: "name,email\nAlice,alice@example.com\nBob,bob@example.com\n",
      eventIds: [],
    });
    expect(result).toEqual({ ok: true, created: 2, existing: 0 });

    const { guests } = getRepositories();
    const alice = await guests.findByEmail("alice@example.com");
    expect(alice?.name).toBe("Alice");
    const bob = await guests.findByEmail("bob@example.com");
    expect(bob?.name).toBe("Bob");
  });

  it("skips existing users (matched by email, case-insensitive) without modifying them", async () => {
    const existing = await createGuest({
      name: "Original Name",
      email: "Alice@Example.com",
    });

    const result = await importGuestsAction({
      csvText: "name,email\nNew Name,alice@example.com\nBob,bob@example.com\n",
      eventIds: [],
    });
    expect(result).toEqual({ ok: true, created: 1, existing: 1 });

    const { guests } = getRepositories();
    const unchanged = await guests.findById(existing.id);
    expect(unchanged?.name).toBe("Original Name");
    expect(unchanged?.info.email).toBe("Alice@Example.com");
  });

  it("assigns both new and existing users to the selected events", async () => {
    const event1 = await createEvent();
    const event2 = await createEvent();
    const existing = await createGuest({ email: "alice@example.com" });

    const result = await importGuestsAction({
      csvText: "name,email\nAlice,alice@example.com\nBob,bob@example.com\n",
      eventIds: [event1.id, event2.id],
    });
    expect(result).toEqual({ ok: true, created: 1, existing: 1 });

    const { guests } = getRepositories();
    for (const event of [event1, event2]) {
      const assigned = await guests.listByEvent(event.id);
      expect(assigned).toHaveLength(2);
      expect(assigned.map((g) => g.id)).toContain(existing.id);
    }
  });

  it("re-running the same import is idempotent", async () => {
    const event = await createEvent();
    const csvText = "name,email\nAlice,alice@example.com\n";

    await importGuestsAction({ csvText, eventIds: [event.id] });
    const result = await importGuestsAction({ csvText, eventIds: [event.id] });
    expect(result).toEqual({ ok: true, created: 0, existing: 1 });

    const { guests } = getRepositories();
    const all = await guests.list();
    expect(all).toHaveLength(1);
    const assigned = await guests.listByEvent(event.id);
    expect(assigned).toHaveLength(1);
  });

  it("rejects the whole file on validation errors and imports nothing", async () => {
    const result = await importGuestsAction({
      csvText: "name,email\nAlice,alice@example.com\nBob,broken\n",
      eventIds: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.lineErrors).toHaveLength(1);
      expect(result.lineErrors?.[0]).toMatch(/line 3/i);
    }

    const { guests } = getRepositories();
    expect(await guests.list()).toHaveLength(0);
  });

  it("errors for an unknown event without importing", async () => {
    const result = await importGuestsAction({
      csvText: "name,email\nAlice,alice@example.com\n",
      eventIds: ["no-such-event"],
    });
    expect(!result.ok && result.error).toBe("Event not found");

    const { guests } = getRepositories();
    expect(await guests.list()).toHaveLength(0);
  });

  it("rejects when not authenticated", async () => {
    cookieJar.clear();
    const result = await importGuestsAction({
      csvText: "name,email\nAlice,alice@example.com\n",
      eventIds: [],
    });
    expect(!result.ok && result.error).toBe("Unauthorized");
  });
});
