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
import {
  assignGuestsToEventAction,
  removeGuestsFromEventAction,
} from "@/app/actions/admin-guest-events";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("guests.assignToEvent / removeFromEvent", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("assigns guests to an event", async () => {
    const event = await createEvent();
    const g1 = await createGuest();
    const g2 = await createGuest();
    const repos = getRepositories();

    await repos.guests.assignToEvent(event.id, [g1.id, g2.id]);

    const assigned = await repos.guests.listByEvent(event.id);
    expect(assigned.map((g) => g.id).sort()).toEqual([g1.id, g2.id].sort());
  });

  it("is idempotent — re-assigning already-assigned guests does not error", async () => {
    const event = await createEvent();
    const g1 = await createGuest();
    const repos = getRepositories();

    await repos.guests.assignToEvent(event.id, [g1.id]);
    await repos.guests.assignToEvent(event.id, [g1.id]); // no error

    const assigned = await repos.guests.listByEvent(event.id);
    expect(assigned).toHaveLength(1);
  });

  it("removes guests from an event", async () => {
    const event = await createEvent();
    const g1 = await createGuest();
    const g2 = await createGuest();
    const repos = getRepositories();

    await repos.guests.assignToEvent(event.id, [g1.id, g2.id]);
    await repos.guests.removeFromEvent(event.id, [g1.id]);

    const assigned = await repos.guests.listByEvent(event.id);
    expect(assigned.map((g) => g.id)).toEqual([g2.id]);
  });

  it("removeFromEvent is a no-op for unassigned guests", async () => {
    const event = await createEvent();
    const g1 = await createGuest();
    const repos = getRepositories();

    await repos.guests.removeFromEvent(event.id, [g1.id]); // no error
    const assigned = await repos.guests.listByEvent(event.id);
    expect(assigned).toHaveLength(0);
  });
});

describe("assignGuestsToEventAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("assigns guests to an event", async () => {
    const event = await createEvent();
    const g1 = await createGuest();
    const g2 = await createGuest();

    const result = await assignGuestsToEventAction({
      eventId: event.id,
      guestIds: [g1.id, g2.id],
    });
    expect(result.ok).toBe(true);

    const assigned = await getRepositories().guests.listByEvent(event.id);
    expect(assigned.map((g) => g.id).sort()).toEqual([g1.id, g2.id].sort());
  });

  it("rejects when not authenticated", async () => {
    const event = await createEvent();
    const g1 = await createGuest();
    cookieJar.clear();

    const result = await assignGuestsToEventAction({
      eventId: event.id,
      guestIds: [g1.id],
    });
    expect(!result.ok && result.error).toBe("Unauthorized");
  });

  it("errors for unknown event", async () => {
    const g1 = await createGuest();
    const result = await assignGuestsToEventAction({
      eventId: "no-such-event",
      guestIds: [g1.id],
    });
    expect(!result.ok && result.error).toBe("Event not found");
  });

  it("errors for unknown guest", async () => {
    const event = await createEvent();
    const result = await assignGuestsToEventAction({
      eventId: event.id,
      guestIds: ["no-such-guest"],
    });
    expect(!result.ok && result.error).toBe("Guest not found");
  });

  it("accepts duplicate guest ids", async () => {
    const event = await createEvent();
    const g1 = await createGuest();

    const result = await assignGuestsToEventAction({
      eventId: event.id,
      guestIds: [g1.id, g1.id],
    });
    expect(result.ok).toBe(true);

    const assigned = await getRepositories().guests.listByEvent(event.id);
    expect(assigned.map((g) => g.id)).toEqual([g1.id]);
  });
});

describe("removeGuestsFromEventAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("removes guests from an event", async () => {
    const event = await createEvent();
    const g1 = await createGuest();
    const g2 = await createGuest();
    const repos = getRepositories();
    await repos.guests.assignToEvent(event.id, [g1.id, g2.id]);

    const result = await removeGuestsFromEventAction({
      eventId: event.id,
      guestIds: [g1.id],
    });
    expect(result.ok).toBe(true);

    const assigned = await repos.guests.listByEvent(event.id);
    expect(assigned.map((g) => g.id)).toEqual([g2.id]);
  });

  it("rejects when not authenticated", async () => {
    const event = await createEvent();
    const g1 = await createGuest();
    cookieJar.clear();

    const result = await removeGuestsFromEventAction({
      eventId: event.id,
      guestIds: [g1.id],
    });
    expect(!result.ok && result.error).toBe("Unauthorized");
  });

  it("errors for unknown event", async () => {
    const g1 = await createGuest();
    const result = await removeGuestsFromEventAction({
      eventId: "no-such-event",
      guestIds: [g1.id],
    });
    expect(!result.ok && result.error).toBe("Event not found");
  });
});
