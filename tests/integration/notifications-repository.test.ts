import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";

// Read time is passed in rather than taken from the wall clock, so the dev
// fake clock reaches these rows like every other timestamp in the app.
const READ_AT = new Date("2026-09-13T12:00:00.000Z");

async function notify(
  guestId: string,
  opts?: { text?: string; url?: string; createdAt?: Date }
) {
  return getRepositories().notifications.create({
    guestId,
    type: "sessionComment",
    text: opts?.text ?? "Someone commented on your session",
    url: opts?.url ?? "/event?viewSession=s1",
    createdAt: opts?.createdAt ?? new Date(),
  });
}

describe("notifications repository", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("stores a notification unread, and lists it for its guest", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();

    const created = await notify(guest.id, { text: "Anna commented" });

    expect(created.readAt).toBeUndefined();
    const listed = await notifications.listByGuest(guest.id);
    expect(listed.map((n) => n.text)).toEqual(["Anna commented"]);
    expect(listed[0].url).toBe("/event?viewSession=s1");
    expect(listed[0].type).toBe("sessionComment");
  });

  it("lists newest first and never leaks another guest's notifications", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();
    const other = await createGuest();

    await notify(guest.id, {
      text: "older",
      createdAt: new Date("2026-08-01T10:00:00Z"),
    });
    await notify(guest.id, {
      text: "newer",
      createdAt: new Date("2026-08-02T10:00:00Z"),
    });
    await notify(other.id, { text: "not yours" });

    const listed = await notifications.listByGuest(guest.id);
    expect(listed.map((n) => n.text)).toEqual(["newer", "older"]);
  });

  it("pages through with a limit and an offset", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();
    for (let i = 0; i < 5; i++) {
      await notify(guest.id, {
        text: `n${i}`,
        createdAt: new Date(Date.UTC(2026, 7, 1, 10, i)),
      });
    }

    const first = await notifications.listByGuest(guest.id, { limit: 2 });
    const second = await notifications.listByGuest(guest.id, {
      limit: 2,
      offset: 2,
    });

    expect(first.map((n) => n.text)).toEqual(["n4", "n3"]);
    expect(second.map((n) => n.text)).toEqual(["n2", "n1"]);
  });

  it("counts everything a guest has, for paging", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();
    const other = await createGuest();
    await notify(guest.id);
    await notify(guest.id, { url: "/other" });
    await notify(other.id);

    expect(await notifications.countByGuest(guest.id)).toBe(2);
    expect(await notifications.countByGuest(other.id)).toBe(1);
  });

  it("counts what is unread, per guest", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();
    const other = await createGuest();
    await notify(guest.id);
    await notify(guest.id);
    await notify(other.id);

    expect(await notifications.countUnread(guest.id)).toBe(2);
    expect(await notifications.countUnread(other.id)).toBe(1);
  });

  it("marks one read, which is what clicking it does", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();
    const created = await notify(guest.id);

    const marked = await notifications.markRead(guest.id, created.id, READ_AT);

    expect(marked).toBe(true);
    expect(await notifications.countUnread(guest.id)).toBe(0);
    const [listed] = await notifications.listByGuest(guest.id);
    expect(listed.readAt).toBeInstanceOf(Date);
  });

  // The row id travels in a link, so ownership is enforced in the store rather
  // than trusted from the caller.
  it("refuses to mark another guest's notification read", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();
    const other = await createGuest();
    const created = await notify(guest.id);

    const marked = await notifications.markRead(other.id, created.id, READ_AT);

    expect(marked).toBe(false);
    expect(await notifications.countUnread(guest.id)).toBe(1);
  });

  it("marks everything read at once, leaving other guests alone", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();
    const other = await createGuest();
    await notify(guest.id);
    await notify(guest.id);
    await notify(other.id);

    await notifications.markAllRead(guest.id, READ_AT);

    expect(await notifications.countUnread(guest.id)).toBe(0);
    expect(await notifications.countUnread(other.id)).toBe(1);
  });

  it("stores the read time it was given, not the wall clock", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();
    const created = await notify(guest.id);

    await notifications.markRead(guest.id, created.id, READ_AT);

    const [listed] = await notifications.listByGuest(guest.id);
    expect(listed.readAt).toEqual(READ_AT);
  });

  // The link is handed to redirect() when the notification is opened, so an
  // absolute URL would be an off-site redirect. Every producer builds a path.
  it("refuses a link that leaves the site", async () => {
    const guest = await createGuest();

    await expect(
      notify(guest.id, { url: "https://elsewhere.example/phish" })
    ).rejects.toThrow(/site-relative/i);
    // Protocol-relative and backslash forms start with "/" but browsers
    // resolve them as absolute URLs to another host.
    await expect(
      notify(guest.id, { url: "//elsewhere.example/phish" })
    ).rejects.toThrow(/site-relative/i);
    await expect(
      notify(guest.id, { url: "/\\elsewhere.example/phish" })
    ).rejects.toThrow(/site-relative/i);
  });

  it("finds one by id, scoped to its guest", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();
    const other = await createGuest();
    const created = await notify(guest.id, { text: "for the owner" });

    expect((await notifications.findForGuest(guest.id, created.id))?.text).toBe(
      "for the owner"
    );
    expect(
      await notifications.findForGuest(other.id, created.id)
    ).toBeUndefined();
  });

  it("keeps an already-read notification's timestamp when marked again", async () => {
    const { notifications } = getRepositories();
    const guest = await createGuest();
    const created = await notify(guest.id);
    await notifications.markRead(guest.id, created.id, READ_AT);
    const [first] = await notifications.listByGuest(guest.id);

    await notifications.markRead(guest.id, created.id, READ_AT);

    const [again] = await notifications.listByGuest(guest.id);
    expect(again.readAt).toEqual(first.readAt);
  });
});
