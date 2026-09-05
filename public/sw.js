/*
 * SchellingBoard's service worker. It exists for one reason: a browser will
 * only deliver a push notification to a service worker, so there has to be
 * one. It deliberately does not cache or intercept anything — a schedule that
 * keeps changing is worse than useless when served stale, and offline support
 * for dynamic pages is a different, much larger job.
 *
 * Served from the site root so its scope covers the whole app, and exempted
 * from the site password in proxy.ts (a 404 here takes notifications with it).
 */

self.addEventListener("install", () => {
  // Nothing to pre-cache, so there is no reason to wait for the old worker.
  void self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  // iOS revokes the subscription of a worker that takes a push and shows
  // nothing, so every path through here ends in a visible notification —
  // including one where the payload is missing or unreadable.
  let notice = {};
  try {
    notice = event.data ? event.data.json() : {};
  } catch {
    notice = {};
  }

  event.waitUntil(
    self.registration.showNotification(notice.title || "SchellingBoard", {
      body: notice.body || "Something happened at your event.",
      icon: "/icon-192.png",
      data: { url: notice.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    (async () => {
      // Reuse a window that is already on the site rather than opening a
      // second copy of the app beside the one the guest left open.
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of windows) {
        try {
          await client.focus();
          await client.navigate(url);
          return;
        } catch {
          // A window this worker doesn't control refuses to be navigated;
          // a new one is better than one left where it was.
        }
      }
      await self.clients.openWindow(url);
    })()
  );
});
