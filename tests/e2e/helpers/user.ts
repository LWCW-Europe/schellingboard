import { Locator, Page, expect } from "@playwright/test";
import { login } from "./auth";

// Clicks `trigger` until `opened` shows up. The header is server-rendered, so
// its buttons are clickable — by every check Playwright makes — a moment
// before React has attached their handlers, and a click in that window is
// simply dropped. Waiting for hydration is not observable; clicking again is.
// Re-checking first keeps a retry from clicking what the previous attempt
// already opened: that would toggle the menu shut again, and with the modal it
// would hang outright, since the dialog's backdrop makes the chip unclickable
// and nothing bounds a click's actionability wait.
export async function tapUntilOpen(
  trigger: Locator,
  opened: Locator
): Promise<void> {
  await expect(async () => {
    if (!(await opened.isVisible())) {
      await trigger.click();
    }
    await expect(opened).toBeVisible({ timeout: 2000 });
  }).toPass();
}

// Opens the name-switcher modal via the site header and returns the
// "My name is:" combobox. The active name lives in a header chip (accessible
// name starts with "Your name"). With no name set, tapping it opens the
// modal directly. With a name already set there is no direct "switch"
// affordance — the chip opens a menu whose only exit is "Log out" — so this
// logs out first, landing on the anonymous state, then opens the modal.
// Logout clears the site login too, so on a password-protected site this
// re-prompts for the site password (deliberate friction — see
// docs/dev/design/auth-improvements-plan.md).
export async function openNameSwitcher(page: Page): Promise<Locator> {
  const nameBox = page.getByLabel("My name is:");
  // A just-closed switcher modal fades out; wait for it to unmount so the
  // menu and the modal never match at the same time below.
  await expect(nameBox).toBeHidden();
  const chip = page.getByRole("button", { name: /your name/i });
  const logOut = page.getByRole("menuitem", { name: "Log out" });
  await tapUntilOpen(chip, logOut.or(nameBox));
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
    await tapUntilOpen(chip, nameBox);
  }
  await nameBox.click();
  return nameBox;
}

// Selects the current identity via the site header. Only for unprotected
// guests: a protected one answers the pick with a password form instead, which
// keeps the modal open (see user-auth.spec.ts, which drives that by hand).
export async function selectUser(page: Page, name: string | RegExp) {
  await openNameSwitcher(page);
  await page.getByRole("option", { name }).click();
  // Picking a name is a server round trip (selectUserAction); only once it
  // lands does the modal close and the header chip take the new name.
  // Returning any earlier hands the next step a page whose identity is still
  // the old one, under a modal that is still covering it — the usual cause of
  // "the click did nothing" flakes once parallel workers slow the server down.
  await expect(page.getByLabel("My name is:")).toBeHidden();
  await expect(
    page.getByRole("button", { name: /^Your name: / })
  ).toBeVisible();
}
