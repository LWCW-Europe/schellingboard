import { test, expect } from "./helpers/fixtures";
import { loginAndGoto } from "./helpers/auth";
import { selectUser } from "./helpers/user";

/**
 * The viewer's 1-on-1s on the schedule: the grid's column when several share a
 * slot, and the text views. The fixture is seeded rather than booked through
 * the UI here — arranging five 1-on-1s takes five attendees and five user
 * switches, and what is under test is how the schedule draws them. Booking one
 * is covered by meetings-request.spec.ts.
 *
 * Conference Gamma is the seeded event in its scheduling phase, and Zanele's
 * first morning there holds two 1-on-1s at 10:00 and three at 11:00
 * (scripts/seed/seed-database.ts).
 */
const VIEWER = "Zanele Khumalo";
const AT_TEN = ["Leilani Kahale", "Samuel Adeyemi"];
const AT_ELEVEN = ["Marta Horvat", "Dmitri Volkov", "Chiara Bianchi"];

test.describe("parallel 1-on-1s on the schedule", () => {
  test("stacks what fits the slot and collapses what does not", async ({
    page,
  }) => {
    await loginAndGoto(page, "/guests");
    await selectUser(page, VIEWER);
    await page.getByRole("link", { name: "Conference Gamma" }).first().click();

    // Two in a slot: both readable at full column width, one above the other
    // rather than in half-width slivers.
    const [confirmed, waiting] = AT_TEN.map((name) =>
      page.getByRole("link", { name: new RegExp(`${name} at 10:00`) })
    );
    await expect(confirmed).toBeVisible();
    await expect(waiting).toBeVisible();
    const confirmedBox = (await confirmed.boundingBox())!;
    const waitingBox = (await waiting.boundingBox())!;
    expect(waitingBox.width).toBe(confirmedBox.width);
    expect(waitingBox.y).toBeGreaterThanOrEqual(
      confirmedBox.y + confirmedBox.height
    );

    // And each opens its own 1-on-1, the request among them still answerable.
    await waiting.click();
    const details = page.getByRole("dialog", { name: "1-on-1 details" });
    await expect(
      details.getByRole("heading", { name: `1-on-1 with ${AT_TEN[1]}` })
    ).toBeVisible();
    await expect(details.getByRole("button", { name: "Accept" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(details).toBeHidden();

    // Three in a slot no longer fit, so the block stands for the slot itself
    // and opens the list.
    const crowded = page.getByRole("button", {
      name: "3 1-on-1s, 11:00 – 11:30 — 3 need your reply",
    });
    await expect(crowded).toBeVisible();
    await crowded.click();

    const slotList = page.getByRole("dialog", {
      name: /3 1-on-1s, 11:00 – 11:30/,
    });
    const listed = AT_ELEVEN.map((name) =>
      slotList.getByRole("link", { name: new RegExp(name) })
    );
    for (const row of listed) await expect(row).toBeVisible();
    await listed[1].click();
    await expect(
      details.getByRole("heading", { name: `1-on-1 with ${AT_ELEVEN[1]}` })
    ).toBeVisible();
  });
});

// The Text and RSVP'd views used to list sessions only, so switching to either
// made the viewer's own 1-on-1s vanish from the schedule (#1023).
test.describe("1-on-1s in the Text and RSVP'd views", () => {
  test("Text lists them all, RSVP'd only the confirmed", async ({ page }) => {
    await loginAndGoto(page, "/guests");
    await selectUser(page, VIEWER);
    await page.getByRole("link", { name: "Conference Gamma" }).first().click();

    const [confirmed, waiting] = AT_TEN.map((name) =>
      page.getByRole("link", { name: `1-on-1 with ${name}`, exact: true })
    );
    const details = page.getByRole("dialog", { name: "1-on-1 details" });

    await page.getByRole("button", { name: "Text" }).click();
    // Only the text views have a search box, so the grid is gone.
    await expect(page.getByPlaceholder("Search sessions")).toBeVisible();
    await expect(confirmed).toBeVisible();
    await expect(waiting).toBeVisible();
    await waiting.click();
    await expect(
      details.getByRole("heading", { name: `1-on-1 with ${AT_TEN[1]}` })
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(details).toBeHidden();

    // Waiting on an answer is no commitment yet; its going also shows the
    // Text view has given way.
    await page.getByRole("button", { name: "RSVP'd" }).click();
    await expect(waiting).toBeHidden();
    await expect(confirmed).toBeVisible();
    await confirmed.click();
    await expect(
      details.getByRole("heading", { name: `1-on-1 with ${AT_TEN[0]}` })
    ).toBeVisible();
  });
});
