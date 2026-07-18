import { Page, expect } from "@playwright/test";

// Selects the current identity via the site header. The active name lives in
// a header chip (accessible name starts with "Your name"). With no name set,
// tapping it opens a modal with the "My name is:" combobox; with a name set,
// it opens the user menu whose "Switch name" entry leads to the same modal.
export async function selectUser(page: Page, name: string | RegExp) {
  await page.getByRole("button", { name: /your name/i }).click();
  const switchName = page.getByRole("menuitem", { name: "Switch name" });
  const nameBox = page.getByLabel("My name is:");
  await expect(switchName.or(nameBox)).toBeVisible();
  if (await switchName.isVisible()) await switchName.click();
  await nameBox.click();
  await page.getByRole("option", { name }).click();
}
