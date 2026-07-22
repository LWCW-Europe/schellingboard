import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";

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
import { createGuest } from "../helpers/factories";
import { GUEST_COOKIE_NAME, openGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";
import { DEFAULT_EMAIL_SETTINGS } from "@/db/repositories/interfaces";
import { updateEmailSettingsAction } from "@/app/actions/settings";

describe("updateEmailSettingsAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
  });

  it("updates the current user's email settings", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateEmailSettingsAction({
      rsvpChange: false,
      hostChange: false,
      cohostAdd: true,
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    expect(updated?.info.emailSettings).toEqual({
      rsvpChange: false,
      hostChange: false,
      cohostAdd: true,
    });
  });

  it("fails when no user is selected", async () => {
    const guest = await createGuest({ name: "Guest" });
    const result = await updateEmailSettingsAction({
      rsvpChange: false,
      hostChange: false,
      cohostAdd: false,
    });
    expect(result).toEqual({ ok: false, error: "No user is logged in" });
    const unchanged = await getRepositories().guests.findById(guest.id);
    expect(unchanged?.info.emailSettings).toEqual(DEFAULT_EMAIL_SETTINGS);
  });

  it("rejects an invalid payload", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    // A payload the typed signature can't produce; simulates a hand-crafted
    // request hitting the server action directly.
    const result = await updateEmailSettingsAction({
      rsvpChange: "yes",
    } as never);
    expect(result.ok).toBe(false);
    const unchanged = await getRepositories().guests.findById(guest.id);
    expect(unchanged?.info.emailSettings).toEqual(DEFAULT_EMAIL_SETTINGS);
  });
});
