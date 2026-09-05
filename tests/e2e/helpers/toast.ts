import { Locator, Page, expect } from "@playwright/test";

export function toast(page: Page): Locator {
  return page.getByRole("status");
}

// A toast sits over the bottom of the page for seconds — clear it before a
// test carries on clicking underneath rather than waiting it out.
export async function dismissToast(page: Page) {
  await toast(page)
    .getByRole("button", { name: /dismiss/i })
    .click();
  await expect(toast(page)).toHaveCount(0);
}
