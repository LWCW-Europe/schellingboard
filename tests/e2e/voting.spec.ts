import { test, expect } from "./helpers/fixtures";
import { loginAndGoto, login } from "./helpers/auth";
import { selectUser } from "./helpers/user";

test("should allow voting on proposals with different choices", async ({
  page,
}) => {
  await login(page);

  // Go to proposals list for Conference Beta (voting phase)
  await page.goto("/Conference-Beta/proposals");

  // Select a user via the header name picker
  await selectUser(page, /Alice Test/i);

  // Choose a proposal created by Charlie Test
  const proposalRow = page.getByRole("row", {
    name: /Networking & Coffee Chat: Connect with Conference Beta Peers/,
  });

  // Verify the row exists
  await expect(proposalRow).toBeVisible();

  // Vote "Interested" (❤️ emoji button)
  const interestedButton = proposalRow.getByRole("button", { name: "❤️" });
  await interestedButton.click();

  // Verify the button shows active state (should have blue background)
  await expect(interestedButton).toHaveClass(/bg-blue-200/);

  // Change vote to "Maybe" (⭐ emoji button)
  const maybeButton = proposalRow.getByRole("button", { name: "⭐" });
  await maybeButton.click();

  // Verify the maybe button is now active and interested is not
  await expect(maybeButton).toHaveClass(/bg-blue-200/);
  await expect(interestedButton).not.toHaveClass(/bg-blue-200/);

  // Change vote to "Skip" (👋🏽 emoji button)
  const skipButton = proposalRow.getByRole("button", { name: "👋🏽" });
  await skipButton.click();

  // Verify the skip button is now active and others are not
  await expect(skipButton).toHaveClass(/bg-blue-200/);
  await expect(maybeButton).not.toHaveClass(/bg-blue-200/);
  await expect(interestedButton).not.toHaveClass(/bg-blue-200/);
});

test("should navigate to quick voting and allow voting on proposals", async ({
  page,
}) => {
  await login(page);

  // Go to proposals list for Conference Beta (voting phase)
  await page.goto("/Conference-Beta/proposals");

  // Select a user via the header name picker
  await selectUser(page, /Bob Test/i);

  // Click on "Go to Quick Voting!" link
  await page.getByRole("link", { name: /Go to Quick Voting!/i }).click();

  // Verify we're on the quick voting page
  await expect(page).toHaveURL(/\/Conference-Beta\/proposals\/quick-voting$/);
  await expect(page.getByText(/Quick Voting/i)).toBeVisible();

  // Verify voting progress is shown
  await expect(page.getByText(/You have voted on/)).toBeVisible();

  // Check if there's a proposal to vote on
  const interestedButton = page.getByRole("button", { name: /❤️ Interested/i });

  // If there are proposals to vote on, vote on one
  if (await interestedButton.isVisible()) {
    // Vote "Interested" on the current proposal
    await interestedButton.click();

    // After voting, either a new proposal should appear or we should see completion message
    const hasMoreProposals = await interestedButton
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    const completionMessage = await page
      .getByText(/You have voted on all proposals/)
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    expect(hasMoreProposals || completionMessage).toBe(true);
  } else {
    // If no proposals to vote on, we should see the completion message
    await expect(
      page.getByText(/You have voted on all proposals/)
    ).toBeVisible();
  }

  // Navigate back to proposals overview
  await page.getByRole("link", { name: /Back to Proposals/i }).click();
  await expect(page).toHaveURL(/\/Conference-Beta\/proposals$/);
});

test("votes from two users persist independently across reloads", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Beta/proposals");

  // Create a throwaway proposal hosted by Bob Test, before selecting a user
  // (a selected user would be prefilled as host, and hosts get no voting
  // buttons on their own proposals). The host matters: the quick-voting test
  // in this file votes as Bob in a parallel worker, and quick voting never
  // offers proposals the current user hosts, so no other test can add votes
  // to this proposal.
  const title = `E2E Vote Target ${Date.now()}`;
  await page.getByRole("link", { name: /Add Proposal/i }).click();
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Host(s)").click();
  await page.keyboard.type("Bob Test");
  await page.getByRole("option", { name: /Bob Test/i }).click();
  await page.keyboard.press("Escape");
  await Promise.all([
    page.waitForURL(/\/Conference-Beta\/proposals$/),
    page.getByRole("button", { name: /Submit/i }).click(),
  ]);

  // Vote as Alice
  await selectUser(page, /Alice Test/i);

  const row = page.getByRole("row", { name: new RegExp(title) });
  await expect(row).toBeVisible();

  // Vote "Interested". Voting updates optimistically, so wait for the server
  // to confirm before reloading.
  await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes("/api/add-vote") && res.ok()
    ),
    row.getByRole("button", { name: "❤️" }).click(),
  ]);

  // The vote persists across a reload
  await page.reload();
  await expect(row).toBeVisible();
  await expect(row.getByRole("button", { name: "❤️" })).toHaveClass(
    /bg-blue-200/
  );

  // A second user votes on the same proposal with a different choice.
  // (There is no visible aggregate tally during the voting phase, so the
  // combined count is asserted per-user here; tally aggregation is covered
  // by tests/integration/voting.test.ts.)
  await selectUser(page, /Charlie Test/i);
  await expect(row.getByRole("button", { name: "❤️" })).not.toHaveClass(
    /bg-blue-200/
  );
  await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes("/api/add-vote") && res.ok()
    ),
    row.getByRole("button", { name: "⭐" }).click(),
  ]);

  // Each user still sees their own vote after a reload
  await page.reload();
  await expect(row).toBeVisible();
  await expect(row.getByRole("button", { name: "⭐" })).toHaveClass(
    /bg-blue-200/
  );
  await selectUser(page, /Alice Test/i);
  await expect(row.getByRole("button", { name: "❤️" })).toHaveClass(
    /bg-blue-200/
  );
  await expect(row.getByRole("button", { name: "⭐" })).not.toHaveClass(
    /bg-blue-200/
  );
});

test("should show voting disabled state when not logged in as a user", async ({
  page,
}) => {
  await loginAndGoto(page, "/Conference-Beta/proposals");

  // Find the first proposal row (skip header)
  const firstProposalRow = page.getByRole("row").nth(1);
  await expect(firstProposalRow).toBeVisible();

  // Check that voting buttons are disabled or not present for non-logged in users
  // The buttons should either be disabled or not visible when no user is selected
  const interestedButton = firstProposalRow.getByRole("button", { name: "❤️" });
  const maybeButton = firstProposalRow.getByRole("button", { name: "⭐" });
  const skipButton = firstProposalRow.getByRole("button", { name: "👋🏽" });

  if (await interestedButton.isVisible()) {
    // If buttons are visible, they should be disabled
    await expect(interestedButton).toBeDisabled();
    await expect(maybeButton).toBeDisabled();
    await expect(skipButton).toBeDisabled();
  }

  // Check that the "Go to Quick Voting!" button is disabled
  const quickVotingLink = page.getByRole("link", {
    name: /Go to Quick Voting!/i,
  });
  if (await quickVotingLink.isVisible()) {
    await expect(quickVotingLink).toHaveClass(/opacity-50|cursor-not-allowed/);
  }
});
