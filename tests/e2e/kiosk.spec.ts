import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import {
  duringGammaDayOne,
  openGammaScheduleDuringEvent,
  setDevClock,
} from "./helpers/dev-clock";

// Kiosk mode (?kiosk=1) is meant for large screens at the venue. The now line
// itself is drawn on every schedule (see now-line.spec.ts); what kiosk mode
// adds is keeping it scrolled into view, and sticking across navigation. The
// tests time-travel into Conference Gamma's first day so there is a line to
// scroll to — see helpers/dev-clock.ts, which the timezone below comes from.
test.use({ timezoneId: "Europe/Berlin" });

test("kiosk mode auto-scrolls the now line into view", async ({ page }) => {
  await openGammaScheduleDuringEvent(page, "/Conference-Gamma?kiosk=1");
  await expect(page.getByTestId("now-line")).toBeInViewport();
});

test("kiosk mode persists via cookie after navigating without the parameter", async ({
  page,
}) => {
  await openGammaScheduleDuringEvent(page, "/Conference-Gamma?kiosk=1");
  await expect(page.getByTestId("now-line")).toBeInViewport();

  // Neither link below carries ?kiosk=1, yet the display should stay in
  // kiosk mode: the cookie set on the first load should carry it through, so
  // the now line is scrolled to again rather than left where the day starts.
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

  // The cookie is cleared by an effect that only runs once the page has
  // hydrated. Navigating away before that lands would leave the cookie behind,
  // and the next page would be in kiosk mode again.
  await expect
    .poll(async () =>
      (await page.context().cookies()).map((cookie) => cookie.name)
    )
    .not.toContain("kiosk");

  // Nothing outside kiosk mode brings the now line into view, so the schedule
  // now opens at the start of the day and stays there.
  await page.goto("/Conference-Gamma");
  await page.waitForTimeout(2000);
  await expect(page.getByTestId("now-line")).not.toBeInViewport();
});

// Kiosk scrolling has to follow the fake clock like the line itself does,
// otherwise the display stays put when organizers time-travel to preview it.
test("kiosk mode scrolls to the now line of the dev fake clock", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma?kiosk=1&dev=1");

  // The real clock is not inside any event day, so nothing is drawn yet.
  await expect(page.getByText("Dev clock")).toBeVisible();
  await expect(page.getByTestId("now-line")).toHaveCount(0);

  await setDevClock(page, duringGammaDayOne);
  await expect(page.getByTestId("now-line")).toBeInViewport();
});
