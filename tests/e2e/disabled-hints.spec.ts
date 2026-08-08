import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";
import { dismissToast, toast } from "./helpers/toast";

// A phone has no hover, so the tooltip explaining why a control is greyed out
// can never be seen there. Tapping the control has to say the same thing, and a
// screen reader has to be able to read it without tapping anything.
// `click({ force: true })` is how a tap on an unavailable control is expressed:
// Playwright treats aria-disabled as disabled and would wait for it to become
// enabled, while a finger just taps it.
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
  const interested = page.getByRole("button", { name: "❤️" }).first();
  await expect(interested).toHaveAccessibleDescription(
    /Voting will be enabled at/
  );
  await interested.click({ force: true });
  await expect(toast(page)).toContainText(/Voting will be enabled at/);
  await expect(page).toHaveURL(/\/Conference-Alpha\/proposals$/);
});

// The dev clock's picker takes local time, "YYYY-MM-DDTHH:mm".
function daysFromNow(days: number): string {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T12:00`;
}

test("after the event: a greyed-out control with no reason to give still does nothing", async ({
  page,
}) => {
  await login(page);
  // ?dev=1 reveals the dev clock toolbar (enabled by SB_ENABLE_DEV_TOOLS).
  await page.goto("/Conference-Alpha/proposals?dev=1");
  await selectUser(page, /Bob Test/i);

  // Alpha ends some six weeks out; past it every phase is over and none is
  // coming, so there is no reason left to state — the controls have to stay
  // just as unavailable as they are while a phase is pending.
  await page.getByLabel("Pick date and time").fill(daysFromNow(90));
  await expect(page.getByText(/Voting will be enabled at/)).toHaveCount(0);

  const unvoted = page.getByRole("button", { name: /unvoted/i });
  await expect(unvoted).toBeDisabled();
  await unvoted.click({ force: true });
  // Applying the filter would append its result count to the button.
  await expect(unvoted).toHaveText("Only unvoted");
  await expect(toast(page)).toHaveCount(0);
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
  await expect(schedule).toHaveAccessibleDescription(
    /Scheduling will be enabled at/
  );

  await schedule.click({ force: true });
  await expect(toast(page)).toContainText(/Scheduling will be enabled at/);
  await dismissToast(page);

  // A greyed-out control keeps its place in the tab order, so the keyboard
  // reaches the same explanation — and creating the session stays out of reach.
  await schedule.focus();
  await page.keyboard.press("Enter");
  await expect(toast(page)).toContainText(/Scheduling will be enabled at/);
  await expect(page).not.toHaveURL(/add-session/);
});
