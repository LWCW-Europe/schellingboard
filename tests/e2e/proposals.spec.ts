import { test, expect } from "./helpers/fixtures";
import { loginAndGoto, login } from "./helpers/auth";
import { selectUser } from "./helpers/user";

test("should auto-focus the title input for new proposals", async ({
  page,
}) => {
  await loginAndGoto(page, "/Conference-Alpha/proposals/new");
  await expect(page.getByLabel("Title")).toBeFocused();
});

test("should create a new session proposal, edit it, and add hosts", async ({
  page,
}) => {
  await login(page);

  // Go to proposals list first (optional, helps ensure baseline loaded)
  await page.goto("/Conference-Alpha/proposals");
  // Generate a unique title to avoid collisions between runs
  const proposalTitle = `Playwright Test Proposal ${Date.now()}`;
  await expect(page.getByText(proposalTitle).first()).toHaveCount(0); // ensure not present

  await page
    .getByRole("link", { name: /Add Proposal/i })
    .click({ timeout: 5000 });
  await expect(
    page.getByRole("heading", { name: /Add Session Proposal/i })
  ).toBeVisible();

  // Fill form
  await page.getByLabel("Title").fill(proposalTitle);
  await page
    .getByLabel("Description")
    .fill("This is a test proposal created by an automated Playwright test.");
  // (Optional) select a duration, not required
  const durationRadio = page.locator("#duration-60");
  if (await durationRadio.count()) {
    await durationRadio.check();
  }

  // Submit
  await Promise.all([
    page.waitForURL(/\/Conference-Alpha\/proposals$/),
    page.getByRole("button", { name: /Submit/i }).click(),
  ]);

  // Assert new proposal appears in list (may need slight waiting for Airtable consistency)
  // Narrow selector to the desktop table to avoid also matching the hidden mobile card version
  await expect(
    page.getByRole("row", { name: new RegExp(proposalTitle) })
  ).toBeVisible();

  // Click the edit button directly (rather than clicking the row to navigate first)
  const proposalRow = page.getByRole("row", {
    name: new RegExp(proposalTitle),
  });
  await proposalRow.getByRole("button", { name: /Edit/i }).click();
  await expect(
    page.getByRole("heading", { name: /Edit Session Proposal/i })
  ).toBeVisible();

  // Click the hosts combobox to open it (it opens on focus) and type directly
  await page.getByLabel("Host(s)").click();
  await page.keyboard.type("Alice Test");
  await page.getByRole("option", { name: /Alice Test/i }).click();

  // Add second host - dropdown stays open in multi-select mode, just type
  await page.keyboard.type("Bob Test");
  await page.getByRole("option", { name: /Bob Test/i }).click();

  // Close the still-open hosts dropdown so it doesn't overlay Submit
  await page.keyboard.press("Escape");

  // Submit the edited form
  await page.getByRole("button", { name: /Submit/i }).click();
  await page.waitForURL(/\/Conference-Alpha\/proposals$/);

  // Verify the hosts appear in the proposals list
  const updatedRow = page.getByRole("row", { name: new RegExp(proposalTitle) });
  await expect(updatedRow).toBeVisible();
  await expect(updatedRow).toContainText("Alice Test");
  await expect(updatedRow).toContainText("Bob Test");
});

test("should delete a proposal from its edit page", async ({ page }) => {
  await login(page);
  await page.goto("/Conference-Alpha/proposals");

  // Create a throwaway proposal so seeded data stays untouched
  const proposalTitle = `Playwright Delete Proposal ${Date.now()}`;
  await page.getByRole("link", { name: /Add Proposal/i }).click();
  await page.getByLabel("Title").fill(proposalTitle);
  await Promise.all([
    page.waitForURL(/\/Conference-Alpha\/proposals$/),
    page.getByRole("button", { name: /Submit/i }).click(),
  ]);
  const row = page.getByRole("row", { name: new RegExp(proposalTitle) });
  await expect(row).toBeVisible();

  // Delete lives on the edit page and requires confirmation
  await row.getByRole("button", { name: /Edit/i }).click();
  await expect(
    page.getByRole("heading", { name: /Edit Session Proposal/i })
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByText("Delete session proposal?")).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/Conference-Alpha\/proposals$/),
    page.getByRole("button", { name: "Yes" }).click(),
  ]);

  // Gone from the list, also after a reload
  await expect(
    page.getByRole("row", { name: new RegExp(proposalTitle) })
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("row", { name: new RegExp(proposalTitle) })
  ).toHaveCount(0);
});

