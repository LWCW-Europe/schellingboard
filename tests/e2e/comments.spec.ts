import type { Locator, Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";

// Each test claims its own proposal: the suite runs in parallel against one
// shared database, so two tests commenting on the same proposal would see
// each other's comments.
const MARKDOWN_PROPOSAL =
  /Networking & Coffee Chat: Connect with Conference Beta Peers/;
const EDIT_PROPOSAL = /Conference Beta Lightning Talks: Community Showcase/;
const THREAD_PROPOSAL =
  /Conference Beta Panel: Industry Leaders Share Their Insights/;
const TOMBSTONE_PROPOSAL =
  /Networking & Coffee Chat: Connect with Conference Alpha Peers/;
const ANONYMOUS_PROPOSAL =
  /Conference Alpha Lightning Talks: Community Showcase/;
const BRANCHING_PROPOSAL =
  /Conference Gamma Panel: Industry Leaders Share Their Insights/;

async function openProposal(page: Page, title: RegExp) {
  await page.getByRole("row", { name: title }).locator("td").first().click();
  const modal = page.getByRole("dialog", { name: "Proposal details" });
  await expect(modal).toBeVisible();
  return modal;
}

// A click landing while router.refresh() swaps the DOM is lost, so retry until
// the UI reflects it. Re-checking first keeps the retry from toggling back.
async function toggleUntil(button: Locator, settled: () => Promise<boolean>) {
  await expect(async () => {
    if (!(await settled())) {
      await button.click();
    }
    expect(await settled()).toBe(true);
  }).toPass();
}

async function openReplyForm(modal: Locator) {
  const form = modal.getByPlaceholder("Write a reply");
  await toggleUntil(modal.getByRole("button", { name: "Reply" }).first(), () =>
    form.isVisible()
  );
}

// Scoped to the open form: once a reply exists, its own "Reply" action button
// also matches, and it sits after the form in the DOM.
async function submitReply(modal: Locator, text: string) {
  const form = modal.locator("form", {
    has: modal.page().getByPlaceholder("Write a reply"),
  });
  await form.getByPlaceholder("Write a reply").fill(text);
  await form.getByRole("button", { name: "Reply", exact: true }).click();
}

// selectUser logs out and back in; navigating before that settles aborts the
// request and drops the selection.
async function actAs(page: Page, name: RegExp) {
  await selectUser(page, name);
  await expect(page.getByRole("button", { name: /^Your name:/ })).toBeVisible();
}

test("posts a comment on a proposal and renders it as markdown", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Beta/proposals");
  await actAs(page, /Alice Test/i);

  const modal = await openProposal(page, MARKDOWN_PROPOSAL);
  await expect(
    modal.getByRole("heading", { name: "0 comments" })
  ).toBeVisible();

  const body = "Count me in — **very** keen";
  await modal.getByPlaceholder("Add a comment").fill(body);
  await modal.getByRole("button", { name: "Comment" }).click();

  await expect(modal.getByRole("heading", { name: "1 comment" })).toBeVisible();
  await expect(modal.getByText("very")).toHaveCSS("font-weight", "700");
  await expect(modal.getByRole("link", { name: "Alice Test" })).toBeVisible();
  await expect(modal.getByPlaceholder("Add a comment")).toHaveValue("");

  await page.reload();
  const reopened = page.getByRole("dialog", { name: "Proposal details" });
  await expect(
    reopened.getByRole("heading", { name: "1 comment" })
  ).toBeVisible();
});

test("edits a comment, showing when it was edited, then deletes it", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Beta/proposals");
  await actAs(page, /Alice Test/i);

  const modal = await openProposal(page, EDIT_PROPOSAL);
  await modal.getByPlaceholder("Add a comment").fill("first thoughts");
  await modal.getByRole("button", { name: "Comment" }).click();
  await expect(modal.getByText("first thoughts")).toBeVisible();
  await expect(modal.getByText("(edited)")).toHaveCount(0);

  await modal.getByRole("button", { name: "Edit" }).click();
  await modal.getByPlaceholder("Edit your comment").fill("second thoughts");
  await modal.getByRole("button", { name: "Save" }).click();

  await expect(modal.getByText("second thoughts")).toBeVisible();
  await expect(modal.getByText("first thoughts")).toHaveCount(0);
  const editedMarker = modal.getByText("(edited)");
  await expect(editedMarker).toBeVisible();
  await expect(editedMarker).toHaveAttribute("title", /^Edited /);

  await modal.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Yes" }).click();

  await expect(modal.getByText("second thoughts")).toHaveCount(0);
  await expect(
    modal.getByRole("heading", { name: "0 comments" })
  ).toBeVisible();
});

