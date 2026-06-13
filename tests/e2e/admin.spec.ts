import { Page } from "@playwright/test";
import sharp from "sharp";
import { test, expect } from "./helpers/fixtures";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admintest";

async function adminLogin(page: Page) {
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Admin Access" })
  ).toBeVisible();
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Access Admin" }).click();
  await expect(
    page.getByRole("heading", { name: "Administration" })
  ).toBeVisible();
}

async function gotoUsers(page: Page) {
  await page
    .getByRole("navigation", { name: "Admin" })
    .getByRole("link", { name: "Users" })
    .click();
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
}

async function gotoLocations(page: Page) {
  await page
    .getByRole("navigation", { name: "Admin" })
    .getByRole("link", { name: "Locations" })
    .click();
  await expect(page.getByRole("heading", { name: "Locations" })).toBeVisible();
}

test.describe("Admin UI", () => {
  // Note: no site login here. The admin UI is independent of the normal
  // user UI and must be reachable with only the admin password.

  test("redirects to the admin login when not admin-authenticated", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Admin Access" })
    ).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("shows only admin chrome and can log out", async ({ page }) => {
    await adminLogin(page);

    // Only the admin nav is present, not the site nav, and only the admin
    // logout button (no site logout)
    await expect(page.getByRole("navigation", { name: "Admin" })).toBeVisible();
    await expect(page.getByRole("navigation")).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: "Logout", exact: true })
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Admin logout" }).click();
    await expect(
      page.getByRole("heading", { name: "Admin Access" })
    ).toBeVisible();
  });

  test("dashboard lists events and links to global sections", async ({
    page,
  }) => {
    await adminLogin(page);

    // Seeded events are listed on the dashboard
    const eventsRegion = page.getByRole("region", { name: "Events" });
    await expect(eventsRegion.getByText("Conference Alpha")).toBeVisible();

    // The global section cards navigate to their dedicated pages
    const globalRegion = page.getByRole("region", { name: "Global sections" });
    await globalRegion.getByRole("link", { name: /Users/ }).click();
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();

    await gotoLocations(page);
  });

  test("guards new admin routes when not authenticated", async ({ page }) => {
    for (const path of ["/admin/users", "/admin/locations"]) {
      await page.goto(path);
      await expect(
        page.getByRole("heading", { name: "Admin Access" })
      ).toBeVisible();
      await expect(page).toHaveURL(/\/admin\/login/);
    }
  });

  test("rejects a wrong admin password", async ({ page }) => {
    await page.goto("/admin");
    await page.getByLabel("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Access Admin" }).click();
    await expect(page.getByText("Invalid password")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Administration" })
    ).not.toBeVisible();
  });

  test("can create, edit, and delete a user", async ({ page }) => {
    await adminLogin(page);
    await gotoUsers(page);

    const unique = Date.now();
    const email = `e2e-admin-${unique}@test.example`;
    const name = `E2E Admin User ${unique}`;
    const renamed = `${name} Renamed`;

    // Create
    await page.getByLabel("Name").fill(name);
    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Add user" }).click();
    const row = page.getByRole("listitem").filter({ hasText: email });
    await expect(row).toBeVisible();
    await expect(row.getByText(name)).toBeVisible();

    // Edit (in edit mode the row shows inputs, so locate it via its Save button)
    await row.getByRole("button", { name: "Edit" }).click();
    const editRow = page
      .getByRole("listitem")
      .filter({ has: page.getByRole("button", { name: "Save" }) });
    await editRow.getByLabel("Name").fill(renamed);
    await editRow.getByRole("button", { name: "Save" }).click();
    await expect(row.getByText(renamed)).toBeVisible();

    // Delete requires confirmation and can be cancelled
    await row.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(row.getByText("Delete this user?")).toBeVisible();
    await row.getByRole("button", { name: "Cancel" }).click();
    await expect(row.getByText(renamed)).toBeVisible();

    // Delete for real
    await row.getByRole("button", { name: "Delete", exact: true }).click();
    await row.getByRole("button", { name: "Confirm delete" }).click();
    await expect(
      page.getByRole("listitem").filter({ hasText: email })
    ).toHaveCount(0);
  });
});

async function makeImage(width: number, height: number): Promise<Buffer> {
  return sharp({
    create: { width, height, channels: 3, background: { r: 90, g: 60, b: 30 } },
  })
    .png()
    .toBuffer();
}

