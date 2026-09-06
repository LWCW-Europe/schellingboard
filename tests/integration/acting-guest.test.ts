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
import { createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import {
  GUEST_COOKIE_NAME,
  openGuestValue,
  verifiedGuestValue,
} from "../helpers/guest-cookie";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

function jar(value?: string) {
  return {
    get: (name: string) =>
      name === GUEST_COOKIE_NAME && value !== undefined ? { value } : undefined,
  };
}

describe("the acting guest", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("is the selected guest", async () => {
    const guest = await createGuest();

    expect(await verifiedCurrentUser(jar(openGuestValue(guest.id)))).toBe(
      guest.id
    );
  });

  it("is nobody when a protected name is selected without a verified session", async () => {
    const guest = await createGuest();
    await getRepositories().guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: null,
    });

    expect(await verifiedCurrentUser(jar(openGuestValue(guest.id)))).toBeNull();
  });

  it("is the protected guest a verified session names", async () => {
    const guest = await createGuest();
    const cookie = await verifiedGuestValue(guest.id);
    await getRepositories().guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: null,
    });

    expect(await verifiedCurrentUser(jar(cookie))).toBe(guest.id);
  });

  it("is nobody once the selected guest has been deleted", async () => {
    const guest = await createGuest();
    const cookie = openGuestValue(guest.id);
    await getRepositories().guests.delete(guest.id);

    expect(await verifiedCurrentUser(jar(cookie))).toBeNull();
  });

  it("is nobody when a verified session names a deleted guest", async () => {
    const guest = await createGuest();
    const cookie = await verifiedGuestValue(guest.id);
    await getRepositories().guests.delete(guest.id);

    expect(await verifiedCurrentUser(jar(cookie))).toBeNull();
  });

  it("tells a visitor whose guest was deleted to pick a name", async () => {
    const guest = await createGuest();
    const cookie = openGuestValue(guest.id);
    await getRepositories().guests.delete(guest.id);

    expect(await unverifiedUserMessage(jar(cookie), "commenting")).toMatch(
      /select who you are/i
    );
  });

  it("tells a visitor with an unverified protected name to switch to it", async () => {
    const guest = await createGuest();
    await getRepositories().guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: null,
    });

    expect(
      await unverifiedUserMessage(jar(openGuestValue(guest.id)), "commenting")
    ).toMatch(/protected/i);
  });
});
