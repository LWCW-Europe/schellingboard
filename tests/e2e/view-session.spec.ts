import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";

test("hard-navigating to a session URL renders the modal without hydration errors", async ({
  page,
}) => {
  await login(page);

  await page.goto("/Conference-Gamma");
  await expect(page.getByRole("button", { name: "Grid" })).toBeVisible();

  await page
    .getByRole("link", { name: /Opening Keynote/ })
    .first()
    .click();
  await expect(
    page.getByRole("dialog", { name: "Session details" })
  ).toBeVisible();

  // Opening the modal starts fetches of its own (the RSVP counts, and Next's
  // prefetches of the links it renders). Let them finish before reloading: the
  // reload aborts whatever is still in flight, and Firefox reports an aborted
  // fetch as an uncaught "NetworkError when attempting to fetch resource" that
  // the console guard fails on. "networkidle" is discouraged in general, but a
  // quiet network is the condition wanted here, and fixed waits of 1s and 3s
  // in its place both flaked under parallel load.
  await page.waitForLoadState("networkidle");

  // Reload with viewSession now in the URL. This is the "paste link" /
  // "refresh while modal is open" scenario — the page is server-rendered
  // with viewSession in the URL and then hydrated on the client.
  await page.reload();

  // Modal should be visible. The consoleGuard fixture (auto) will fail the
  // test if hydration logged any console.error.
  await expect(
    page.getByRole("dialog", { name: "Session details" })
  ).toBeVisible();

  // Settle again so async hydration warnings have time to fire before the
  // console guard checks.
  await page.waitForLoadState("networkidle");
});
