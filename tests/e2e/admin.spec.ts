import { Page } from "@playwright/test";
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

    // No site navigation or site logout button, only the admin logout
    await expect(page.getByRole("navigation")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Logout", exact: true })
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Admin logout" }).click();
    await expect(
      page.getByRole("heading", { name: "Admin Access" })
    ).toBeVisible();
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
