import type { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";
import { openReplyForm, submitReply, toggleUntil } from "./helpers/comments";

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
const LIKE_PROPOSAL =
  /Networking & Coffee Chat: Connect with Conference Gamma Peers/;

async function openProposal(page: Page, title: RegExp) {
  await page.getByRole("row", { name: title }).locator("td").first().click();
  const modal = page.getByRole("dialog", { name: "Proposal details" });
  await expect(modal).toBeVisible();
  return modal;
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
  await modal.getByRole("button", { name: "Comment", exact: true }).click();

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
  await modal.getByRole("button", { name: "Comment", exact: true }).click();
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
  await modal.getByRole("button", { name: "Comment", exact: true }).click();
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
  // getting distinct targets. Both have to be on the page before comparing:
  // with only the parent rendered, first and last are the same link.
  const timestamps = modal.getByRole("link", { name: /^\d/ });
  await expect(timestamps).toHaveCount(2);
  const parentPermalink = await timestamps.first().getAttribute("href");
  const permalink = await timestamps.last().getAttribute("href");
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
  await modal.getByRole("button", { name: "Comment", exact: true }).click();
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

test("likes a comment and shows who liked it", async ({ page, browser }) => {
  await login(page);
  await page.goto("/Conference-Gamma/proposals");
  await actAs(page, /Alice Test/i);

  const modal = await openProposal(page, LIKE_PROPOSAL);
  await modal.getByPlaceholder("Add a comment").fill("a likeable comment");
  await modal.getByRole("button", { name: "Comment", exact: true }).click();
  await expect(modal.getByText("a likeable comment")).toBeVisible();

  const like = modal.getByRole("button", { name: "Like", exact: true });
  const liked = modal.getByRole("button", { name: "Liked", exact: true });
  await like.click();
  await expect(liked).toBeVisible();
  await expect(modal.getByRole("button", { name: "1 like" })).toBeVisible();

  // A second context, not a second page: pages share the identity cookie.
  const bobContext = await browser.newContext();
  const bob = await bobContext.newPage();
  await login(bob);
  await bob.goto("/Conference-Gamma/proposals");
  await actAs(bob, /Bob Test/i);
  const bobModal = await openProposal(bob, LIKE_PROPOSAL);
  await bobModal.getByRole("button", { name: "Like", exact: true }).click();
  await expect(bobModal.getByRole("button", { name: "2 likes" })).toBeVisible();
  await bobContext.close();

  await page.reload();
  // Hovering previews the likers, newest first, without opening anything.
  const count = page.getByRole("button", { name: "2 likes" });
  const tooltip = page.getByRole("tooltip");
  await expect(tooltip).toHaveCSS("opacity", "0");
  await count.hover();
  await expect(tooltip).toHaveCSS("opacity", "1");
  await expect(tooltip).toHaveText(/^Bob TestAlice Test$/);

  await count.click();
  const likers = page.getByRole("dialog", { name: "Liked by" });
  await expect(likers.getByRole("link", { name: "Alice Test" })).toBeVisible();
  await expect(likers.getByRole("link", { name: "Bob Test" })).toBeVisible();
  // One avatar per liker — an uploaded image or the initials fallback, both
  // decorative and so hidden from the accessibility tree.
  await expect(likers.locator("li [aria-hidden='true']")).toHaveCount(2);
  await likers.getByRole("button", { name: "Close" }).click();
  // The pointer never left the count, but the click dismissed its preview.
  await expect(tooltip).toHaveCSS("opacity", "0");

  await liked.click();
  await expect(like).toBeVisible();
  await expect(page.getByRole("button", { name: "1 like" })).toBeVisible();
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
