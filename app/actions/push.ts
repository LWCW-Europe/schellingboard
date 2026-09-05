"use server";

import { getRepositories } from "@/db/container";
import { pushSubscriptionSchema } from "@/model/push";
import { requireVerifiedGuest } from "@/utils/action-auth";
import { serverNow } from "@/utils/dev-clock-server";

export type PushActionResult = { ok: true } | { ok: false; error: string };

/**
 * Remembers this browser as one of the guest's notification devices. Called
 * after the browser has agreed: the permission prompt and the subscription
 * both live in the client, and only the result reaches us.
 */
export async function subscribeToPushAction(
  input: unknown
): Promise<PushActionResult> {
  const guestId = await requireVerifiedGuest("turning on notifications");
  const parsed = pushSubscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "That is not a usable push subscription" };
  }

  await getRepositories().push.saveSubscription({
    guestId,
    ...parsed.data,
    createdAt: await serverNow(),
  });
  return { ok: true };
}

export async function unsubscribeFromPushAction(
  endpoint: unknown
): Promise<PushActionResult> {
  const guestId = await requireVerifiedGuest("turning off notifications");
  if (typeof endpoint !== "string") {
    return { ok: false, error: "That is not a usable push subscription" };
  }

  const { push } = getRepositories();
  const subscription = await push.findSubscription(endpoint);
  // Scoped to the caller: an endpoint is not a secret worth trusting, and
  // deleting by it alone would let anyone who learns one silence its owner.
  // A device that is already gone, or was never ours, reports success —
  // there is nothing for the browser to do differently either way.
  if (subscription?.guestId !== guestId) return { ok: true };

  await push.deleteSubscription(endpoint);
  return { ok: true };
}

/**
 * Whether the subscription this browser is holding is the current guest's.
 * The browser keeps its subscription across name changes and past a server
 * that has dropped the row, so what it holds is not on its own an answer.
 */
export async function pushEnabledHereAction(
  endpoint: unknown
): Promise<boolean> {
  const guestId = await requireVerifiedGuest("checking notifications");
  if (typeof endpoint !== "string") return false;

  const subscription = await getRepositories().push.findSubscription(endpoint);
  return subscription?.guestId === guestId;
}
