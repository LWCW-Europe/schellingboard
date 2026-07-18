import { Locator, Page, expect } from "@playwright/test";

// Opens the name-switcher modal via the site header and returns the
// "My name is:" combobox. The active name lives in a header chip (accessible
// name starts with "Your name"). With no name set, tapping it opens the
// modal directly; with a name set, it opens the user menu whose "Switch
// name" entry leads to the same modal.
export async function openNameSwitcher(page: Page): Promise<Locator> {
  const switchName = page.getByRole("menuitem", { name: "Switch name" });
  const nameBox = page.getByLabel("My name is:");
  // A just-closed switcher modal fades out; wait for it to unmount so the
  // menu and the modal never match at the same time below.
  await expect(nameBox).toBeHidden();
  await page.getByRole("button", { name: /your name/i }).click();
  await expect(switchName.or(nameBox)).toBeVisible();
  if (await switchName.isVisible()) await switchName.click();
  await nameBox.click();
  return nameBox;
}

// Selects the current identity via the site header.
export async function selectUser(page: Page, name: string | RegExp) {
  await openNameSwitcher(page);
  await page.getByRole("option", { name }).click();
}
