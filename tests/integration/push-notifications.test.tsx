import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";

vi.mock("@/utils/mailer", () => ({ sendMail: vi.fn() }));
vi.mock("web-push", () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn(),
    generateVAPIDKeys: vi.fn(() => ({
      publicKey: `public-${++generated}`,
      privateKey: `private-${generated}`,
    })),
  },
}));

let generated = 0;

import webpush from "web-push";
import { setupTestDb, resetTestDb } from "../helpers/db";
import { createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { sendMail } from "@/utils/mailer";
import { notifyGuest } from "@/utils/notifications";

const MESSAGE = {
  subject: "Session moved",
  body: <p>Your session moved.</p>,
};
const NOW = new Date("2026-08-01T12:00:00.000Z");
const IN_APP = {
  text: "Your session moved",
  url: "/e?viewSession=s1",
  at: NOW,
};

async function subscribe(guestId: string, endpoint: string) {
  return getRepositories().push.saveSubscription({
    guestId,
    endpoint,
    p256dh: `p256dh-for-${endpoint}`,
    auth: `auth-for-${endpoint}`,
    createdAt: NOW,
  });
}

function payloadOf(call: unknown[]): {
  title: string;
  body: string;
  url: string;
} {
  return JSON.parse(call[1] as string) as {
    title: string;
    body: string;
    url: string;
  };
}

describe("push notifications", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.mocked(sendMail).mockClear();
    vi.mocked(webpush.sendNotification).mockReset();
    vi.mocked(webpush.sendNotification).mockResolvedValue(
      {} as Awaited<ReturnType<typeof webpush.sendNotification>>
    );
  });

  it("reaches every device the guest has subscribed", async () => {
    const guest = await createGuest({ emailSettings: { rsvpChange: true } });
    await subscribe(guest.id, "https://push.example/phone");
    await subscribe(guest.id, "https://push.example/laptop");

    await notifyGuest(guest.id, "rsvpChange", MESSAGE, IN_APP);

    const calls = vi.mocked(webpush.sendNotification).mock.calls;
    expect(calls).toHaveLength(2);
    expect(calls.map((c) => (c[0] as { endpoint: string }).endpoint)).toEqual(
      expect.arrayContaining([
        "https://push.example/phone",
        "https://push.example/laptop",
      ])
    );
    expect(payloadOf(calls[0]).body).toBe("Your session moved");
    expect(payloadOf(calls[0]).url).toBe("/e?viewSession=s1");
  });

  // The phone already names the app the notification came from, so a title
  // repeating the site would read "Example Weekend from Example Weekend".
  // The email's subject line is the short "what happened" the title wants.
  it("is titled with what happened, not with the site", async () => {
    const guest = await createGuest({ emailSettings: { rsvpChange: true } });
    await subscribe(guest.id, "https://push.example/phone");

    await notifyGuest(guest.id, "rsvpChange", MESSAGE, IN_APP);

    const payload = payloadOf(
      vi.mocked(webpush.sendNotification).mock.calls[0]
    );
    expect(payload.title).toBe("Session moved");
    expect(payload.body).toBe("Your session moved");
  });

  // A device is all or nothing: the per-type settings govern email alone,
  // which is the heavier channel (ADR 0006).
  it("reaches the device even when the guest has the email for that type switched off", async () => {
    const guest = await createGuest({ emailSettings: { rsvpChange: false } });
    await subscribe(guest.id, "https://push.example/phone");

    await notifyGuest(guest.id, "rsvpChange", MESSAGE, IN_APP);

    expect(webpush.sendNotification).toHaveBeenCalledTimes(1);
    expect(sendMail).not.toHaveBeenCalled();
    expect(
      await getRepositories().notifications.listByGuest(guest.id)
    ).toHaveLength(1);
  });

  // Everything sent is about now. A phone that was off over a weekend should
  // not wake to a pile of news about sessions that have already happened.
  it("lets an undelivered notification expire within hours, not weeks", async () => {
    const guest = await createGuest({ emailSettings: { rsvpChange: true } });
    await subscribe(guest.id, "https://push.example/phone");

    await notifyGuest(guest.id, "rsvpChange", MESSAGE, IN_APP);

    const options = vi.mocked(webpush.sendNotification).mock.calls[0][2];
    expect(options?.TTL).toBeGreaterThan(0);
    expect(options?.TTL).toBeLessThanOrEqual(24 * 60 * 60);
  });

  it("does nothing when the guest has no devices", async () => {
    const guest = await createGuest({ emailSettings: { rsvpChange: true } });

    await notifyGuest(guest.id, "rsvpChange", MESSAGE, IN_APP);

    expect(webpush.sendNotification).not.toHaveBeenCalled();
  });

  it("forgets a device the push service says is gone", async () => {
    const guest = await createGuest({ emailSettings: { rsvpChange: true } });
    await subscribe(guest.id, "https://push.example/deleted-app");
    vi.mocked(webpush.sendNotification).mockRejectedValue(
      Object.assign(new Error("Gone"), { statusCode: 410 })
    );

    await notifyGuest(guest.id, "rsvpChange", MESSAGE, IN_APP);

    expect(await getRepositories().push.listSubscriptions(guest.id)).toEqual(
      []
    );
  });

  it("keeps a device when the push service fails for some other reason", async () => {
    const guest = await createGuest({ emailSettings: { rsvpChange: true } });
    await subscribe(guest.id, "https://push.example/flaky");
    vi.mocked(webpush.sendNotification).mockRejectedValue(
      Object.assign(new Error("Service Unavailable"), { statusCode: 503 })
    );

    await notifyGuest(guest.id, "rsvpChange", MESSAGE, IN_APP);

    expect(
      await getRepositories().push.listSubscriptions(guest.id)
    ).toHaveLength(1);
  });

  // One failing device must not swallow the notification for the next one.
  it("still reaches the second device when the first one fails", async () => {
    const guest = await createGuest({ emailSettings: { rsvpChange: true } });
    await subscribe(guest.id, "https://push.example/broken");
    await subscribe(guest.id, "https://push.example/fine");
    vi.mocked(webpush.sendNotification)
      .mockRejectedValueOnce(
        Object.assign(new Error("Gone"), { statusCode: 410 })
      )
      .mockResolvedValueOnce(
        {} as Awaited<ReturnType<typeof webpush.sendNotification>>
      );

    await notifyGuest(guest.id, "rsvpChange", MESSAGE, IN_APP);

    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);
  });
});

