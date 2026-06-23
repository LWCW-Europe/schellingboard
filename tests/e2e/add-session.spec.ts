import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";

test("a newly added session appears on the overview and can be opened", async ({
  page,
}) => {
  await login(page);

  await page.goto("/Conference-Gamma");
  await expect(
    page.getByRole("heading", { name: /Conference Gamma Schedule/ })
  ).toBeVisible();

  // Reach the form the way a real user does: click a free "+" slot in the grid.
  // We don't care which slot, so take the first.
  await page.getByRole("link", { name: "Add session" }).first().click();
  await expect(
    page.getByRole("heading", { name: /Add a session/i })
  ).toBeVisible();

  const sessionTitle = "Yak shaving";
  await page.getByRole("textbox").first().fill(sessionTitle);

  // Add a host via the combobox (a host is required to enable Submit).
  const hostsSection = page
    .locator("div")
    .filter({ hasText: /^Hosts/ })
    .first();
  await hostsSection.getByRole("button").first().click();
  await page.keyboard.type("Alice Test");
  await page.getByRole("option", { name: /Alice Test/i }).click();
  await page.keyboard.press("Escape");

  const submit = page.getByRole("button", { name: "Submit" });
  await expect(submit).toBeEnabled();
  await submit.click();

  // Lands on the confirmation page.
  await expect(
    page.getByRole("heading", { name: /Session added/i })
  ).toBeVisible();

  // Click the in-app "Back to schedule" link. This is the client-side
  // navigation that previously served a stale (pre-mutation) overview.
  await page.getByRole("link", { name: /Back to schedule/i }).click();
  await expect(
    page.getByRole("heading", { name: /Conference Gamma Schedule/ })
  ).toBeVisible();

  // The new session must be visible WITHOUT reloading (see #253).
  const newSessionLink = page.getByRole("link", { name: sessionTitle });
  await expect(newSessionLink).toBeVisible();

  // Opening the new session exercises the event-layout session data used by
  // the details modal, not just the schedule card rendered from fresh props.
  await newSessionLink.click();
  const dialog = page.getByRole("dialog", { name: "Session details" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(sessionTitle, { exact: true })).toBeVisible();
});
