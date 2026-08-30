import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { releaseNotes, SHOWN_RELEASES } from "@/app/release-notes";

// What the notes actually say is the release notes' own business (see
// tests/unit/release-notes.test.ts); this is about the version in the footer
// being a way in to them at all.
test("the footer's version opens the recent release notes", async ({
  page,
}) => {
  await login(page);
  await page.goto("/");

  await page.getByRole("button", { name: /what's new/i }).click();

  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "What's new" })
  ).toBeVisible();

  // The last three entries: each release dated, so the reader can tell how old
  // this deployment is, and the release being prepared — when there is one —
  // named as unreleased instead.
  const shown = releaseNotes.slice(0, SHOWN_RELEASES);
  const headings = dialog.getByRole("heading", { level: 3 });
  await expect(headings).toHaveCount(SHOWN_RELEASES);
  for (const [index, heading] of (await headings.all()).entries()) {
    await expect(heading).toHaveText(
      shown[index].date ? /^\d+\.\d+\.\d+ — \d{1,2} \w+ \d{4}$/ : /^Unreleased$/
    );
  }
  await expect(dialog.getByRole("listitem").first()).not.toBeEmpty();

  // Highlights are markdown, so a bold lead phrase arrives as bold text rather
  // than as asterisks.
  const highlights = shown.flatMap((note) => note.highlights);
  await expect(dialog).not.toContainText("**");
  if (highlights.some((highlight) => highlight.includes("**"))) {
    await expect(dialog.locator("li strong").first()).toBeVisible();
  }

  await expect(
    dialog.getByRole("link", { name: /full changelog/i })
  ).toHaveAttribute(
    "href",
    "https://github.com/LWCW-Europe/schellingboard/blob/main/CHANGELOG.md"
  );

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
