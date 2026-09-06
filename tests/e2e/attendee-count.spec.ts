import { Page } from "@playwright/test";
import { DateTime } from "luxon";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { setDevClock } from "./helpers/dev-clock";
import { selectUser } from "./helpers/user";
import {
  getMessage,
  searchBySubject,
  skipWithoutMailpit,
} from "../helpers/mailpit";

// A host records how many people came to a session of theirs once it has
// finished. Only the browser reveals what is tested here: that the control
// appears for a host and not for an attendee, its idle → pending → saved
// feedback, a field-level error, and the phone layout (SC-006). The
// authorization and validation rules live in
// tests/integration/attendee-count.test.ts, where no browser is needed.
//
// Getting to a *finished* session means time travel: the seeded schedule is
// two weeks out. That goes through the dev fake clock (?dev=1), not the
// browser clock, because the entry gate is decided server-side by serverNow()
// (docs/dev/adr/0004-dev-fake-clock.md).
//
// Every test below claims a *different* seeded session, because the suite
// runs in parallel against one shared database: two tests recording into the
// same session would see each other's numbers.
test.use({ timezoneId: "Europe/Berlin" });

// Gamma's days run 09:00–18:00 Berlin from today+14
// (scripts/seed/seed-database.ts, scripts/seed/data/gamma-schedule.ts). 17:00
// is after every session scheduled on a day, and before the day itself ends —
// a day that has ended folds shut, taking its session links with it.
const lateOnGammaDay = (day: number) =>
  DateTime.now()
    .setZone("Europe/Berlin")
    .plus({ days: 14 + day })
    .set({ hour: 17, minute: 0, second: 0, millisecond: 0 });

const countInput = (page: Page) => page.getByLabel("How many people attended?");
const saveButton = (page: Page) =>
  page.getByRole("button", { name: "Save attendee count" });
const dialog = (page: Page) =>
  page.getByRole("dialog", { name: "Session details" });

// Land on Gamma's schedule as `who`, with the fake clock past the first day's
// sessions so the server-side gate is open from first paint. Also used to
// change identity mid-test: selectUser logs out and back in on its own.
async function landAs(page: Page, who: string, day = 0) {
  await page.goto("/Conference-Gamma?dev=1");
  await selectUser(page, who);
  await setDevClock(page, lateOnGammaDay(day));
  await page.reload();
}

async function openSession(page: Page, title: RegExp) {
  await page.getByRole("link", { name: title }).first().click();
  await expect(dialog(page)).toBeVisible();
}

test("a host records a count on a finished session and it persists", async ({
  page,
}) => {
  await login(page);
  await landAs(page, "Yuki Tanaka");
  await openSession(page, /The Future of AI/);

  // Empty state: optional, with the FR-008 copy that stops a host guessing
  // what 0 means or recording 0 for a session that never happened.
  await expect(countInput(page)).toHaveValue("");
  await expect(
    page.getByText(/0 if the session was held but nobody came/i)
  ).toBeVisible();
  await expect(page.getByText(/delete the session instead/i)).toBeVisible();

  await countInput(page).fill("12");
  await saveButton(page).click();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();

  await page.reload();
  await expect(countInput(page)).toHaveValue("12");

  // Clearing the field puts the session back to no recorded count.
  await countInput(page).fill("");
  await saveButton(page).click();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();
  await page.reload();
  await expect(countInput(page)).toHaveValue("");
});

test("saving announces that it is in progress before it confirms", async ({
  page,
}) => {
  await login(page);
  await landAs(page, "Isabella Rossi");
  await openSession(page, /Design Systems/);

  // Hold the server action open so the pending state is observable rather
  // than a race — it is a real state the control owes the user
  // (Constitution VI), not an implementation detail.
  let release = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(
    (url) => url.pathname.startsWith("/Conference-Gamma"),
    async (route, request) => {
      if (request.method() !== "POST") return route.continue();
      await held;
      return route.continue();
    }
  );

  await countInput(page).fill("7");
  await saveButton(page).click();

  await expect(page.getByText("Saving…")).toBeVisible();
  await expect(saveButton(page)).toBeDisabled();

  release();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();
});

test("an out-of-range value is reported on the field itself", async ({
  page,
}) => {
  await login(page);
  await landAs(page, "Arjun Nair");
  await openSession(page, /API Design/);

  await countInput(page).fill("1001");
  await saveButton(page).click();

  await expect(countInput(page)).toHaveAttribute("aria-invalid", "true");
  const messageId = await countInput(page).getAttribute("aria-describedby");
  expect(messageId).toBeTruthy();
  await expect(page.locator(`#${messageId}`)).toContainText("1000");

  // A value inside the range clears the error and saves.
  await countInput(page).fill("30");
  await saveButton(page).click();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();
  await expect(countInput(page)).not.toHaveAttribute("aria-invalid", "true");
});

