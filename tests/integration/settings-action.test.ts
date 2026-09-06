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
import { siteAuthenticate } from "../helpers/site-auth";
import { createGuest } from "../helpers/factories";
import { GUEST_COOKIE_NAME, openGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";
import { DEFAULT_EMAIL_SETTINGS } from "@/db/repositories/interfaces";
import { updateEmailSettingsAction } from "@/app/actions/settings";

describe("updateEmailSettingsAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);
  });

  it("updates the current user's email settings", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const settings = {
      rsvpChange: false,
      hostChange: false,
      cohostAdd: true,
      proposalComment: false,
      sessionComment: false,
      profileComment: true,
      commentThread: true,
      meetingRequest: false,
      meetingResponse: true,
      sessionHeadsUp: false,
      attendeeCountReminder: false,
    };
    const result = await updateEmailSettingsAction(settings);
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    expect(updated?.info.emailSettings).toEqual(settings);
  });

  it("defaults both host reminders on and round-trips them independently", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const { guests } = getRepositories();
    const reminders = async () => {
      const settings = (await guests.findById(guest.id))?.info.emailSettings;
      return {
        sessionHeadsUp: settings?.sessionHeadsUp,
        attendeeCountReminder: settings?.attendeeCountReminder,
      };
    };
    expect(await reminders()).toEqual({
      sessionHeadsUp: true,
      attendeeCountReminder: true,
    });

    await updateEmailSettingsAction({
      ...DEFAULT_EMAIL_SETTINGS,
      attendeeCountReminder: false,
    });
    expect(await reminders()).toEqual({
      sessionHeadsUp: true,
      attendeeCountReminder: false,
    });

    await updateEmailSettingsAction({
      ...DEFAULT_EMAIL_SETTINGS,
      sessionHeadsUp: false,
    });
    expect(await reminders()).toEqual({
      sessionHeadsUp: false,
      attendeeCountReminder: true,
    });
  });

  it("rejects a payload missing the attendee-count reminder key", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    // The old five-key shape. A required boolean like its siblings, so a stale
    // form is rejected rather than silently defaulted.
    const result = await updateEmailSettingsAction({
      rsvpChange: false,
      hostChange: false,
      cohostAdd: false,
      proposalComment: false,
      commentThread: false,
    } as never);
    expect(result.ok).toBe(false);
    const unchanged = await getRepositories().guests.findById(guest.id);
    expect(unchanged?.info.emailSettings).toEqual(DEFAULT_EMAIL_SETTINGS);
  });

  it("fails when no user is selected", async () => {
    const guest = await createGuest({ name: "Guest" });
    const result = await updateEmailSettingsAction({
      rsvpChange: false,
      hostChange: false,
      cohostAdd: false,
      proposalComment: false,
      sessionComment: false,
      profileComment: false,
      commentThread: false,
      meetingRequest: false,
      meetingResponse: false,
      sessionHeadsUp: false,
      attendeeCountReminder: false,
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
