import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import {
  duringGammaDayOne,
  openGammaScheduleDuringEvent,
  setDevClock,
} from "./helpers/dev-clock";

// The red now line and the toolbar's "Now" button are for everyone, not just
// kiosk displays (see kiosk.spec.ts for what kiosk mode adds on top). The
// seeded events lie ~2 weeks out, so these time-travel with the dev fake clock
// to a moment inside Conference Gamma's first day.
test.use({ timezoneId: "Europe/Berlin" });

test("the Now button jumps to the current time on the schedule", async ({
  page,
}) => {
  await openGammaScheduleDuringEvent(page, "/Conference-Gamma");

  const nowLine = page.getByTestId("now-line");
  await expect(nowLine).toBeAttached();

  // 16:00 is far enough down Gamma's day that the line starts off screen, and
  // nothing outside kiosk mode should scroll it into view on its own. Waiting
  // out kiosk's initial auto-scroll delay is what makes that meaningful — a
  // plain negative assertion would pass before any scroll could have happened.
  // It doubles as the hydration wait the click below needs.
  await page.waitForTimeout(2000);
  await expect(nowLine).not.toBeInViewport();

  await page.getByRole("button", { name: "Now" }).click();
  await expect(nowLine).toBeInViewport();
});

test("no now line or Now button outside the event's days", async ({ page }) => {
  await login(page);
  await page.goto("/Conference-Gamma");

  // The real clock is two weeks before the event starts.
  await expect(page.getByRole("button", { name: "Grid" })).toBeVisible();
  await expect(page.getByTestId("now-line")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Now" })).toHaveCount(0);
});

test("the Now button is only offered by the grid view", async ({ page }) => {
  await openGammaScheduleDuringEvent(page, "/Conference-Gamma");
  await expect(page.getByRole("button", { name: "Now" })).toBeVisible();

  // The text view has no grid to jump around in. The toggle is server-rendered,
  // so a click can land before React has attached its handler and be dropped —
  // retry until the view has actually switched (docs/dev/testing.md § E2E
  // conventions). Re-clicking the active view is a no-op, so this is safe.
  await expect(async () => {
    await page.getByRole("button", { name: "Text" }).click();
    await expect(page.getByPlaceholder("Search sessions")).toBeVisible({
      timeout: 2000,
    });
  }).toPass();
  await expect(page.getByRole("button", { name: "Now" })).toHaveCount(0);
});

test("the now line follows the dev fake clock, not the real clock", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma?dev=1");

  await expect(page.getByText("Dev clock")).toBeVisible();
  await expect(page.getByTestId("now-line")).toHaveCount(0);

  await setDevClock(page, duringGammaDayOne);
  await expect(page.getByTestId("now-line")).toBeAttached();
});