async function deleteLocation(page: Page, name: string) {
  const region = page.getByRole("region", { name: "Locations" });
  const row = region.getByRole("listitem").filter({ hasText: name });
  await row.getByRole("button", { name: "Delete", exact: true }).click();
  await row.getByLabel("Location name confirmation").fill(name);
  await row.getByRole("button", { name: "Confirm delete" }).click();
  await expect(row).toHaveCount(0);
}

test.describe("Admin UI locations", () => {
  // These tests share the locations table and affect each other's sortIndex
  // calculations, so they must run serially.
  test.describe.configure({ mode: "serial" });

  test("can create, edit, reorder, and delete locations", async ({ page }) => {
    await adminLogin(page);
    await gotoLocations(page);
    const region = page.getByRole("region", { name: "Locations" });

    const unique = Date.now();
    const nameA = `E2E Room A ${unique}`;
    const nameB = `E2E Room B ${unique}`;

    // Create a location with details and an event assignment
    await region.getByRole("button", { name: "New location" }).click();
    await region.getByLabel("Name").fill(nameA);
    await region.getByLabel("Capacity").fill("25");
    await region.getByLabel("Bookable").check();
    await region.getByLabel("Conference Alpha").check();
    await region.getByRole("button", { name: "Add location" }).click();

    const rowA = region.getByRole("listitem").filter({ hasText: nameA });
    await expect(rowA).toBeVisible();
    await expect(
      rowA.getByText("max 25 · bookable · Conference Alpha")
    ).toBeVisible();

    // Create a second location; new locations are appended at the end
    await region.getByRole("button", { name: "New location" }).click();
    await region.getByLabel("Name").fill(nameB);
    await region.getByRole("button", { name: "Add location" }).click();
    const myRows = region
      .getByRole("listitem")
      .filter({ hasText: `${unique}` });
    await expect(myRows).toHaveCount(2);
    await expect(myRows.first()).toContainText(nameA);

    // Reorder: move B above A
    await region.getByRole("button", { name: `Move ${nameB} up` }).click();
    await expect(myRows.first()).toContainText(nameB);

    // Edit A
    const renamed = `${nameA} Renamed`;
    await rowA.getByRole("button", { name: "Edit" }).click();
    const editForm = region
      .getByRole("listitem")
      .filter({ has: page.getByRole("button", { name: "Save" }) });
    await editForm.getByLabel("Name").fill(renamed);
    await editForm.getByRole("button", { name: "Save" }).click();
    await expect(
      region.getByRole("listitem").filter({ hasText: renamed })
    ).toBeVisible();

    // Deleting requires typing the location name
    const rowRenamed = region
      .getByRole("listitem")
      .filter({ hasText: renamed });
    await rowRenamed
      .getByRole("button", { name: "Delete", exact: true })
      .click();
    await expect(rowRenamed.getByText(/Type the location name/)).toBeVisible();
    const confirmButton = rowRenamed.getByRole("button", {
      name: "Confirm delete",
    });
    await expect(confirmButton).toBeDisabled();
    await rowRenamed
      .getByLabel("Location name confirmation")
      .fill("wrong name");
    await expect(confirmButton).toBeDisabled();
    await rowRenamed.getByLabel("Location name confirmation").fill(renamed);
    await confirmButton.click();
    await expect(rowRenamed).toHaveCount(0);

    await deleteLocation(page, nameB);
  });

  test("uploads a location image and rejects invalid ones", async ({
    page,
  }) => {
    await adminLogin(page);
    await gotoLocations(page);
    const region = page.getByRole("region", { name: "Locations" });

    const name = `E2E Photo Room ${Date.now()}`;
    await region.getByRole("button", { name: "New location" }).click();
    await region.getByLabel("Name").fill(name);

    // An image without the 4:3 aspect ratio is rejected
    await region.getByLabel("Image").setInputFiles({
      name: "square.png",
      mimeType: "image/png",
      buffer: await makeImage(800, 800),
    });
    await region.getByRole("button", { name: "Add location" }).click();
    await expect(
      page.getByText("Image must have a 4:3 aspect ratio (got 800×800)")
    ).toBeVisible();

    // A valid 4:3 image is accepted and shown in the list
    await region.getByLabel("Image").setInputFiles({
      name: "room.png",
      mimeType: "image/png",
      buffer: await makeImage(800, 600),
    });
    await region.getByRole("button", { name: "Add location" }).click();
    const row = region.getByRole("listitem").filter({ hasText: name });
    await expect(row).toBeVisible();
    await expect(row.getByRole("img", { name })).toBeVisible();

    await deleteLocation(page, name);
  });
});
