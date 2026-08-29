import type { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { uniqueSuffix } from "./helpers/unique";
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

  // The chosen vote is exposed as a pressed toggle and marked with a check,
  // not by background colour alone (see issue #802).
  await expect(interestedButton).toHaveAttribute("aria-pressed", "true");
  await expect(interestedButton).toContainText("✓");

  // Change vote to "Maybe" (⭐ emoji button)
  const maybeButton = proposalRow.getByRole("button", { name: "⭐" });
  await maybeButton.click();

  // Verify the maybe button is now active and interested is not
  await expect(maybeButton).toHaveAttribute("aria-pressed", "true");
  await expect(maybeButton).toContainText("✓");
  await expect(interestedButton).toHaveAttribute("aria-pressed", "false");
  await expect(interestedButton).not.toContainText("✓");

  // Change vote to "Skip" (👋🏽 emoji button)
  const skipButton = proposalRow.getByRole("button", { name: "👋🏽" });
  await skipButton.click();

  // Verify the skip button is now active and others are not
  await expect(skipButton).toHaveAttribute("aria-pressed", "true");
  await expect(maybeButton).toHaveAttribute("aria-pressed", "false");
  await expect(interestedButton).toHaveAttribute("aria-pressed", "false");
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

  // Bob always has something left to vote on: the three event-specific Beta
  // proposals are seeded without any votes at all (see
  // eventSpecificTitlePatterns in scripts/seed/data/templates.ts) and Bob
  // hosts at most one of them.
  const progress = page.getByText(/You have voted on \d+ \/ \d+ proposals/);
  await expect(progress).toBeVisible();
  const before = Number(/\d+/.exec((await progress.textContent()) ?? "")?.[0]);
  const interestedButton = page.getByRole("button", { name: /❤️ Interested/i });
  await expect(interestedButton).toBeVisible();

  await interestedButton.click();

  // The counter is this page's own state, updated optimistically — so it
  // counts up by exactly one even when another worker votes as Bob too.
  await expect(progress).toHaveText(
    new RegExp(`You have voted on ${before + 1} / `)
  );
  // ...and the page moves on to the next proposal, or to the end of the queue.
  await expect(
    interestedButton.or(page.getByText(/You have voted on all proposals/))
  ).toBeVisible();

  // Navigate back to proposals overview
  await page.getByRole("link", { name: /← Proposals/i }).click();
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
  const title = `E2E Vote Target ${uniqueSuffix()}`;
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
  await expect(row.getByRole("button", { name: "❤️" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );

  // A second user votes on the same proposal with a different choice.
  // (There is no visible aggregate tally during the voting phase, so the
  // combined count is asserted per-user here; tally aggregation is covered
  // by tests/integration/voting.test.ts.)
  await selectUser(page, /Charlie Test/i);
  await expect(row.getByRole("button", { name: "❤️" })).toHaveAttribute(
    "aria-pressed",
    "false"
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
  await expect(row.getByRole("button", { name: "⭐" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await selectUser(page, /Alice Test/i);
  await expect(row.getByRole("button", { name: "❤️" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(row.getByRole("button", { name: "⭐" })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
});

test("should show voting disabled state when not logged in as a user", async ({
  page,
}) => {
  await loginAndGoto(page, "/Conference-Beta/proposals");

  // Find the first proposal row (skip header)
  const firstProposalRow = page.getByRole("row").nth(1);
  await expect(firstProposalRow).toBeVisible();

  // Quick voting is offered but unavailable, and says why on hover.
  const quickVotingLink = page.getByRole("link", {
    name: /Go to Quick Voting!/i,
  });
  await expect(quickVotingLink).toHaveClass(/opacity-50|cursor-not-allowed/);
  await expect(quickVotingLink).toHaveAttribute("aria-disabled", "true");

  // Without a name selected there is nobody to vote as, so the per-proposal
  // vote buttons are not rendered at all.
  await expect(
    firstProposalRow.getByRole("button", { name: "❤️" })
  ).toHaveCount(0);
  await expect(
    firstProposalRow.getByRole("button", { name: "⭐" })
  ).toHaveCount(0);
  await expect(
    firstProposalRow.getByRole("button", { name: "👋🏽" })
  ).toHaveCount(0);
});

// Conference Gamma is in the scheduling phase, where the vote breakdown is
// shown. Hana Kobayashi hosts the first proposal; nobody hosts the second.
const HOSTED_PROPOSAL = "Writing Documentation People Actually Read";
const HOSTLESS_PROPOSAL = "Ask Me Anything: Migrating a Legacy Monolith";

async function openGammaProposal(page: Page, title: string) {
  await page.goto("/Conference-Gamma/proposals");
  await page.getByPlaceholder("Search proposals").fill(title);
  await page.getByRole("link", { name: title }).click();
  const modal = page.getByRole("dialog", { name: "Proposal details" });
  await expect(modal).toBeVisible();
  return modal;
}

test("a host sees the vote breakdown of their own proposal", async ({
  page,
}) => {
  await loginAndGoto(page, "/Conference-Gamma/proposals");
  await selectUser(page, /Hana Kobayashi/i);

  const modal = await openGammaProposal(page, HOSTED_PROPOSAL);
  const breakdown = modal.getByRole("region", { name: "Vote breakdown" });

  await expect(breakdown.getByText(/of \d+ attendees/)).toBeVisible();
  await expect(breakdown.getByText(/Did not vote/)).toBeVisible();
  await expect(breakdown.getByText(/Interested/)).toBeVisible();
  await expect(breakdown.getByText(/Maybe/)).toBeVisible();
  await expect(breakdown.getByText(/Skip/)).toBeVisible();
  await expect(
    breakdown.getByText(/If you decide to host this as a session, expect \d/)
  ).toBeVisible();
});

test("someone else's proposal keeps its vote breakdown private", async ({
  page,
}) => {
  await loginAndGoto(page, "/Conference-Gamma/proposals");
  await selectUser(page, /Alice Test/i);

  const modal = await openGammaProposal(page, HOSTED_PROPOSAL);

  await expect(
    modal.getByRole("region", { name: "Vote breakdown" })
  ).toHaveCount(0);
});

test("a proposal nobody hosts shows its vote breakdown to everyone", async ({
  page,
}) => {
  await loginAndGoto(page, "/Conference-Gamma/proposals");
  await selectUser(page, /Alice Test/i);

  const modal = await openGammaProposal(page, HOSTLESS_PROPOSAL);

  await expect(
    modal.getByRole("region", { name: "Vote breakdown" })
  ).toBeVisible();
});

// Seeded with a host (Charlie Test) but no votes at all — below the turnout
// the estimate needs.
const UNVOTED_PROPOSAL = "Conference Gamma Lightning Talks: Community Showcase";

test("a proposal hardly anyone voted on gets no attendance guess", async ({
  page,
}) => {
  await loginAndGoto(page, "/Conference-Gamma/proposals");
  await selectUser(page, /Charlie Test/i);

  const modal = await openGammaProposal(page, UNVOTED_PROPOSAL);
  const breakdown = modal.getByRole("region", { name: "Vote breakdown" });

  await expect(breakdown.getByText(/Too few attendees voted/)).toBeVisible();
  await expect(
    breakdown.getByText(/If you decide to host this as a session/)
  ).toHaveCount(0);
});
