import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";

// Each test comments on a different seeded guest's profile: the suite runs in
// parallel against one shared database, so two tests on the same profile
// would see each other's comments.
async function openProfile(page: Page, name: string) {
  await page.goto("/guests");
  await page.getByRole("link", { name }).click();
  const profile = page.getByRole("dialog", { name });
  await expect(profile).toBeVisible();
  return profile;
}

// selectUser logs out and back in; navigating before that settles aborts the
// request and drops the selection.
async function actAs(page: Page, name: RegExp) {
  await selectUser(page, name);
  await expect(page.getByRole("button", { name: /^Your name:/ })).toBeVisible();
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

async function openReplyForm(profile: Locator) {
  const form = profile.getByPlaceholder("Write a reply");
  await toggleUntil(
    profile.getByRole("button", { name: "Reply" }).first(),
    () => form.isVisible()
  );
}

// Scoped to the open form: once a reply exists, its own "Reply" action button
// also matches, and it sits after the form in the DOM.
async function submitReply(profile: Locator, text: string) {
  const form = profile
    .locator("form", { has: profile.page().getByPlaceholder("Write a reply") })
    .first();
  await form.getByPlaceholder("Write a reply").fill(text);
  // Posting unmounts the form, so a click landing mid-swap is lost; retry
  // until it's gone. The draft survives, so fill before retrying.
  await toggleUntil(
    form.getByRole("button", { name: "Reply", exact: true }),
    () => form.isHidden()
  );
}

// getByText also matches a filled-in textarea's value, so a just-submitted
// reply would "be visible" inside its own form. Waiting for the paragraph the
// markdown renderer produces means waiting for the comment to actually show.
function postedComment(profile: Locator, text: string) {
  return profile.locator("section p", { hasText: text });
}

test("posts a comment on a profile and shows it when the profile reopens", async ({
  page,
}) => {
  await login(page);
  await actAs(page, /Bob Test/i);

  const profile = await openProfile(page, "Alice Test");
  await expect(
    profile.getByRole("heading", { name: "0 comments" })
  ).toBeVisible();

  await profile.getByPlaceholder("Add a comment").fill("see you at the venue");
  await profile.getByRole("button", { name: "Comment" }).click();

  await expect(
    profile.getByRole("heading", { name: "1 comment" })
  ).toBeVisible();
  await expect(profile.getByText("see you at the venue")).toBeVisible();

  // Comments load through their own endpoint when the profile opens, so
  // reopening must show them without any refresh.
  await page.keyboard.press("Escape");
  await expect(profile).toBeHidden();
  const reopened = await openProfile(page, "Alice Test");
  await expect(
    reopened.getByRole("heading", { name: "1 comment" })
  ).toBeVisible();
  await expect(reopened.getByText("see you at the venue")).toBeVisible();
});

test("shows an error instead of a permanent skeleton when comments fail to load", async ({
  page,
}) => {
  await login(page);

  // Fail the comments request outright: the section must own up to it rather
  // than leave its "Loading comments…" skeleton up forever.
  await page.route(/\/api\/profile\/[^/]+\/comments/, (route) => route.abort());

  const profile = await openProfile(page, "Alice Test");

  await expect(profile.getByRole("alert")).toHaveText(
    "Couldn't load comments."
  );
  await expect(
    profile.getByRole("heading", { name: "Loading comments..." })
  ).toHaveCount(0);
});

test("keeps the thread already shown when a reload fails", async ({ page }) => {
  await login(page);
  await actAs(page, /Alice Test/i);

  const profile = await openProfile(page, "Mateo Quispe");
  await expect(
    profile.getByRole("heading", { name: "0 comments" })
  ).toBeVisible();

  // Fail every comments request from here on, so the reload that posting
  // triggers dies. The thread already on screen has to survive it intact.
  await page.route(/\/api\/profile\/[^/]+\/comments/, (route) => route.abort());

  await profile
    .getByPlaceholder("Add a comment")
    .fill("posted with its reload cut off");
  await profile.getByRole("button", { name: "Comment" }).click();

  await expect(
    profile.getByRole("heading", { name: "0 comments" })
  ).toBeVisible();
  await expect(profile.getByRole("alert")).toHaveCount(0);
  await expect(
    profile.getByRole("heading", { name: "Loading comments..." })
  ).toHaveCount(0);
});

test("edits a comment, showing when it was edited, then deletes it", async ({
  page,
}) => {
  await login(page);
  await actAs(page, /Alice Test/i);

  const profile = await openProfile(page, "Yuki Tanaka");
  await profile.getByPlaceholder("Add a comment").fill("first thoughts");
  await profile.getByRole("button", { name: "Comment" }).click();
  await expect(postedComment(profile, "first thoughts").first()).toBeVisible();
  await expect(profile.getByText("(edited)")).toHaveCount(0);

  await profile.getByRole("button", { name: "Edit" }).click();
  await profile.getByPlaceholder("Edit your comment").fill("second thoughts");
  await profile.getByRole("button", { name: "Save" }).click();

  await expect(profile.getByText("second thoughts")).toBeVisible();
  await expect(profile.getByText("first thoughts")).toHaveCount(0);
  const editedMarker = profile.getByText("(edited)");
  await expect(editedMarker).toBeVisible();
  await expect(editedMarker).toHaveAttribute("title", /^Edited /);

  await profile.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Yes" }).click();

  await expect(profile.getByText("second thoughts")).toHaveCount(0);
  await expect(
    profile.getByRole("heading", { name: "0 comments" })
  ).toBeVisible();
});

test("replies to a profile comment, collapses the thread, and permalinks to the reply", async ({
  page,
}) => {
  await login(page);
  await actAs(page, /Alice Test/i);

  const profile = await openProfile(page, "Amara Okafor");
  await profile.getByPlaceholder("Add a comment").fill("which airport?");
  await profile.getByRole("button", { name: "Comment" }).click();
  const parent = postedComment(profile, "which airport?").first();
  await expect(parent).toBeVisible();

  await openReplyForm(profile);
  await submitReply(profile, "closest to the venue");
  const reply = postedComment(profile, "closest to the venue").first();
  await expect(reply).toBeVisible();

  await toggleUntil(
    profile.getByRole("button", { name: "Collapse comment" }).first(),
    () => parent.isHidden()
  );
  await expect(reply).toBeHidden();
  await expect(
    profile.getByRole("link", { name: "Alice Test" }).first()
  ).toBeVisible();

  await toggleUntil(
    profile.getByRole("button", { name: "Expand comment" }).first(),
    () => parent.isVisible()
  );

  // Each comment's timestamp links to that comment alone, parent and reply
  // getting distinct targets. Both have to be on the page before comparing:
  // with only the parent rendered, first and last are the same link.
  const timestamps = profile.getByRole("link", { name: /^\d/ });
  await expect(timestamps).toHaveCount(2);
  const parentPermalink = await timestamps.first().getAttribute("href");
  const permalink = await timestamps.last().getAttribute("href");
  expect(permalink).toMatch(/^\/guests\/[^/?]+#comment-/);
  expect(permalink).not.toBe(parentPermalink);

  // The permalink is a real profile URL: opening it cold lands on this
  // profile with the reply shown (and highlighted).
  await page.goto(permalink!);
  const opened = page.getByRole("dialog", { name: "Amara Okafor" });
  await expect(opened).toBeVisible();
  await expect(
    opened.locator("section p", { hasText: "closest to the venue" })
  ).toBeVisible();
});

test("keeps replies readable when their parent is deleted", async ({
  page,
  browser,
}) => {
  await login(page);
  await actAs(page, /Alice Test/i);

  const profile = await openProfile(page, "Priya Sharma");
  await profile.getByPlaceholder("Add a comment").fill("a doomed parent");
  await profile.getByRole("button", { name: "Comment" }).click();
  await expect(postedComment(profile, "a doomed parent").first()).toBeVisible();

  // Someone else replies, so deleting the parent can't simply remove it. A
  // second context, not a second page: pages share the identity cookie.
  const bobContext = await browser.newContext();
  const bob = await bobContext.newPage();
  await login(bob);
  await actAs(bob, /Bob Test/i);
  const bobProfile = await openProfile(bob, "Priya Sharma");
  await openReplyForm(bobProfile);
  await submitReply(bobProfile, "a surviving reply");
  await expect(
    postedComment(bobProfile, "a surviving reply").first()
  ).toBeVisible();
  await bobContext.close();

  // Her open modal fetched its comments before Bob replied; reloading shows
  // his reply arrived through the endpoint before she deletes the parent.
  await page.reload();
  const reopened = page.getByRole("dialog", { name: "Priya Sharma" });
  await expect(reopened.getByText("a doomed parent").first()).toBeVisible();
  await expect(reopened.getByText("a surviving reply").first()).toBeVisible();

  await reopened.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Yes" }).click();

  await expect(reopened.getByText("a doomed parent")).toHaveCount(0);
  await expect(reopened.getByText("Comment deleted")).toBeVisible();
  await expect(reopened.getByText("a surviving reply")).toBeVisible();
});

test("likes a comment and shows who liked it", async ({ page, browser }) => {
  await login(page);
  await actAs(page, /Alice Test/i);

  const profile = await openProfile(page, "Jean-Pierre Dubois");
  await profile.getByPlaceholder("Add a comment").fill("a likeable comment");
  await profile.getByRole("button", { name: "Comment" }).click();
  await expect(
    postedComment(profile, "a likeable comment").first()
  ).toBeVisible();

  const like = profile.getByRole("button", { name: "Like", exact: true });
  const liked = profile.getByRole("button", { name: "Liked", exact: true });
  await like.click();
  await expect(liked).toBeVisible();
  await expect(profile.getByRole("button", { name: "1 like" })).toBeVisible();

  // A second context, not a second page: pages share the identity cookie.
  const bobContext = await browser.newContext();
  const bob = await bobContext.newPage();
  await login(bob);
  await actAs(bob, /Bob Test/i);
  const bobProfile = await openProfile(bob, "Jean-Pierre Dubois");
  await bobProfile.getByRole("button", { name: "Like", exact: true }).click();
  await expect(
    bobProfile.getByRole("button", { name: "2 likes" })
  ).toBeVisible();
  await bobContext.close();

  await page.reload();
  const reopened = page.getByRole("dialog", { name: "Jean-Pierre Dubois" });
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
  const profile = await openProfile(page, "Charlie Test");

  await expect(
    profile.getByText("Select your name to leave a comment.")
  ).toBeVisible();
  await expect(profile.getByPlaceholder("Add a comment")).toHaveCount(0);
});

test("nests sibling replies under the comment they answer", async ({
  page,
}) => {
  await login(page);
  await actAs(page, /Alice Test/i);

  const profile = await openProfile(page, "Thabo Ndlovu");
  await profile.getByPlaceholder("Add a comment").fill("Who else is coming?");
  await profile.getByRole("button", { name: "Comment" }).click();
  await expect(
    postedComment(profile, "Who else is coming?").first()
  ).toBeVisible();

  // Posting closes the reply form (onDone), so each reply waits for the
  // previous one to actually render before reopening the form.
  await openReplyForm(profile);
  await submitReply(profile, "I'd like to join.");
  await expect(
    postedComment(profile, "I'd like to join.").first()
  ).toBeVisible();
  await openReplyForm(profile);
  await submitReply(profile, "So would I.");
  await expect(postedComment(profile, "So would I.").first()).toBeVisible();

  // Both hang off the same parent, so collapsing it takes them together.
  await toggleUntil(
    profile.getByRole("button", { name: "Collapse comment" }).first(),
    () => postedComment(profile, "Who else is coming?").isHidden()
  );
  await expect(postedComment(profile, "I'd like to join.")).toBeHidden();
  await expect(postedComment(profile, "So would I.")).toBeHidden();
});
