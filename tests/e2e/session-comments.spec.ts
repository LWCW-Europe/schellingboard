import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";

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

// A click landing while a mutation swaps the DOM is lost, so retry until the
// UI reflects it. Re-checking first keeps the retry from toggling back.
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

// getByText also matches a filled-in textarea's value, so a just-submitted
// reply would "be visible" inside its own form. Waiting for the paragraph the
// markdown renderer produces means waiting for the comment to actually show.
function postedComment(modal: Locator, text: string) {
  return modal.locator("section p", { hasText: text });
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
  await modal.getByRole("button", { name: "Comment" }).click();

  await expect(modal.getByRole("heading", { name: "1 comment" })).toBeVisible();
  await expect(modal.getByText("very")).toHaveCSS("font-weight", "700");
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
  await expect(reopened.getByText("bringing my laptop")).toBeVisible();
});

test("edits a comment, showing when it was edited, then deletes it", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  await actAs(page, /Alice Test/i);

  const modal = await openSession(page, EDIT_SESSION);
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
  await page.goto("/Conference-Gamma");
  await actAs(page, /Alice Test/i);

  const modal = await openSession(page, THREAD_SESSION);
  await modal.getByPlaceholder("Add a comment").fill("the opening question");
  await modal.getByRole("button", { name: "Comment" }).click();
  await expect(modal.getByText("the opening question")).toBeVisible();

  await openReplyForm(modal);
  await submitReply(modal, "the threaded answer");
  await expect(postedComment(modal, "the threaded answer")).toBeVisible();

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
    page.getByRole("dialog", { name: "Session details" })
  ).toBeHidden();

  await page.goto(permalink!);
  await expect(
    page
      .getByRole("dialog", { name: "Session details" })
      .getByText("the threaded answer")
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
  await modal.getByRole("button", { name: "Comment" }).click();
  await expect(modal.getByText("a doomed parent")).toBeVisible();

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
  await expect(postedComment(bobModal, "a surviving reply")).toBeVisible();
  await bobContext.close();

  // Her open modal fetched its comments before Bob replied; reloading shows
  // his reply arrived through the endpoint before she deletes the parent.
  await page.reload();
  const reopened = page.getByRole("dialog", { name: "Session details" });
  await expect(reopened.getByText("a doomed parent")).toBeVisible();
  await expect(reopened.getByText("a surviving reply")).toBeVisible();

  await reopened.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Yes" }).click();

  await expect(reopened.getByText("a doomed parent")).toHaveCount(0);
  await expect(reopened.getByText("Comment deleted")).toBeVisible();
  await expect(reopened.getByText("a surviving reply")).toBeVisible();
});

test("likes a comment and shows who liked it", async ({ page, browser }) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  await actAs(page, /Alice Test/i);

  const modal = await openSession(page, LIKE_SESSION);
  await modal.getByPlaceholder("Add a comment").fill("a likeable comment");
  await modal.getByRole("button", { name: "Comment" }).click();
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
  await modal.getByRole("button", { name: "Comment" }).click();
  await expect(postedComment(modal, "Who else is coming?")).toBeVisible();

  // Posting closes the reply form (onDone), so each reply waits for the
  // previous one to actually render before reopening the form.
  await openReplyForm(modal);
  await submitReply(modal, "I'd like to join.");
  await expect(postedComment(modal, "I'd like to join.")).toBeVisible();
  await openReplyForm(modal);
  await submitReply(modal, "So would I.");
  await expect(postedComment(modal, "So would I.")).toBeVisible();

  // Both hang off the same parent, so collapsing it takes them together.
  await toggleUntil(
    modal.getByRole("button", { name: "Collapse comment" }).first(),
    () => postedComment(modal, "Who else is coming?").isHidden()
  );
  await expect(postedComment(modal, "I'd like to join.")).toBeHidden();
  await expect(postedComment(modal, "So would I.")).toBeHidden();
});
