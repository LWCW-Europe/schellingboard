import { Page } from "@playwright/test";
import sharp from "sharp";
import { test, expect } from "./helpers/fixtures";
import { loginAndGoto } from "./helpers/auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admintest";

async function adminLogin(page: Page) {
  await page.goto("/admin");
  // Already authenticated (cookie set earlier in the test): /admin redirects
  // straight to the events list, with no login form.
  if (await page.getByLabel("Password").isVisible()) {
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Access Admin" }).click();
  }
  await expect(page).toHaveURL(/\/admin\/events$/);
}

async function gotoSettings(page: Page) {
  await page
    .getByRole("navigation", { name: "Admin" })
    .getByRole("link", { name: "Settings" })
    .click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
}

async function makeImage(width: number, height: number): Promise<Buffer> {
  return sharp({
    create: { width, height, channels: 3, background: { r: 10, g: 80, b: 40 } },
  })
    .png()
    .toBuffer();
}

// Runs serially: these tests mutate the singleton site-settings row.
test.describe.configure({ mode: "serial" });

test.describe("Admin site settings", () => {
  test("edits the title, shown in the admin header", async ({ page }) => {
    await adminLogin(page);
    await gotoSettings(page);

    const unique = `E2E Conf ${Date.now()}`;
    await page.getByLabel("Title").fill(unique);
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("Settings saved.")).toBeVisible();

    // The admin header title (rendered from the DB) reflects the new value.
    await expect(
      page.getByRole("link", { name: `${unique} Admin` })
    ).toBeVisible();

    // Restore the default so the rest of the suite is unaffected.
    await page.getByLabel("Title").fill("Example Conference Weekend");
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("Settings saved.")).toBeVisible();
  });

  test("map modal appears only after a map is uploaded", async ({ page }) => {
    // No map by default: the schedule nav has no map button.
    await loginAndGoto(page, "/Conference-Alpha");
    await expect(page.getByRole("button", { name: "Show map" })).toHaveCount(0);

    // Upload a map via the admin UI.
    await adminLogin(page);
    await gotoSettings(page);
    await page.getByLabel("Map").setInputFiles({
      name: "map.png",
      mimeType: "image/png",
      buffer: await makeImage(1000, 700),
    });
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("Settings saved.")).toBeVisible();

    // The map button now shows on the schedule and opens the map image.
    await page.goto("/Conference-Alpha");
    const mapButton = page.getByRole("button", { name: "Show map" });
    await expect(mapButton).toBeVisible();
    await mapButton.click();
    await expect(page.getByRole("img", { name: "Map" })).toBeVisible();
    // Close the modal before navigating away so the in-flight image load
    // doesn't get cancelled mid-navigation.
    await page.getByRole("button", { name: "Close" }).click();

    // Clean up: remove the map so later tests see the default (no map) state.
    await adminLogin(page);
    await gotoSettings(page);
    await page.getByLabel("Remove current map").check();
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("Settings saved.")).toBeVisible();
  });
});
