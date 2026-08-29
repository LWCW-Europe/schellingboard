import { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { DateTime } from "luxon";

// Kiosk mode (?kiosk=1) is meant for large screens at the venue: it draws a
// red line across the grid at the current time and keeps it scrolled into
// view. The seeded events lie ~2 weeks in the future (see
// scripts/seed/seed-database.ts: Conference Gamma's first day is today+14, running
// 09:00–18:00 Europe/Berlin), so the tests time-travel to a moment within that
// first day to make the now line appear.
//
// Time travel goes through the dev fake clock (?dev=1), not the browser clock:
// the now line follows the app's simulated "now" (server-seeded, cookie-driven
// — see docs/dev/adr/0004-dev-fake-clock.md), which a browser-only clock jump wouldn't move.
// Berlin timezone so the toolbar's datetime-local picker maps 16:00 to 16:00
// Berlin, squarely inside Gamma's first day.
test.use({ timezoneId: "Europe/Berlin" });

// 16:00 Berlin on Gamma's first event day — late enough in the day that the
// line starts outside the visible schedule area and only auto-scrolling
// brings it into view.
const duringGammaDayOne = DateTime.now()
  .setZone("Europe/Berlin")
  .plus({ days: 14 })
  .set({ hour: 16, minute: 0, second: 0, millisecond: 0 });

// Move the dev fake clock to `target` via the toolbar's datetime picker, then
// wait for the simulated date to show so the override cookie is committed.
async function setDevClock(page: Page, target: DateTime) {
  await expect(page.getByText("Dev clock")).toBeVisible();
  // Applying the clock triggers a router.refresh(); a navigation started while
  // its RSC payload is still streaming aborts it, which logs an RSC-payload
  // error the console guard fails on. So wait for that very response, body and
  // all — "networkidle" is both later and less certain, since Next goes on
  // prefetching in the background. A refresh asks for RSC without the
  // prefetch header, which is what tells it apart from those prefetches.
  const [refreshed] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.ok() &&
        res.request().headers()["rsc"] === "1" &&
        !res.request().headers()["next-router-prefetch"]
    ),
    page
      .getByLabel("Pick date and time")
      .fill(target.toFormat("yyyy-MM-dd'T'HH:mm")),
  ]);
  // The toolbar prints the simulated instant in UTC; the calendar date is the
  // same as Berlin's for a 16:00 target, so match on the date alone.
  await expect(page.getByText(target.toFormat("yyyy-MM-dd"))).toBeVisible();
  await refreshed.finished();
}

// Land the browser on `path` with the fake clock already inside Gamma's first
// day, so the now line is present from first paint (and thus auto-scrolled).
// The clock is set first, then a reload replays the page with the override
// cookie in place — a full navigation, so it can't abort an in-flight refresh.
async function openGammaScheduleDuringEvent(page: Page, path: string) {
  await login(page);
  const url = path.includes("?") ? `${path}&dev=1` : `${path}?dev=1`;
  await page.goto(url);
  await setDevClock(page, duringGammaDayOne);
  await page.reload();
}

test("kiosk mode draws a now line and auto-scrolls it into view", async ({
  page,
}) => {
  await openGammaScheduleDuringEvent(page, "/Conference-Gamma?kiosk=1");
  await expect(page.getByTestId("now-line")).toBeInViewport();
});

test("without the kiosk parameter there is no now line", async ({ page }) => {
  await openGammaScheduleDuringEvent(page, "/Conference-Gamma");
  await expect(page.getByTestId("now-line")).toHaveCount(0);
});

test("kiosk mode persists via cookie after navigating without the parameter", async ({
  page,
}) => {
  await openGammaScheduleDuringEvent(page, "/Conference-Gamma?kiosk=1");
  await expect(page.getByTestId("now-line")).toBeInViewport();

  // Neither link below carries ?kiosk=1, yet the display should stay in
  // kiosk mode: the cookie set on the first load should carry it through.
  await page.getByRole("link", { name: "Proposals" }).click();
  await page.getByRole("link", { name: "View Schedule" }).click();
  await expect(page).toHaveURL(/\/Conference-Gamma$/);

  await expect(page.getByTestId("now-line")).toBeInViewport();
});

test("?kiosk=0 clears the cookie and leaves kiosk mode", async ({ page }) => {
  await openGammaScheduleDuringEvent(page, "/Conference-Gamma?kiosk=1");
  await expect(page.getByTestId("now-line")).toBeInViewport();

  // Leave via a client-side link first and wait for it to settle: a hard
  // page.goto right after kiosk mode was active risks getting aborted by an
  // in-flight fetch (NS_BINDING_ABORTED) — see memory
  // e2e-nav-abort-after-admin-save.
  await page.getByRole("link", { name: "Proposals" }).click();
  await expect(
    page.getByRole("heading", { name: /Session Proposals/ })
  ).toBeVisible();
  await page.goto("/Conference-Gamma?kiosk=0");
  await expect(page.getByTestId("now-line")).toHaveCount(0);

  // ?kiosk=0 hides the now line from the server render alone, so the check
  // above says nothing about hydration — while the cookie is cleared by an
  // effect that only runs once the page has hydrated. Navigating away before
  // that lands leaves the cookie behind, and the next page is in kiosk mode
  // again.
  await expect
    .poll(async () =>
      (await page.context().cookies()).map((cookie) => cookie.name)
    )
    .not.toContain("kiosk");

  // A plain reload (no parameter at all) should stay out of kiosk mode too:
  // the poll above proves the cookie is gone, this that nothing else puts the
  // display back into kiosk mode once it is.
  await page.goto("/Conference-Gamma");
  await expect(page.getByTestId("now-line")).toHaveCount(0);
});

// The now line must follow the fake clock, not the real one: without this the
// display stays blank when organizers time-travel to preview the kiosk.
test("kiosk now line follows the dev fake clock, not the real clock", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma?kiosk=1&dev=1");

  // The real clock is not inside any event day, so nothing is drawn yet.
  await expect(page.getByText("Dev clock")).toBeVisible();
  await expect(page.getByTestId("now-line")).toHaveCount(0);

  // Time-travelling into the event makes the now line appear.
  await setDevClock(page, duringGammaDayOne);
  await expect(page.getByTestId("now-line")).toBeVisible();
});
