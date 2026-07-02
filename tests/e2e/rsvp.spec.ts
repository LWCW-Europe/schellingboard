import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";

test("RSVP to a session persists across reloads and can be removed again", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");

  // Bob is not a host of the seeded keynote, so he gets an RSVP button
  await page.getByLabel("My name is:").click();
  await page.getByRole("option", { name: /Bob Test/i }).click();

  await page
    .getByRole("link", { name: /Opening Keynote/ })
    .first()
    .click();
  const dialog = page.getByRole("dialog", { name: "Session details" });
  await expect(dialog).toBeVisible();

  // RSVP. The button label only flips once the server confirmed the RSVP.
  await dialog.getByRole("button", { name: "RSVP", exact: true }).click();
  await expect(dialog.getByRole("button", { name: "Un-RSVP" })).toBeVisible();

  // Reload (the session stays open via the URL): the RSVP must persist and
  // Bob must be listed as an attendee
  await page.reload();
  await expect(dialog.getByRole("button", { name: "Un-RSVP" })).toBeVisible();
  await expect(dialog.getByText(/Bob Test/)).toBeVisible();

  // Un-RSVP and reload: gone again
  await dialog.getByRole("button", { name: "Un-RSVP" }).click();
  await expect(
    dialog.getByRole("button", { name: "RSVP", exact: true })
  ).toBeVisible();

  await page.reload();
  await expect(
    dialog.getByRole("button", { name: "RSVP", exact: true })
  ).toBeVisible();
  await expect(dialog.getByText(/Bob Test/)).toHaveCount(0);
});
