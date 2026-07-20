import { Page, expect } from "@playwright/test";

const DEFAULT_PASSWORD = process.env.TEST_PASSWORD || "testtest";

export async function login(page: Page, password: string = DEFAULT_PASSWORD) {
  const passwordInput = page.locator('input[name="password"]').first();
  if (!(await passwordInput.isVisible())) {
    await page.goto("/");
  }
  await passwordInput.fill(password);
  await page.click('button[type="submit"]');
  // Not waitForURL: a request that reaches the login form via a redirect
  // chain (e.g. logging out from an authenticated page) can already show
  // "/" in the address bar, so waiting for the URL to leave "/login"
  // resolves immediately, before the login request completes.
  await expect(passwordInput).toBeHidden();
}

export async function loginAndGoto(page: Page, path: string) {
  await login(page);
  await page.goto(path);
}
