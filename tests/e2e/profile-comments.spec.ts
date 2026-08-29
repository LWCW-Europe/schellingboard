import type { Page } from "@playwright/test";
import { expect, test } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";
import { openReplyForm, postedComment, submitReply } from "./helpers/comments";

// Each test comments on a different seeded guest's profile: the suite runs in
// parallel against one shared database, so two tests on the same profile
// would see each other's comments.
async function openProfile(page: Page, name: string) {
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

test("posts a comment on a profile and shows it when the profile reopens", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");
  await actAs(page, /Bob Test/i);

  const profile = await openProfile(page, "Alice Test");
  await expect(
    profile.getByRole("heading", { name: "0 comments" })
  ).toBeVisible();

  await profile.getByPlaceholder("Add a comment").fill("see you at the venue");
  await profile.getByRole("button", { name: "Comment", exact: true }).click();

  await expect(
    profile.getByRole("heading", { name: "1 comment" })
  ).toBeVisible();
  await expect(
    postedComment(profile, "see you at the venue").first()
  ).toBeVisible();

  // Comments load through their own endpoint when the profile opens, so
  // reopening must show them without any refresh.
  await page.keyboard.press("Escape");
  await expect(profile).toBeHidden();
  const reopened = await openProfile(page, "Alice Test");
  await expect(
    reopened.getByRole("heading", { name: "1 comment" })
  ).toBeVisible();
  await expect(
    postedComment(reopened, "see you at the venue").first()
  ).toBeVisible();
});

test("replies to a profile comment and permalinks to the reply", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");
  await actAs(page, /Alice Test/i);

  const profile = await openProfile(page, "Bob Test");
  await profile.getByPlaceholder("Add a comment").fill("which airport?");
  await profile.getByRole("button", { name: "Comment", exact: true }).click();
  await expect(postedComment(profile, "which airport?").first()).toBeVisible();

  await openReplyForm(profile);
  await submitReply(profile, "whatever is closest to the venue");
  await expect(
    postedComment(profile, "closest to the venue").first()
  ).toBeVisible();

  // Each comment's timestamp links to that comment alone, parent and reply
  // getting distinct targets. Both have to be on the page before comparing:
  // with only the parent rendered, first and last are the same link.
  const timestamps = profile.getByRole("link", { name: /^\d/ });
  await expect(timestamps).toHaveCount(2);
  const permalink = await timestamps.last().getAttribute("href");
  expect(permalink).toMatch(/^\/guests\/[^/?]+#comment-/);

  // The permalink is a real profile URL: opening it cold lands on this
  // profile with the reply shown (and highlighted).
  await page.goto(permalink!);
  const opened = page.getByRole("dialog", { name: "Bob Test" });
  await expect(opened).toBeVisible();
  await expect(
    postedComment(opened, "closest to the venue").first()
  ).toBeVisible();
});

// A section that can't reach its endpoint used to sit on a "Loading
// comments..." skeleton forever (profiles) or claim "0 comments" (sessions),
// both of which say something untrue about the thread.
test("says comments could not be loaded rather than showing an empty thread", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");
  await page.route("**/api/profile/*/comments*", (route) =>
    route.fulfill({ status: 500, body: "{}" })
  );

  const profile = await openProfile(page, "Yuki Tanaka");

  await expect(
    profile.getByRole("heading", { name: "Comments could not be loaded" })
  ).toBeVisible();
  await expect(
    profile.getByRole("heading", { name: "0 comments" })
  ).toHaveCount(0);
  await expect(
    profile.getByRole("heading", { name: "Loading comments" })
  ).toHaveCount(0);
});

test("asks visitors without a name to select one before commenting", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");

  const profile = await openProfile(page, "Charlie Test");

  await expect(
    profile.getByText("Select your name to leave a comment.")
  ).toBeVisible();
  await expect(profile.getByPlaceholder("Add a comment")).toHaveCount(0);
});
