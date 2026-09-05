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
import {
  pushEnabledHereAction,
  subscribeToPushAction,
  unsubscribeFromPushAction,
} from "@/app/actions/push";

const DEVICE = {
  endpoint: "https://push.example/this-phone",
  p256dh:
    "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM",
  auth: "tBHItJI5svbpez7KI4CCXg",
};

async function actAs(guestId: string) {
  await siteAuthenticate(cookieJar);
  cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guestId));
}

describe("push subscription actions", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
  });

  it("records the device against the guest who turned it on", async () => {
    const guest = await createGuest();
    await actAs(guest.id);

    const result = await subscribeToPushAction(DEVICE);

    expect(result).toEqual({ ok: true });
    const saved = await getRepositories().push.listSubscriptions(guest.id);
    expect(saved).toHaveLength(1);
    expect(saved[0].endpoint).toBe(DEVICE.endpoint);
  });

  it("forgets the device again when it is turned off", async () => {
    const guest = await createGuest();
    await actAs(guest.id);
    await subscribeToPushAction(DEVICE);

    const result = await unsubscribeFromPushAction(DEVICE.endpoint);

    expect(result).toEqual({ ok: true });
    expect(await getRepositories().push.listSubscriptions(guest.id)).toEqual(
      []
    );
  });

  it("answers whether this browser's subscription is the current guest's", async () => {
    const mine = await createGuest();
    const theirs = await createGuest();
    await actAs(mine.id);
    await subscribeToPushAction(DEVICE);

    expect(await pushEnabledHereAction(DEVICE.endpoint)).toBe(true);

    // The same phone, after someone else picked their name on it: the browser
    // still holds a subscription, but it is not this guest's any more.
    await actAs(theirs.id);
    expect(await pushEnabledHereAction(DEVICE.endpoint)).toBe(false);
  });

  it("refuses to turn notifications on for nobody", async () => {
    await siteAuthenticate(cookieJar);

    await expect(subscribeToPushAction(DEVICE)).rejects.toThrow();
  });

  it("refuses a caller without site auth", async () => {
    const guest = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));

    await expect(subscribeToPushAction(DEVICE)).rejects.toThrow(
      "Not authenticated"
    );
  });

  it("rejects a subscription that is not a real endpoint", async () => {
    const guest = await createGuest();
    await actAs(guest.id);

    const result = await subscribeToPushAction({
      ...DEVICE,
      endpoint: "not-a-url",
    });

    expect(result.ok).toBe(false);
    expect(await getRepositories().push.listSubscriptions(guest.id)).toEqual(
      []
    );
  });

  // Deleting by endpoint alone would let anyone who learns one silence its
  // owner's phone.
  it("will not turn off a device belonging to someone else", async () => {
    const owner = await createGuest();
    const other = await createGuest();
    await actAs(owner.id);
    await subscribeToPushAction(DEVICE);

    await actAs(other.id);
    await unsubscribeFromPushAction(DEVICE.endpoint);

    expect(
      await getRepositories().push.listSubscriptions(owner.id)
    ).toHaveLength(1);
  });
});