describe("subscriptions", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("re-subscribing the same device replaces the old row rather than duplicating it", async () => {
    const guest = await createGuest();
    await subscribe(guest.id, "https://push.example/same");
    await subscribe(guest.id, "https://push.example/same");

    expect(
      await getRepositories().push.listSubscriptions(guest.id)
    ).toHaveLength(1);
  });

  it("re-subscribing keeps the date the device was first turned on", async () => {
    const guest = await createGuest();
    await getRepositories().push.saveSubscription({
      guestId: guest.id,
      endpoint: "https://push.example/same",
      p256dh: "p256dh",
      auth: "auth",
      createdAt: new Date("2026-08-01T12:00:00.000Z"),
    });
    await getRepositories().push.saveSubscription({
      guestId: guest.id,
      endpoint: "https://push.example/same",
      p256dh: "p256dh-rotated",
      auth: "auth-rotated",
      createdAt: new Date("2026-08-02T12:00:00.000Z"),
    });

    const [saved] = await getRepositories().push.listSubscriptions(guest.id);
    expect(saved.createdAt).toEqual(new Date("2026-08-01T12:00:00.000Z"));
    expect(saved.p256dh).toBe("p256dh-rotated");
  });

  // A shared laptop: whoever turned notifications on last owns the device.
  it("moves a device to the guest who subscribed it last", async () => {
    const first = await createGuest();
    const second = await createGuest();
    await subscribe(first.id, "https://push.example/shared");
    await subscribe(second.id, "https://push.example/shared");

    expect(await getRepositories().push.listSubscriptions(first.id)).toEqual(
      []
    );
    expect(
      await getRepositories().push.listSubscriptions(second.id)
    ).toHaveLength(1);
  });

  it("goes away with the guest", async () => {
    const guest = await createGuest();
    await subscribe(guest.id, "https://push.example/phone");

    await getRepositories().guests.delete(guest.id);

    expect(
      await getRepositories().push.listSubscriptions(guest.id)
    ).toHaveLength(0);
  });
});

describe("VAPID keys", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  // Regenerating them would silently invalidate every subscription already
  // handed out, and nothing tells the browser to re-subscribe.
  it("are generated once and then reused", async () => {
    const generate = () => ({ publicKey: "pub", privateKey: "priv" });
    const first = await getRepositories().push.vapidKeys(generate);
    const second = await getRepositories().push.vapidKeys(() => ({
      publicKey: "different",
      privateKey: "different",
    }));

    expect(first.publicKey).toBe("pub");
    expect(second).toEqual(first);
  });
});
