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

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { siteAuthenticate } from "../helpers/site-auth";
import { createGuest } from "../helpers/factories";
import { GUEST_COOKIE_NAME, openGuestValue } from "../helpers/guest-cookie";
import { TIME_OFFSET_COOKIE } from "@/utils/dev-clock";
import { getRepositories } from "@/db/container";
import { redirect } from "next/navigation";
import {
  deleteNotificationsAction,
  markNotificationsReadAction,
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

describe("markNotificationsReadAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);
  });

  it("marks the selected notifications read, and leaves the rest unread", async () => {
    const guest = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const first = await notify(guest.id);
    await notify(guest.id);

    const result = await markNotificationsReadAction([first.id]);

    expect(result).toEqual({ ok: true });
    expect(await getRepositories().notifications.countUnread(guest.id)).toBe(1);
  });

  // The ids travel to the browser, so a guest could send back someone else's.
  it("skips another guest's notification", async () => {
    const guest = await createGuest();
    const other = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(other.id));
    const notification = await notify(guest.id);

    const result = await markNotificationsReadAction([notification.id]);

    expect(result).toEqual({ ok: true });
    expect(await getRepositories().notifications.countUnread(guest.id)).toBe(1);
  });

  it("fails when no user is selected", async () => {
    const guest = await createGuest();
    const notification = await notify(guest.id);

    const result = await markNotificationsReadAction([notification.id]);

    expect(result.ok).toBe(false);
    expect(await getRepositories().notifications.countUnread(guest.id)).toBe(1);
  });
});

describe("deleteNotificationsAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);
  });

  it("deletes the selected notifications, and leaves the rest", async () => {
    const guest = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const first = await notify(guest.id);
    await notify(guest.id);

    const result = await deleteNotificationsAction([first.id]);

    expect(result).toEqual({ ok: true });
    expect(await getRepositories().notifications.countByGuest(guest.id)).toBe(
      1
    );
  });

  it("skips another guest's notification", async () => {
    const guest = await createGuest();
    const other = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(other.id));
    const notification = await notify(guest.id);

    const result = await deleteNotificationsAction([notification.id]);

    expect(result).toEqual({ ok: true });
    expect(await getRepositories().notifications.countByGuest(guest.id)).toBe(
      1
    );
  });

  it("fails when no user is selected", async () => {
    const guest = await createGuest();
    const notification = await notify(guest.id);

    const result = await deleteNotificationsAction([notification.id]);

    expect(result.ok).toBe(false);
    expect(await getRepositories().notifications.countByGuest(guest.id)).toBe(
      1
    );
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

// The actions read the clock through serverNow(), so a time-travelled session
// stamps its reads with the same offset everything else in the app uses.
describe("the dev fake clock reaches read timestamps", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);
    vi.stubEnv("SB_ENABLE_DEV_TOOLS", "1");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("stamps a read with the offset the toolbar is holding", async () => {
    const guest = await createGuest();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const notification = await notify(guest.id);
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    cookieJar.set(TIME_OFFSET_COOKIE, String(threeDays));

    await markNotificationsReadAction([notification.id]);

    const [listed] = await getRepositories().notifications.listByGuest(
      guest.id
    );
    const shift = listed.readAt!.getTime() - Date.now();
    expect(shift).toBeGreaterThan(threeDays - 60_000);
  });
});
