import { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { DateTime } from "luxon";

// Kiosk mode (?kiosk=1) is meant for large screens at the venue: it draws a
// red line across the grid at the current time and keeps it scrolled into
// view. The seeded events lie ~2 weeks in the future (see
// scripts/seed-database.ts: Conference Gamma's first day is today+14, running
// 09:00–18:00 Europe/Berlin), so the test moves the browser clock to a moment
// within that first day to make the now line appear.

// 16:00 Berlin on Gamma's first event day — late enough in the day that the
// line starts outside the visible schedule area and only auto-scrolling
// brings it into view.
const duringGammaDayOne = DateTime.now()
  .setZone("Europe/Berlin")
  .plus({ days: 14 })
  .set({ hour: 16, minute: 0, second: 0, millisecond: 0 })
  .toJSDate();

// The page must load and hydrate at (roughly) real time — the server renders
// with the real clock, and a client clock jumped ahead makes hydration
// disagree about which slots are in the past. So: install a naturally ticking
// clock, load the page, and only then jump to the target time and fast-forward
// through the kiosk mode intervals so the now line appears and scrolls without
// waiting minutes of wall-clock time.
async function openGammaScheduleDuringEvent(page: Page, path: string) {
  await page.clock.install();
  await login(page);
  await page.goto(path);
  await expect(page.getByRole("button", { name: "Grid" })).toBeVisible();
  // The toolbar comes from server-rendered HTML, so the page may still be
  // hydrating. Only hydrated React reacts to the view toggle by rewriting the
  // URL — once that works, hydration is done and the clock can jump safely.
  await expect(async () => {
    await page.getByRole("button", { name: "Text" }).click();
    await expect(page).toHaveURL(/view=text/, { timeout: 1000 });
  }).toPass();
  await page.getByRole("button", { name: "Grid" }).click();
  await expect(page).toHaveURL(/view=grid/);
  await page.clock.setFixedTime(duringGammaDayOne);
  // Just under the 5-minute REFRESH_INTERVAL_MS in kiosk.tsx: a full 5:00
  // fires KioskController's router.refresh(), which can race a subsequent
  // navigation in the test and trip the console-error guard.
  await page.clock.runFor("04:59");
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

  // A plain reload (no parameter at all) should stay out of kiosk mode too,
  // proving the cookie was actually cleared rather than just overridden.
  await page.goto("/Conference-Gamma");
  await expect(page.getByTestId("now-line")).toHaveCount(0);
});
