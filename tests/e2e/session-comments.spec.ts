import type { Page } from "@playwright/test";
import { expect, test } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";
import {
  openReplyForm,
  postedComment,
  submitReply,
  toggleUntil,
} from "./helpers/comments";

// Conference Gamma is in the scheduling phase, so only its schedule has
// sessions. Each test claims its own session: the suite runs in parallel
// against one shared database, so two tests commenting on the same session
// would see each other's comments.
const CRDT_SESSION = /Hallway Track: CRDT Show & Tell/;
const EDIT_SESSION = /Design Systems: Creating Consistency at Scale/;
const THREAD_SESSION =
  /Open Source Sustainability: Funding and Community Building/;
const TOMBSTONE_SESSION = /API Design: RESTful vs GraphQL vs gRPC/;
const LIKE_SESSION = /Microservices Architecture: Lessons from the Trenches/;
const CLOSING_SESSION = /Closing Session & Farewell/;
const SIBLINGS_SESSION =
  /Blockchain Beyond Cryptocurrency: Practical Applications/;

async function openSession(page: Page, title: RegExp) {
  await page.getByRole("link", { name: title }).click();
  const modal = page.getByRole("dialog", { name: "Session details" });
  await expect(modal).toBeVisible();
  return modal;
}

// selectUser logs out and back in; navigating before that settles aborts the
// request and drops the selection.
async function actAs(page: Page, name: RegExp) {
  await selectUser(page, name);
  await expect(page.getByRole("button", { name: /^Your name:/ })).toBeVisible();
}

test("posts a comment on a session and renders it as markdown", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  // Bob hasn't RSVP'd here, so his only link in the modal will be as the
  // comment's author.
  await actAs(page, /Bob Test/i);

  const modal = await openSession(page, CRDT_SESSION);
  await expect(
    modal.getByRole("heading", { name: "0 comments" })
  ).toBeVisible();

  const body = "bringing my laptop — **very** ready";
  await modal.getByPlaceholder("Add a comment").fill(body);
  await modal.getByRole("button", { name: "Comment", exact: true }).click();

  await expect(modal.getByRole("heading", { name: "1 comment" })).toBeVisible();
  await expect(
    modal.locator("section p strong", { hasText: "very" })
  ).toHaveCSS("font-weight", "700");
  await expect(modal.getByRole("link", { name: "Bob Test" })).toBeVisible();
  await expect(modal.getByPlaceholder("Add a comment")).toHaveValue("");

  // Comments load through their own endpoint when the modal opens, so
  // reopening must show them without any refresh.
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
  const reopened = await openSession(page, CRDT_SESSION);
  await expect(
    reopened.getByRole("heading", { name: "1 comment" })
  ).toBeVisible();
  await expect(reopened.getByText("bringing my laptop").first()).toBeVisible();
});

test("edits a comment, showing when it was edited, then deletes it", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  await actAs(page, /Alice Test/i);

  const modal = await openSession(page, EDIT_SESSION);
  await modal.getByPlaceholder("Add a comment").fill("first thoughts");
  await modal.getByRole("button", { name: "Comment", exact: true }).click();
  await expect(postedComment(modal, "first thoughts").first()).toBeVisible();
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
  await page.goto("/Conference-Gamma");
  await actAs(page, /Alice Test/i);

  const modal = await openSession(page, THREAD_SESSION);
  await modal.getByPlaceholder("Add a comment").fill("the opening question");
  await modal.getByRole("button", { name: "Comment", exact: true }).click();
  const parent = postedComment(modal, "the opening question").first();
  await expect(parent).toBeVisible();

  await openReplyForm(modal);
  await submitReply(modal, "the threaded answer");
  const reply = postedComment(modal, "the threaded answer").first();
  await expect(reply).toBeVisible();

  await toggleUntil(
    modal.getByRole("button", { name: "Collapse comment" }).first(),
    () => parent.isHidden()
  );
  await expect(reply).toBeHidden();
  await expect(
    modal.getByRole("link", { name: "Alice Test" }).first()
  ).toBeVisible();

  await toggleUntil(
    modal.getByRole("button", { name: "Expand comment" }).first(),
    () => parent.isVisible()
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
    page.getByRole("dialog", { name: "Session details" })
  ).toBeHidden();

  await page.goto(permalink!);
  await expect(
    page
      .getByRole("dialog", { name: "Session details" })
      .getByText("the threaded answer")
      .first()
  ).toBeVisible();
});

