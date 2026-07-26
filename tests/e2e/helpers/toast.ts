import { Locator, Page, expect } from "@playwright/test";

export function toast(page: Page): Locator {
  return page.getByRole("status");
}

// Confirmation toasts never time out, so they sit over the bottom of the page
// until dismissed — clear them before a test carries on clicking underneath.
export async function dismissToast(page: Page) {
  await toast(page)
    .getByRole("button", { name: /dismiss/i })
    .click();
  await expect(toast(page)).toHaveCount(0);
}
