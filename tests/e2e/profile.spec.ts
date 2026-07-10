import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import sharp from "sharp";

async function selectCurrentUser(page: import("@playwright/test").Page) {
  // The proposals page has a "My name is:" selector backed by a combobox.
  await page.getByRole("combobox", { name: /My name is/i }).click();
  await page.getByRole("combobox", { name: /My name is/i }).fill("Alice Test");
  await page.getByRole("option", { name: /Alice Test/i }).click();
  await page.keyboard.press("Escape");
}

async function makeImage(width: number, height: number): Promise<Buffer> {
  return sharp({
    create: { width, height, channels: 3, background: { r: 90, g: 60, b: 30 } },
  })
    .png()
    .toBuffer();
}

test.describe("Edit profile", () => {
  test.describe.configure({ mode: "serial" });

  test("lists guests and edits the current user's profile", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/Conference-Alpha/proposals");

    // Identify as Alice, then reach the attendees page via the header link.
    await selectCurrentUser(page);
    await page.getByRole("link", { name: /Participants/i }).click();
    await expect(page).toHaveURL(/\/guests$/);

    // All guests are listed.
    await expect(page.getByRole("link", { name: "Alice Test" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Bob Test" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Charlie Test" })
    ).toBeVisible();

    // Edit profile always targets the current user (Alice).
    await page.getByRole("link", { name: /Edit profile/i }).click();
    await expect(page).toHaveURL(/\/guests\/edit$/);
    await expect(
      page.getByRole("heading", { name: /Edit profile/i })
    ).toBeVisible();

    const aboutMe = `Conference enthusiast ${Date.now()}`;
    await page.getByLabel("About me").fill(aboutMe);
    const pronounsEntry = page.getByLabel("Pronouns");
    await pronounsEntry.fill("She/Her");
    await pronounsEntry.blur();
    // hidden inputs aren't interactable through `getByLabel` in playwright
    await page.locator('input[type="file"]').setInputFiles({
      name: "square.png",
      mimeType: "image/png",
      buffer: await makeImage(800, 800),
    });
    await page.getByRole("button", { name: /^Save$/ }).click();

    // Lands on Alice's profile with the new About me text.
    await expect(page).toHaveURL(/\/guests\/[^/]+$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Alice Test" })
    ).toBeVisible();
    await expect(page.getByText(aboutMe)).toBeVisible();
    await expect(
      page.getByAltText("Profile avatar of Alice Test")
    ).toBeVisible();
  });

  test("pronoun combobox doesn't revert to one of the default options on enter", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/Conference-Alpha/proposals");

    // Identify as Alice, then reach the attendees page via the header link.
    await selectCurrentUser(page);
    await page.getByRole("link", { name: /Participants/i }).click();

    // Edit profile always targets the current user (Alice).
    await page.getByRole("link", { name: /Edit profile/i }).click();

    // There was a bug with the combobox impl that
    // caused the last hovered option to be selected on enter.
    // This tests that it's worked around
    const pronounsEntry = page.getByLabel("Pronouns");
    await pronounsEntry.click();
    await page.getByRole("option", { name: "He/Him" }).hover();
    await pronounsEntry.click();
    await pronounsEntry.fill("She/Her");
    await pronounsEntry.press("Enter");

    await expect(page.getByText("She/Her")).toBeVisible();
  });

  test("avatar doesn't change on profile about me edit", async ({ page }) => {
    await login(page);
    await page.goto("/Conference-Alpha/proposals");

    // Identify as Alice, then reach the attendees page via the header link.
    await selectCurrentUser(page);
    await page.getByRole("link", { name: /Participants/i }).click();

    // Edit profile always targets the current user (Alice).
    await page.getByRole("link", { name: /Edit profile/i }).click();

    // Reset the avatar
    const aboutMe = `Conference enthusiast ${Date.now()}`;
    await page.getByLabel("About me").fill(aboutMe);
    await page.getByRole("button", { name: /^Save$/ }).click();

    await expect(
      page.getByAltText("Profile avatar of Alice Test")
    ).toBeVisible();
  });

  test("shows no image when the user avatar is reset", async ({ page }) => {
    await login(page);
    await page.goto("/Conference-Alpha/proposals");

    // Identify as Alice, then reach the attendees page via the header link.
    await selectCurrentUser(page);
    await page.getByRole("link", { name: /Participants/i }).click();

    // Edit profile always targets the current user (Alice).
    await page.getByRole("link", { name: /Edit profile/i }).click();

    // Reset the avatar
    await page.getByRole("button", { name: /^Reset$/ }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await expect(
      page.getByAltText("Profile avatar of Alice Test")
    ).toBeHidden();
    await expect(page.getByText(/^AT$/)).toBeVisible();
  });
});

test("shows an error on the edit page when no user is selected", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests/edit");

  await expect(page.getByText(/select who you are/i)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Edit profile/i })
  ).toHaveCount(0);
});