test("keeps replies readable when their parent is deleted", async ({
  page,
  browser,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  await actAs(page, /Alice Test/i);

  const modal = await openSession(page, TOMBSTONE_SESSION);
  await modal.getByPlaceholder("Add a comment").fill("a doomed parent");
  await modal.getByRole("button", { name: "Comment", exact: true }).click();
  await expect(postedComment(modal, "a doomed parent").first()).toBeVisible();

  // Someone else replies, so deleting the parent can't simply remove it. A
  // second context, not a second page: pages share the identity cookie.
  const bobContext = await browser.newContext();
  const bob = await bobContext.newPage();
  await login(bob);
  await bob.goto("/Conference-Gamma");
  await actAs(bob, /Bob Test/i);
  const bobModal = await openSession(bob, TOMBSTONE_SESSION);
  await openReplyForm(bobModal);
  await submitReply(bobModal, "a surviving reply");
  await expect(
    postedComment(bobModal, "a surviving reply").first()
  ).toBeVisible();
  await bobContext.close();

  // Her open modal fetched its comments before Bob replied; reloading shows
  // his reply arrived through the endpoint before she deletes the parent.
  await page.reload();
  const reopened = page.getByRole("dialog", { name: "Session details" });
  await expect(reopened.getByText("a doomed parent").first()).toBeVisible();
  await expect(reopened.getByText("a surviving reply").first()).toBeVisible();

  await reopened.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Yes" }).click();

  await expect(reopened.getByText("a doomed parent")).toHaveCount(0);
  await expect(reopened.getByText("Comment deleted")).toBeVisible();
  await expect(reopened.getByText("a surviving reply")).toBeVisible();
});

test("likes a comment and shows who liked it", async ({ page, browser }) => {
  // Two identities, each a real logout-then-login round trip, plus a second
  // browser context and a reload, add up to just over the 30s default once
  // parallel workers compete for the server.
  test.slow();

  await login(page);
  await page.goto("/Conference-Gamma");
  await actAs(page, /Alice Test/i);

  const modal = await openSession(page, LIKE_SESSION);
  await modal.getByPlaceholder("Add a comment").fill("a likeable comment");
  await modal.getByRole("button", { name: "Comment", exact: true }).click();
  await expect(
    postedComment(modal, "a likeable comment").first()
  ).toBeVisible();

  const like = modal.getByRole("button", { name: "Like", exact: true });
  const liked = modal.getByRole("button", { name: "Liked", exact: true });
  await like.click();
  await expect(liked).toBeVisible();
  await expect(modal.getByRole("button", { name: "1 like" })).toBeVisible();

  // A second context, not a second page: pages share the identity cookie.
  const bobContext = await browser.newContext();
  const bob = await bobContext.newPage();
  await login(bob);
  await bob.goto("/Conference-Gamma");
  await actAs(bob, /Bob Test/i);
  const bobModal = await openSession(bob, LIKE_SESSION);
  await bobModal.getByRole("button", { name: "Like", exact: true }).click();
  await expect(bobModal.getByRole("button", { name: "2 likes" })).toBeVisible();
  await bobContext.close();

  await page.reload();
  const reopened = page.getByRole("dialog", { name: "Session details" });
  // Hovering previews the likers, newest first, without opening anything.
  const count = reopened.getByRole("button", { name: "2 likes" });
  // The reloaded modal fetches its comments, so wait for the count before
  // asserting on the preview: an absent tooltip would satisfy nothing.
  await expect(count).toBeVisible();
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

  await reopened.getByRole("button", { name: "Liked", exact: true }).click();
  await expect(
    reopened.getByRole("button", { name: "Like", exact: true })
  ).toBeVisible();
  await expect(reopened.getByRole("button", { name: "1 like" })).toBeVisible();
});

test("asks visitors without a name to select one before commenting", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");

  const modal = await openSession(page, CLOSING_SESSION);

  await expect(
    modal.getByText("Select your name to leave a comment.")
  ).toBeVisible();
  await expect(modal.getByPlaceholder("Add a comment")).toHaveCount(0);
});

test("nests sibling replies under the comment they answer", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  await actAs(page, /Alice Test/i);

  const modal = await openSession(page, SIBLINGS_SESSION);
  await modal.getByPlaceholder("Add a comment").fill("Who else is coming?");
  await modal.getByRole("button", { name: "Comment", exact: true }).click();
  await expect(
    postedComment(modal, "Who else is coming?").first()
  ).toBeVisible();

  // Posting closes the reply form (onDone), so each reply waits for the
  // previous one to actually render before reopening the form.
  await openReplyForm(modal);
  await submitReply(modal, "I'd like to join.");
  await expect(postedComment(modal, "I'd like to join.").first()).toBeVisible();
  await openReplyForm(modal);
  await submitReply(modal, "So would I.");
  await expect(postedComment(modal, "So would I.").first()).toBeVisible();

  // Both hang off the same parent, so collapsing it takes them together.
  await toggleUntil(
    modal.getByRole("button", { name: "Collapse comment" }).first(),
    () => postedComment(modal, "Who else is coming?").isHidden()
  );
  await expect(postedComment(modal, "I'd like to join.")).toBeHidden();
  await expect(postedComment(modal, "So would I.")).toBeHidden();
});