test("a non-host cannot edit or delete another guest's proposal", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Alpha/proposals");
  const proposalTitle = `Playwright Ownership Proposal ${Date.now()}`;

  // Alice creates a proposal; she's prefilled as its only host.
  await selectUser(page, /Alice Test/i);
  await page.getByRole("link", { name: /Add Proposal/i }).click();
  await page.getByLabel("Title").fill(proposalTitle);
  await expect(page.getByRole("main").getByText("Alice Test")).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/Conference-Alpha\/proposals$/),
    page.getByRole("button", { name: /Submit/i }).click(),
  ]);
  const row = page.getByRole("row", { name: new RegExp(proposalTitle) });
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: /Edit/i }).click();
  await expect(
    page.getByRole("heading", { name: /Edit Session Proposal/i })
  ).toBeVisible();
  const editUrl = page.url();

  // Bob switches in; the list no longer offers him an Edit affordance...
  await selectUser(page, /Bob Test/i);
  await expect(
    page.getByRole("button", { name: "Your name: Bob Test" })
  ).toBeVisible();
  await page.getByRole("link", { name: /Back to Proposals/i }).click();
  await page.waitForURL(/\/Conference-Alpha\/proposals$/);
  await expect(
    page.getByRole("row", { name: new RegExp(proposalTitle) })
  ).not.toContainText("Edit");

  // ...and revisiting the edit page directly (e.g. via browser history) is
  // refused server-side too, not just hidden from the UI.
  await page.goto(editUrl);
  await expect(
    page.getByText(/Only a host of this proposal can edit it/i)
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Edit Session Proposal/i })
  ).toHaveCount(0);
});

test("should open proposal detail page when clicking on a proposal", async ({
  page,
}) => {
  await login(page);

  // Go to proposals list
  await page.goto("/Conference-Alpha/proposals");

  // Find any existing proposal in the table (should have some from test data).
  // Exclude throwaway "Playwright ..." proposals: other tests in this file
  // create, rename, and delete them in parallel workers, so picking one here
  // races with their deletion and breaks the final "still in the list" check.
  const firstProposalRow = page
    .getByRole("row")
    .filter({ hasNotText: "Playwright" })
    .nth(1); // Skip header row
  await expect(firstProposalRow).toBeVisible();

  // Get the proposal title for verification
  const proposalTitleCell = firstProposalRow.locator("td").first();
  const proposalTitle = (await proposalTitleCell.textContent()) || "";
  expect(proposalTitle).toBeTruthy();

  await proposalTitleCell.click();

  // Verify the modal is open using the proper ARIA role
  const modal = page.getByRole("dialog");

  await expect(modal).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(page).toHaveURL(/\/Conference-Alpha\/proposals\?viewProposal=/);

  // Verify the proposal title is displayed as a heading within the modal
  await expect(
    modal.getByRole("heading", { name: proposalTitle })
  ).toBeVisible();

  // Reload with viewProposal in the URL. This is the "paste link" /
  // "refresh while modal is open" scenario for testing hydration accuracy.
  await page.reload();
  await expect(
    page.getByRole("dialog", { name: "Proposal details" })
  ).toBeVisible();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: proposalTitle })
  ).toBeVisible();

  const closeButton = modal.getByRole("button", { name: /close/i });
  await expect(closeButton).toBeVisible();

  // Test closing the modal by clicking the close button (real user behavior)
  await closeButton.click();

  // Verify the modal is closed by checking that the close button is no longer visible
  await expect(closeButton).not.toBeVisible();

  // Verify we're back on the proposals list page by checking URL
  await expect(page).toHaveURL(/\/Conference-Alpha\/proposals$/);

  // Test opening the modal again to verify it can be reopened
  await proposalTitleCell.click();
  await expect(modal).toBeVisible();

  // Test closing by clicking outside the modal content (common user behavior)
  // Click in an area that should be the backdrop
  await page.click("body", { position: { x: 50, y: 50 } });

  // Verify modal is closed again
  await expect(modal).not.toBeVisible();

  // Verify the proposal we viewed is still in the list
  await expect(
    page.getByRole("row", { name: new RegExp(proposalTitle) })
  ).toBeVisible();
});
