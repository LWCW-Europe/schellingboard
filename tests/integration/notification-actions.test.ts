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

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { siteAuthenticate } from "../helpers/site-auth";
import { createGuest } from "../helpers/factories";
import { GUEST_COOKIE_NAME, openGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";
import { redirect } from "next/navigation";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
  openNotificationAction,
} from "@/app/actions/notifications";

async function notify(guestId: string) {
  return getRepositories().notifications.create({
    guestId,
    type: "sessionComment",
    text: "Anna commented on your session",
    url: "/e?viewSession=s1",
    createdAt: new Date(),
  });
}

describe("markNotificationReadAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);
  });

  it("marks the current user's notification read", async () => {
    const guest = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const notification = await notify(guest.id);

    const result = await markNotificationReadAction(notification.id);

    expect(result).toEqual({ ok: true });
    expect(await getRepositories().notifications.countUnread(guest.id)).toBe(0);
  });

  // The id travels in a link, so a guest could paste someone else's.
  it("refuses another guest's notification", async () => {
    const guest = await createGuest();
    const other = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(other.id));
    const notification = await notify(guest.id);

    const result = await markNotificationReadAction(notification.id);

    expect(result.ok).toBe(false);
    expect(await getRepositories().notifications.countUnread(guest.id)).toBe(1);
  });

  it("fails when no user is selected", async () => {
    const guest = await createGuest();
    const notification = await notify(guest.id);

    const result = await markNotificationReadAction(notification.id);

    expect(result.ok).toBe(false);
    expect(await getRepositories().notifications.countUnread(guest.id)).toBe(1);
  });
});

describe("markAllNotificationsReadAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);
  });

  it("clears the current user's unread count, and nobody else's", async () => {
    const guest = await createGuest();
    const other = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    await notify(guest.id);
    await notify(guest.id);
    await notify(other.id);

    const result = await markAllNotificationsReadAction();

    expect(result).toEqual({ ok: true });
    const { notifications } = getRepositories();
    expect(await notifications.countUnread(guest.id)).toBe(0);
    expect(await notifications.countUnread(other.id)).toBe(1);
  });

  it("fails when no user is selected", async () => {
    const guest = await createGuest();
    await notify(guest.id);

    const result = await markAllNotificationsReadAction();

    expect(result.ok).toBe(false);
    expect(await getRepositories().notifications.countUnread(guest.id)).toBe(1);
  });
});

describe("openNotificationAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.mocked(redirect).mockReset();
    await siteAuthenticate(cookieJar);
  });

  // Clicking a notification is the main way they are read, so the mark and the
  // navigation are one step rather than a fire-and-forget call racing a page
  // change.
  it("marks the notification read and sends the guest to what happened", async () => {
    const guest = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const notification = await notify(guest.id);

    await openNotificationAction(notification.id);

    expect(await getRepositories().notifications.countUnread(guest.id)).toBe(0);
    expect(redirect).toHaveBeenCalledExactlyOnceWith("/e?viewSession=s1");
  });

  it("neither marks nor redirects for another guest's notification", async () => {
    const guest = await createGuest();
    const other = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(other.id));
    const notification = await notify(guest.id);

    await openNotificationAction(notification.id);

    expect(await getRepositories().notifications.countUnread(guest.id)).toBe(1);
    expect(redirect).not.toHaveBeenCalled();
  });
});
