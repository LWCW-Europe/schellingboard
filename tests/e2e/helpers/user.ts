import { Page } from "@playwright/test";

// Selects the current identity via the site header. The active name lives in a
// header chip (accessible name starts with "Your name"); tapping it opens a
// modal with the "My name is:" combobox where a guest is picked.
export async function selectUser(page: Page, name: string | RegExp) {
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByLabel("My name is:").click();
  await page.getByRole("option", { name }).click();
}
