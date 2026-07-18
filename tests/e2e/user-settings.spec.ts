import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";

// Amara Okafor is used by no other spec, so her email settings can be
// mutated without racing parallel test files.
test("header user menu reaches profile, edit profile, and settings; email preferences persist", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Alpha/proposals");
  await selectUser(page, /Amara Okafor/i);

  // Once a name is selected, the header chip opens a user menu.
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /my profile/i }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Amara Okafor" })
  ).toBeVisible();

  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /edit profile/i }).click();
  await expect(
    page.getByRole("heading", { name: /edit profile/i })
  ).toBeVisible();
  // Email preferences are private settings, not part of the public profile.
  await expect(page.getByText(/email me when/i)).toHaveCount(0);

  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /settings/i }).click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  // Switching names is unauthenticated, so the stored email address must
  // never be rendered — anyone could impersonate a guest and read it.
  await expect(page.getByText("amara.okafor@example.com")).toHaveCount(0);

  const rsvpToggle = page.getByLabel(/RSVP.d to changes time or location/i);
  await expect(rsvpToggle).toBeChecked();
  await rsvpToggle.uncheck();
  await page.getByRole("button", { name: /^Save$/ }).click();
  await expect(page.getByText(/saved/i)).toBeVisible();

  // Editing again invalidates the confirmation: what's on screen is no
  // longer what was saved. (Left unsaved on purpose — the reload below
  // must only see the rsvpChange update.)
  await page.getByLabel(/hosting changes time or location/i).uncheck();
  await expect(page.getByText(/saved/i)).toHaveCount(0);

  await page.reload();
  await expect(
    page.getByLabel(/RSVP.d to changes time or location/i)
  ).not.toBeChecked();
});

test("settings page asks to select a name when none is chosen", async ({
  page,
}) => {
  await login(page);
  await page.goto("/settings");

  await expect(page.getByText(/select who you are/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Settings" })).toHaveCount(0);
});
