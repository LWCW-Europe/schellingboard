import { Locator, Page, expect } from "@playwright/test";
import { login } from "./auth";

// Opens the name-switcher modal via the site header and returns the
// "My name is:" combobox. The active name lives in a header chip (accessible
// name starts with "Your name"). With no name set, tapping it opens the
// modal directly. With a name already set there is no direct "switch"
// affordance — the chip opens a menu whose only exit is "Log out" — so this
// logs out first, landing on the anonymous state, then opens the modal.
// Logout clears the site login too, so on a password-protected site this
// re-prompts for the site password (deliberate friction — see
// docs/design/auth-improvements-plan.md).
export async function openNameSwitcher(page: Page): Promise<Locator> {
  const nameBox = page.getByLabel("My name is:");
  // A just-closed switcher modal fades out; wait for it to unmount so the
  // menu and the modal never match at the same time below.
  await expect(nameBox).toBeHidden();
  const chip = page.getByRole("button", { name: /your name/i });
  await chip.click();
  const logOut = page.getByRole("menuitem", { name: "Log out" });
  await expect(logOut.or(nameBox)).toBeVisible();
  if (await logOut.isVisible()) {
    await logOut.click();
    // Logging out clears the site login too (see logoutAction), and the
    // chip's optimistic UI update makes "Select your name" appear instantly
    // on the *old* page — well before logoutAction's hard reload actually
    // lands. Wait for the real navigation, not that transient text, or a
    // click below can land on a page mid-navigation-away. The test env
    // always sets SITE_PASSWORD, so the reload's destination is always
    // /login.
    await page.waitForURL((url) => url.pathname === "/login");
    await login(page);
    // Not getByText("Select your name"): some pages show a paragraph with
    // that same phrase (e.g. "select who you are before editing this...
    // Select your name in the header"), which would violate strict mode
    // alongside the chip. The anonymous chip's accessible name is exactly
    // "Your name" (the authenticated one is "Your name: <guest>").
    await expect(
      page.getByRole("button", { name: "Your name", exact: true })
    ).toBeVisible();
    await chip.click();
  }
  await nameBox.click();
  return nameBox;
}

// Selects the current identity via the site header.
export async function selectUser(page: Page, name: string | RegExp) {
  await openNameSwitcher(page);
  await page.getByRole("option", { name }).click();
}
