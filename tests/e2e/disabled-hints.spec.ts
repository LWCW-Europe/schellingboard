import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";
import { dismissToast, toast } from "./helpers/toast";

// A phone has no hover, so the tooltip explaining why a control is greyed out
// can never be seen there. Tapping the control has to say the same thing.
// `click({ force: true })` is how a tap on a *disabled* control is expressed:
// Playwright would otherwise wait for it to become enabled, while a real
// finger doesn't care and the tap lands on the hint overlay above it.
test.use({ viewport: { width: 390, height: 844 } });

test("proposal phase: tapping a greyed-out vote button says when voting opens", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Alpha/proposals");
  // Bob hosts none of Alpha's deterministic seed proposals, so the only thing
  // gating his vote buttons is the phase.
  await selectUser(page, /Bob Test/i);

  await page
    .getByRole("link", { name: /Go to Quick Voting!/i })
    .click({ force: true });
  await expect(toast(page)).toContainText(/Voting will be enabled at/);
  await expect(page).toHaveURL(/\/Conference-Alpha\/proposals$/);
  await dismissToast(page);

  // On a proposal card the whole card is a link, so the tap must reach the
  // vote button's explanation rather than opening the proposal.
  await page.getByRole("button", { name: "❤️" }).first().click({ force: true });
  await expect(toast(page)).toContainText(/Voting will be enabled at/);
  await expect(page).toHaveURL(/\/Conference-Alpha\/proposals$/);
});

test("voting phase: tapping a greyed-out Schedule button says when scheduling opens", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Beta/proposals");
  // Bob hosts Beta's Lightning Talks, so its page offers him Schedule.
  await selectUser(page, /Bob Test/i);

  await page
    .getByRole("link", { name: /Conference Beta Lightning Talks/ })
    .click();
  const proposal = page.getByRole("dialog");
  await expect(proposal).toBeVisible();
  const schedule = proposal.getByRole("button", { name: /Schedule/i });
  await expect(schedule).toBeDisabled();

  await schedule.click({ force: true });
  await expect(toast(page)).toContainText(/Scheduling will be enabled at/);
});