test("an attendee who is not a host sees no count", async ({ page }) => {
  await login(page);
  await landAs(page, "Tereza Nováková");
  await openSession(page, /Open Source Sustainability/);
  await countInput(page).fill("42");
  await saveButton(page).click();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();

  await landAs(page, "Alice Test");
  await openSession(page, /Open Source Sustainability/);

  await expect(countInput(page)).toHaveCount(0);
  await expect(dialog(page)).not.toContainText("42");
  await expect(dialog(page)).not.toContainText(/how many people attended/i);
});

// SC-001: the whole point of the follow-up email. Carlos Silva hosts this
// session and no other spec touches him, so the mailbox search below cannot
// collide with a parallel worker.
test("a host follows the link in the follow-up email and records the count", async ({
  page,
}) => {
  test.skip(
    skipWithoutMailpit(),
    "mail env vars unset — start Mailpit (make mailpit) and set them in .env.test.local to run this test (see docs/dev/testing.md § Running tests)"
  );

  await login(page);
  // Day 2, 14:00–15:00 Berlin: by 17:00 the follow-up has long come due.
  await landAs(page, "Carlos Silva", 1);

  // The scheduler is off in E2E (REMINDER_DISPATCH_INTERVAL_MS=0, see
  // docs/dev/testing.md), so the dev toolbar's button stands in for the tick
  // that would run on a real deployment.
  await page.getByRole("button", { name: "Send due reminders" }).click();
  // Let the tick finish before navigating: an aborted dispatch would leave the
  // reminder claimed but unsent.
  await expect(page.getByText(/sent \d+ reminders/)).toBeVisible();

  const title = "Sustainable Software Development";
  const html = await followUpHtml(title, "carlos.silva@example.com");
  const link = /href="([^"]*record=count)"/.exec(html)?.[1];
  expect(link, "the follow-up must carry a record link").toBeTruthy();

  await page.goto(link!.replaceAll("&amp;", "&"));
  await expect(dialog(page)).toBeVisible();

  // Arriving from the email puts the cursor in the field: one interaction to
  // record (SC-001).
  await expect(countInput(page)).toBeFocused();
  await page.keyboard.type("23");
  await saveButton(page).click();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();

  await page.reload();
  await expect(countInput(page)).toHaveValue("23");
});

// Mailpit keeps mail from earlier runs, so read the newest match rather than
// insisting the mailbox holds exactly one.
async function followUpHtml(title: string, email: string): Promise<string> {
  const matching = async () =>
    (await searchBySubject(title)).filter(
      (m) =>
        m.Subject.startsWith("How many people came to") &&
        m.To.some((t) => t.Address === email)
    );
  await expect.poll(matching, { timeout: 10000 }).not.toHaveLength(0);
  return (await getMessage((await matching())[0].ID)).HTML;
}

// Story 3 was a prompt at the top of the schedule listing the sessions a host
// still owed a count for. It is withdrawn (FR-025): the notification list says
// the same thing in the place hosts already look, and it says it without
// nagging every schedule view. What is left to pin is its absence.
test("the schedule no longer nags a host about uncounted sessions", async ({
  page,
}) => {
  // Charlie Test hosts two Gamma sessions that have finished by 17:00 on day 1
  // — the opening keynote (day 0) and the React talk (day 1) — so this is the
  // host the prompt used to appear for.
  await login(page);
  await landAs(page, "Charlie Test", 1);

  const prompt = page.getByRole("region", {
    name: /sessions you haven.t counted/i,
  });

  // Both schedule views mounted the prompt, so check both: deleting one render
  // site would pass a test that only looked at the other.
  await expect(prompt).toHaveCount(0);
  await page.getByRole("button", { name: "Text" }).click();
  await expect(page.getByPlaceholder("Search sessions")).toBeVisible();
  await expect(prompt).toHaveCount(0);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the control fits without scrolling the page sideways (SC-006)", async ({
    page,
  }) => {
    await login(page);
    await landAs(page, "Min-jun Kim", 1);

    await openSession(page, /CRDT Show & Tell/);

    await expect(countInput(page)).toBeVisible();
    await expect(saveButton(page)).toBeVisible();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    // A pixel of slack for sub-pixel rounding; anything more is a real
    // sideways scroll.
    expect(overflow).toBeLessThanOrEqual(1);

    const box = (await saveButton(page).boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(390);
  });
});
