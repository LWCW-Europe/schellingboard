import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";

// Phase-dependent UI, one seeded event per phase:
//   Conference Alpha — proposal phase
//   Conference Beta  — voting phase
//   Conference Gamma — scheduling phase
// Assertions target the deterministic event-specific "Lightning Talks" seed
// proposals, which other parallel tests never modify.
//
// The vote buttons on a proposal row are rendered for anyone who is not one of
// its hosts, and the phase only decides whether they are *enabled*. So these
// tests always act as a non-host of the row they assert on (Alice hosts
// Alpha's Lightning Talks, Bob Beta's, Charlie Gamma's) — asserting the
// buttons are absent for a host would pass no matter what the phase is.

test("proposal phase: proposing is open, voting is not yet available", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Alpha");
  // The schedule is not available yet — the event page routes to proposals
  await expect(page).toHaveURL(/\/Conference-Alpha\/proposals$/);

  // Even with a user selected, voting is not available because of the phase:
  // every vote button on a proposal row is disabled and quick voting is too
  await selectUser(page, /Bob Test/i);
  const row = page.getByRole("row", {
    name: /Conference Alpha Lightning Talks/,
  });
  await expect(row).toBeVisible();
  await expect(row.getByRole("button", { name: "❤️" })).toBeDisabled();
  await expect(row.getByRole("button", { name: "⭐" })).toBeDisabled();
  await expect(row.getByRole("button", { name: "👋🏽" })).toBeDisabled();
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

  // Proposing needs a name selected, so pick one before asking whether the
  // phase allows it — otherwise this asserts the identity gate, not the phase.
  await selectUser(page, /Alice Test/i);
  await expect(
    page.getByRole("link", { name: /Add Proposal/i })
  ).not.toHaveClass(/cursor-not-allowed/);

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

test("dev fake clock: time travel moves a proposal-phase event into voting", async ({
  page,
}) => {
  await login(page);
  // ?dev=1 reveals the dev clock toolbar (enabled by SB_ENABLE_DEV_TOOLS).
  await page.goto("/Conference-Alpha/proposals?dev=1");
  // Bob is not a host of Alpha's Lightning Talks, so the only thing gating his
  // vote button is the phase (Alice hosts it and would never see one).
  await selectUser(page, /Bob Test/i);

  const toolbar = page.getByText("Dev clock");
  await expect(toolbar).toBeVisible();

  const row = page.getByRole("row", {
    name: /Conference Alpha Lightning Talks/,
  });
  // Proposal phase: the interested-vote button is there but not yet usable.
  await expect(row.getByRole("button", { name: "❤️" })).toBeDisabled();

  // Alpha's voting phase opens 7 days out; jump +14 days to land inside it.
  await page.getByRole("button", { name: "+7d" }).click();
  await page.getByRole("button", { name: "+7d" }).click();

  // The same row now offers an enabled interested-vote button.
  await expect(row.getByRole("button", { name: "❤️" })).toBeEnabled();
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
  // Alice hosts none of Gamma's Lightning Talks, so this really is the phase
  // taking the vote buttons away, not host status hiding them.
  await expect(row.getByRole("button", { name: "❤️" })).toHaveCount(0);
});
