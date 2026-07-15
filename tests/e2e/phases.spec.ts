import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";

// Phase-dependent UI, one seeded event per phase:
//   Conference Alpha — proposal phase
//   Conference Beta  — voting phase
//   Conference Gamma — scheduling phase
// Assertions target the deterministic event-specific "Lightning Talks" seed
// proposals, which other parallel tests never modify.

test("proposal phase: proposing is open, voting is not yet available", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Alpha");
  // The schedule is not available yet — the event page routes to proposals
  await expect(page).toHaveURL(/\/Conference-Alpha\/proposals$/);

  // Even with a user selected, voting is not available because of the phase:
  // proposal rows offer no voting buttons and quick voting is disabled
  await selectUser(page, /Alice Test/i);
  const row = page.getByRole("row", {
    name: /Conference Alpha Lightning Talks/,
  });
  await expect(row).toBeVisible();
  await expect(row.getByRole("button", { name: "❤️" })).toHaveCount(0);
  await expect(row.getByRole("button", { name: "⭐" })).toHaveCount(0);
  await expect(row.getByRole("button", { name: "👋🏽" })).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Go to Quick Voting!/i })
  ).toHaveClass(/opacity-50|cursor-not-allowed/);

  // Proposing is open
  await expect(
    page.getByRole("link", { name: /Add Proposal/i })
  ).not.toHaveClass(/cursor-not-allowed/);
});

test("voting phase: proposing and voting are open, scheduling is not", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Beta");
  await expect(page).toHaveURL(/\/Conference-Beta\/proposals$/);

  await expect(
    page.getByRole("link", { name: /Add Proposal/i })
  ).not.toHaveClass(/cursor-not-allowed/);

  await selectUser(page, /Alice Test/i);
  const row = page.getByRole("row", {
    name: /Conference Beta Lightning Talks/,
  });
  await expect(row.getByRole("button", { name: "❤️" })).toBeEnabled();

  // No path to session creation: the schedule link is disabled and no
  // "Add session" slots are offered anywhere
  await expect(page.getByRole("link", { name: /View Schedule/i })).toHaveClass(
    /opacity-50|cursor-not-allowed/
  );
  await expect(page.getByRole("link", { name: "Add session" })).toHaveCount(0);
});

test("scheduling phase: grid is interactive, proposing and voting are over", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  await expect(page.getByRole("button", { name: "Grid" })).toBeVisible();
  // The grid offers free slots for adding sessions
  await expect(
    page.getByRole("link", { name: "Add session" }).first()
  ).toBeVisible();

  // On the proposals page, proposing and voting are closed
  await page.goto("/Conference-Gamma/proposals");
  await selectUser(page, /Alice Test/i);
  await expect(page.getByRole("link", { name: /Add Proposal/i })).toHaveClass(
    /opacity-50|cursor-not-allowed/
  );
  await expect(
    page.getByRole("link", { name: /Go to Quick Voting!/i })
  ).toHaveClass(/opacity-50|cursor-not-allowed/);
  const row = page.getByRole("row", {
    name: /Conference Gamma Lightning Talks/,
  });
  await expect(row).toBeVisible();
  await expect(row.getByRole("button", { name: "❤️" })).toHaveCount(0);
});
