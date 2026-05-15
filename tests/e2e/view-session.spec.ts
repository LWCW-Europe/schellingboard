import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";

test("hard-navigating to a session URL renders the modal without hydration errors", async ({
  page,
}) => {
  await login(page);

  await page.goto("/Conference-Gamma");
  await expect(
    page.getByRole("heading", { name: /Conference Gamma Schedule/ })
  ).toBeVisible();

  // Find a session link in the grid and grab its href — this is the same
  // URL the user would copy via "Copy Link Address" or paste from a share.
  const sessionLink = page
    .getByRole("link", { name: /Opening Keynote/ })
    .first();
  const href = await sessionLink.getAttribute("href");
  expect(href).toBeTruthy();

  // Hard-navigate to the session URL. This is the "paste link" / "refresh
  // while modal is open" scenario — the page is server-rendered with
  // viewSession in the URL and then hydrated on the client.
  await page.goto(href!);

  // Modal should be visible. The consoleGuard fixture (auto) will fail the
  // test if hydration logged any console.error.
  await expect(
    page.getByRole("dialog", { name: "Session details" })
  ).toBeVisible();

  // Settle so any async hydration warnings have time to fire.
  await page.waitForLoadState("networkidle");
});
