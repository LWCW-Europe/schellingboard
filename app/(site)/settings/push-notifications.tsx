"use client";

import { useEffect, useState } from "react";

import {
  pushEnabledHereAction,
  subscribeToPushAction,
  unsubscribeFromPushAction,
} from "@/app/actions/push";
import { urlBase64ToUint8Array } from "@/utils/push-key";

type State =
  | "checking"
  | "unsupported"
  /** iOS only offers push to a web app that has been added to the home screen. */
  | "needs-install"
  | "blocked"
  | "off"
  | "on";

function isApplePhoneOrTablet(): boolean {
  // iPadOS reports itself as a Mac; the touch points are what give it away.
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

async function subscribeHere(
  registration: ServiceWorkerRegistration,
  publicKey: string
): Promise<PushSubscription> {
  const options: PushSubscriptionOptionsInit = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  };
  try {
    return await registration.pushManager.subscribe(options);
  } catch (err) {
    // Subscribing again with the same key just returns the existing
    // subscription; with a different one it fails, and the browser won't
    // replace it in place. That happens to anyone who subscribed before the
    // server's keys were replaced — dropping the stale one is the only way
    // back.
    const stale = await registration.pushManager.getSubscription();
    if (!stale) throw err;
    await stale.unsubscribe();
    return registration.pushManager.subscribe(options);
  }
}

export function PushNotifications({ publicKey }: { publicKey: string }) {
  const [state, setState] = useState<State>("checking");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      if (
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        setState(
          isApplePhoneOrTablet() && !isInstalled()
            ? "needs-install"
            : "unsupported"
        );
        return;
      }
      if (Notification.permission === "denied") {
        setState("blocked");
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      if (!subscription) {
        setState("off");
        return;
      }
      // What the browser holds isn't an answer on its own: it survives
      // switching to another name on a shared device, and outlives a row the
      // server has dropped. A device that is somebody else's keeps ringing
      // for them with nothing on this page able to stop it, so a subscription
      // the server doesn't know as ours is ended here and now.
      const mine = await pushEnabledHereAction(subscription.endpoint);
      if (!mine) await subscription.unsubscribe();
      setState(mine ? "on" : "off");
    };
    // A failed check — the server unreachable, a cookie that expired — says
    // nothing about the browser, so it lands on the one state with a way out.
    void check().catch(() => setState("off"));
  }, []);

  const enable = async () => {
    setBusy(true);
    setError(null);
    try {
      // Safari only shows the prompt while the tap that caused it is still
      // fresh, and installing the worker on a first tap is slow enough to lose
      // that — so ask first, and register nothing for a guest who declines.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "blocked" : "off");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const subscription = await subscribeHere(registration, publicKey);
      const keys = subscription.toJSON().keys;
      const result = await subscribeToPushAction({
        endpoint: subscription.endpoint,
        p256dh: keys?.p256dh,
        auth: keys?.auth,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setState("on");
    } catch (err) {
      setError("Could not turn notifications on for this device.");
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await unsubscribeFromPushAction(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setState("off");
    } catch (err) {
      setError("Could not turn notifications off for this device.");
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      aria-labelledby="push-heading"
      className="max-w-2xl mx-auto w-full px-4 sm:px-0 flex flex-col gap-2"
    >
      <h2 id="push-heading" className="text-lg font-semibold">
        Notifications on this device
      </h2>
      <p className="text-sm text-fg-subtle">
        Everything the notifications page tells you, on your phone or laptop
        while the site isn&rsquo;t open. A device gets all of them &mdash; the
        email settings above only decide what is emailed. Each device is turned
        on separately.
      </p>

      <div aria-live="polite" className="flex flex-col gap-2">
        {state === "checking" && (
          <p className="text-sm text-fg-muted">Checking&hellip;</p>
        )}

        {state === "needs-install" && (
          <p className="text-sm text-fg-muted">
            On iPhone and iPad this works once the site is on your home screen:
            tap the Share button, then <strong>Add to Home Screen</strong>, and
            open it from there.
          </p>
        )}

        {state === "unsupported" && (
          <p className="text-sm text-fg-muted">
            This browser can&rsquo;t show notifications. You&rsquo;ll still see
            everything on the notifications page.
          </p>
        )}

        {state === "blocked" && (
          <p className="text-sm text-fg-muted">
            Notifications are blocked for this site. Allow them in your
            browser&rsquo;s settings for this site, then reload this page.
          </p>
        )}

        {state === "off" && (
          <div>
            <button
              type="button"
              onClick={() => void enable()}
              disabled={busy}
              className="bg-brand text-on-brand font-semibold py-2 px-6 rounded shadow disabled:bg-surface-hover disabled:text-fg-subtle disabled:shadow-none hover:bg-brand-hover active:bg-brand-hover"
            >
              {busy ? "Turning on..." : "Turn on for this device"}
            </button>
          </div>
        )}

        {state === "on" && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-success-fg">On for this device.</span>
            <button
              type="button"
              onClick={() => void disable()}
              disabled={busy}
              className="border border-line text-fg-muted font-semibold py-2 px-6 rounded hover:bg-surface-hover disabled:text-fg-subtle"
            >
              {busy ? "Turning off..." : "Turn off"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger-fg">
          {error}
        </p>
      )}
    </section>
  );
}
