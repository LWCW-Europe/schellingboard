import webpush from "web-push";

import { getRepositories } from "@/db/container";
import { siteUrl } from "@/utils/site-url";

/**
 * Where the push service should complain about us. It has to be a URL or a
 * mailto:, and an instance that was never told its own address falls back to
 * the project's — the alternative is not being able to push at all.
 */
const CONTACT = "https://schellingboard.org";

const generateKeys = () => webpush.generateVAPIDKeys();

// Everything sent is about now — a moved session, a request for the next
// slot — so a phone that comes back online days later should not wake to a
// pile of it. Hours, not the default four weeks.
const TTL_SECONDS = 4 * 60 * 60;

// The send runs inside the request that made the change, once per recipient.
// A push service that stops answering must not hold that request for as long
// as a socket takes to give up by itself.
const TIMEOUT_MS = 10_000;

/**
 * The instance's VAPID public key, which a browser needs before it can
 * subscribe. Generated on the first call and never replaced: it is baked into
 * every subscription already handed out, and nothing tells a browser to ask
 * for a new one.
 */
export async function vapidPublicKey(): Promise<string> {
  const { publicKey } = await getRepositories().push.vapidKeys(generateKeys);
  return publicKey;
}

/**
 * Sends `notice` to every browser the guest has turned notifications on in.
 * Never throws: a push that fails must not cost the guest the email about the
 * same event.
 *
 * The caller decides whether the guest wants this at all — see notifyGuest.
 */
export async function pushToGuest(
  guestId: string,
  notice: { text: string; url: string }
): Promise<void> {
  try {
    const { push, settings } = getRepositories();
    const subscriptions = await push.listSubscriptions(guestId);
    if (subscriptions.length === 0) return;

    const keys = await push.vapidKeys(generateKeys);
    webpush.setVapidDetails(
      siteUrl() ?? CONTACT,
      keys.publicKey,
      keys.privateKey
    );

    const payload = JSON.stringify({
      // Whose event this is, since the notification arrives among everything
      // else on the guest's phone.
      title: (await settings.get()).title,
      body: notice.text,
      url: notice.url,
    });

    await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: { p256dh: subscription.p256dh, auth: subscription.auth },
            },
            payload,
            { TTL: TTL_SECONDS, timeout: TIMEOUT_MS }
          );
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode;
          // The push service saying this browser is gone for good: the home
          // screen icon was deleted, or the subscription expired. Nothing else
          // reports that, so this is the only moment the row can be cleaned
          // up. Any other failure may be transient, so the device keeps its
          // row and its next notification.
          if (status === 404 || status === 410) {
            await push.deleteSubscription(subscription.endpoint);
            return;
          }
          // The endpoint stays out of the log: it is a capability URL for
          // one device, and the guest and status say enough.
          console.error(
            `Push to a device of guest ${guestId} failed (${status ?? "no status"}):`,
            err
          );
        }
      })
    );
  } catch (err) {
    console.error(`Failed to push to guest ${guestId}:`, err);
  }
}
