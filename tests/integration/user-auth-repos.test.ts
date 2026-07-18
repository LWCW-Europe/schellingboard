import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("guest auth protection (repository)", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("new guests are unprotected with no password", async () => {
    const guest = await createGuest();
    const creds = await getRepositories().guests.getAuthCredentials(guest.id);
    expect(creds).toEqual({ authProtected: false, passwordHash: null });
    const listed = (await getRepositories().guests.list()).find(
      (g) => g.id === guest.id
    );
    expect(listed?.authProtected).toBe(false);
  });

  it("enabling protection with a password hash is reflected everywhere public except the hash", async () => {
    const guest = await createGuest();
    const { guests } = getRepositories();
    const updated = await guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: "hash-value",
    });
    expect(updated).toBe(true);
    expect(await guests.getAuthCredentials(guest.id)).toEqual({
      authProtected: true,
      passwordHash: "hash-value",
    });
    const listed = (await guests.list()).find((g) => g.id === guest.id);
    expect(listed?.authProtected).toBe(true);
    // The hash must never appear on guest objects handed to the UI.
    expect(JSON.stringify(listed)).not.toContain("hash-value");
    const full = await guests.findById(guest.id);
    expect(JSON.stringify(full)).not.toContain("hash-value");
  });

  it("disabling protection clears the password hash", async () => {
    const guest = await createGuest();
    const { guests } = getRepositories();
    await guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: "hash-value",
    });
    await guests.setAuthProtection(guest.id, {
      authProtected: false,
      passwordHash: null,
    });
    expect(await guests.getAuthCredentials(guest.id)).toEqual({
      authProtected: false,
      passwordHash: null,
    });
  });

  it("returns null / false for an unknown guest", async () => {
    const { guests } = getRepositories();
    expect(await guests.getAuthCredentials("nope")).toBeNull();
    expect(
      await guests.setAuthProtection("nope", {
        authProtected: true,
        passwordHash: null,
      })
    ).toBe(false);
  });
});

describe("auth codes (repository)", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  const dates = {
    created: new Date("2026-07-18T12:00:00Z"),
    expires: new Date("2026-07-18T12:10:00Z"),
    beforeExpiry: new Date("2026-07-18T12:09:59Z"),
    afterExpiry: new Date("2026-07-18T12:10:01Z"),
  };

  it("stores a code and finds it while unexpired", async () => {
    const guest = await createGuest();
    const { authCodes } = getRepositories();
    await authCodes.replace({
      guestId: guest.id,
      salt: "salt1",
      codeHash: "abc",
      createdAt: dates.created,
      expiresAt: dates.expires,
    });
    const active = await authCodes.findActive(guest.id, dates.beforeExpiry);
    expect(active).toMatchObject({
      guestId: guest.id,
      salt: "salt1",
      codeHash: "abc",
      attempts: 0,
    });
    expect(active?.createdAt).toEqual(dates.created);
    expect(await authCodes.findActive(guest.id, dates.afterExpiry)).toBeNull();
  });

  it("replace invalidates the previous code", async () => {
    const guest = await createGuest();
    const { authCodes } = getRepositories();
    await authCodes.replace({
      guestId: guest.id,
      salt: "salt1",
      codeHash: "old",
      createdAt: dates.created,
      expiresAt: dates.expires,
    });
    await authCodes.replace({
      guestId: guest.id,
      salt: "salt2",
      codeHash: "new",
      createdAt: dates.created,
      expiresAt: dates.expires,
    });
    const active = await authCodes.findActive(guest.id, dates.beforeExpiry);
    expect(active?.codeHash).toBe("new");
  });

  it("records failed attempts", async () => {
    const guest = await createGuest();
    const { authCodes } = getRepositories();
    await authCodes.replace({
      guestId: guest.id,
      salt: "salt1",
      codeHash: "abc",
      createdAt: dates.created,
      expiresAt: dates.expires,
    });
    const first = await authCodes.findActive(guest.id, dates.beforeExpiry);
    await authCodes.recordFailedAttempt(first!.id);
    await authCodes.recordFailedAttempt(first!.id);
    const after = await authCodes.findActive(guest.id, dates.beforeExpiry);
    expect(after?.attempts).toBe(2);
  });
});