test("replies to a comment, collapses the thread, and permalinks to a reply", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Beta/proposals");
  await actAs(page, /Alice Test/i);

  const modal = await openProposal(page, THREAD_PROPOSAL);
  await modal.getByPlaceholder("Add a comment").fill("the opening question");
  await modal.getByRole("button", { name: "Comment" }).click();
  await expect(modal.getByText("the opening question")).toBeVisible();

  await openReplyForm(modal);
  await submitReply(modal, "the threaded answer");
  await expect(modal.getByText("the threaded answer")).toBeVisible();

  await toggleUntil(
    modal.getByRole("button", { name: "Collapse comment" }).first(),
    () => modal.getByText("the opening question").isHidden()
  );
  await expect(modal.getByText("the threaded answer")).toBeHidden();
  await expect(
    modal.getByRole("link", { name: "Alice Test" }).first()
  ).toBeVisible();

  await toggleUntil(
    modal.getByRole("button", { name: "Expand comment" }).first(),
    () => modal.getByText("the opening question").isVisible()
  );

  // Each comment's timestamp links to that comment alone, parent and reply
  // getting distinct targets.
  const parentPermalink = await modal
    .getByRole("link", { name: /^\d/ })
    .first()
    .getAttribute("href");

  const permalink = await modal
    .getByRole("link", { name: /^\d/ })
    .last()
    .getAttribute("href");
  expect(permalink).toMatch(/#comment-/);
  expect(permalink).not.toBe(parentPermalink);

  // Following a permalink in place must not add a history entry: dismissing
  // the modal goes back, and would otherwise only undo the hash.
  await modal.getByRole("link", { name: /^\d/ }).last().click();
  await expect(page).toHaveURL(/#comment-/);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Proposal details" })
  ).toBeHidden();

  await page.goto(permalink!);
  await expect(
    page
      .getByRole("dialog", { name: "Proposal details" })
      .getByText("the threaded answer")
  ).toBeVisible();
});

test("keeps replies readable when their parent is deleted", async ({
  page,
  browser,
}) => {
  await login(page);
  await page.goto("/Conference-Alpha/proposals");
  await actAs(page, /Alice Test/i);

  const modal = await openProposal(page, TOMBSTONE_PROPOSAL);
  await modal.getByPlaceholder("Add a comment").fill("a doomed parent");
  await modal.getByRole("button", { name: "Comment" }).click();
  await expect(modal.getByText("a doomed parent")).toBeVisible();

  // Someone else replies, so deleting the parent can't simply remove it. A
  // second context, not a second page: pages share the identity cookie.
  const bobContext = await browser.newContext();
  const bob = await bobContext.newPage();
  await login(bob);
  await bob.goto("/Conference-Alpha/proposals");
  await actAs(bob, /Bob Test/i);
  const bobModal = await openProposal(bob, TOMBSTONE_PROPOSAL);
  await openReplyForm(bobModal);
  await submitReply(bobModal, "a surviving reply");
  await expect(bobModal.getByText("a surviving reply")).toBeVisible();
  await bobContext.close();

  await page.reload();
  await modal.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Yes" }).click();

  await expect(modal.getByText("a doomed parent")).toHaveCount(0);
  await expect(modal.getByText("Comment deleted")).toBeVisible();
  await expect(modal.getByText("a surviving reply")).toBeVisible();
});

test("asks visitors without a name to select one before commenting", async ({
  page,
}) => {
  await login(page);

  await page.goto("/Conference-Alpha/proposals");
  const modal = await openProposal(page, ANONYMOUS_PROPOSAL);

  await expect(
    modal.getByText("Select your name to leave a comment.")
  ).toBeVisible();
  await expect(modal.getByPlaceholder("Add a comment")).toHaveCount(0);
});

test("nests sibling replies under the comment they answer", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma/proposals");

  const modal = await openProposal(page, BRANCHING_PROPOSAL);
  await expect(modal.getByText("Who else is on the panel?")).toBeVisible();
  await expect(modal.getByText("I'd like to join.")).toBeVisible();
  await expect(modal.getByText("So would I.")).toBeVisible();

  // Both hang off the same parent, so collapsing it takes them together.
  await toggleUntil(
    modal.getByRole("button", { name: "Collapse comment" }).first(),
    () => modal.getByText("Who else is on the panel?").isHidden()
  );
  await expect(modal.getByText("I'd like to join.")).toBeHidden();
  await expect(modal.getByText("So would I.")).toBeHidden();
});
