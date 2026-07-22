import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { PROMPT_POOL } from "@/model/prompt-pool";
import sharp from "sharp";

async function selectCurrentUser(page: import("@playwright/test").Page) {
  // The current identity lives in the header: a chip (accessible name starts
  // with "Your name") opens a modal with the "My name is:" combobox.
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("combobox", { name: /My name is/i }).click();
  await page.getByRole("combobox", { name: /My name is/i }).fill("Alice Test");
  await page.getByRole("option", { name: /Alice Test/i }).click();
}

async function makeImage(width: number, height: number): Promise<Buffer> {
  return sharp({
    create: { width, height, channels: 3, background: { r: 90, g: 60, b: 30 } },
  })
    .png()
    .toBuffer();
}

test.describe("Edit profile", () => {
  test.describe.configure({ mode: "serial" });

  test("lists guests and edits the current user's profile", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/Conference-Alpha/proposals");

    // Identify as Alice, then reach the attendees page via the header link.
    await selectCurrentUser(page);
    await page.getByRole("link", { name: "Attendees", exact: true }).click();
    await expect(page).toHaveURL(/\/guests$/);

    // All guests are listed.
    await expect(page.getByRole("link", { name: "Alice Test" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Bob Test" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Charlie Test" })
    ).toBeVisible();

    // Edit profile always targets the current user (Alice).
    await page.getByRole("link", { name: /Edit profile/i }).click();
    await expect(page).toHaveURL(/\/guests\/edit$/);
    await expect(
      page.getByRole("heading", { name: /Edit profile/i })
    ).toBeVisible();

    const aboutMe = `Conference enthusiast ${Date.now()}`;
    await page.getByLabel("About me").fill(aboutMe);
    const pronounsEntry = page.getByLabel("Pronouns");
    await pronounsEntry.fill("She/Her");
    // Close the suggestion dropdown; it otherwise blocks the Save button.
    await page.keyboard.press("Escape");
    // hidden inputs aren't interactable through `getByLabel` in playwright
    await page.locator('input[type="file"]').setInputFiles({
      name: "square.png",
      mimeType: "image/png",
      buffer: await makeImage(800, 800),
    });
    await page.getByRole("button", { name: /^Save$/ }).click();

    // Lands on Alice's profile with the new About me text.
    await expect(page).toHaveURL(/\/guests\/[^/]+$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Alice Test" })
    ).toBeVisible();
    await expect(page.getByText(aboutMe)).toBeVisible();
    await expect(
      page.getByAltText("Profile avatar of Alice Test")
    ).toBeVisible();
  });

  test("pronoun combobox doesn't revert to one of the default options on enter", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/Conference-Alpha/proposals");

    // Identify as Alice, then reach the attendees page via the header link.
    await selectCurrentUser(page);
    await page.getByRole("link", { name: "Attendees", exact: true }).click();

    // Edit profile always targets the current user (Alice).
    await page.getByRole("link", { name: /Edit profile/i }).click();

    // There was a bug with the combobox impl that
    // caused the last hovered option to be selected on enter.
    // This tests that it's worked around.
    // pressSequentially (not fill) so real per-key keydown events fire,
    // which is what the typing/navigation mode tracking relies on.
    const pronounsEntry = page.getByLabel("Pronouns");
    await pronounsEntry.click();
    await page.getByRole("option", { name: "He/Him" }).hover();
    await pronounsEntry.click();
    // Clear first: the previous test left "She/Her" in the profile,
    // and pressSequentially appends to existing content.
    await pronounsEntry.fill("");
    await pronounsEntry.pressSequentially("She/Her");
    await pronounsEntry.press("Enter");

    await expect(pronounsEntry).toHaveValue("She/Her");
  });

  test("avatar doesn't change on profile about me edit", async ({ page }) => {
    await login(page);
    await page.goto("/Conference-Alpha/proposals");

    // Identify as Alice, then reach the attendees page via the header link.
    await selectCurrentUser(page);
    await page.getByRole("link", { name: "Attendees", exact: true }).click();

    // Edit profile always targets the current user (Alice).
    await page.getByRole("link", { name: /Edit profile/i }).click();

    // Reset the avatar
    const aboutMe = `Conference enthusiast ${Date.now()}`;
    await page.getByLabel("About me").fill(aboutMe);
    await page.getByRole("button", { name: /^Save$/ }).click();

    await expect(
      page.getByAltText("Profile avatar of Alice Test")
    ).toBeVisible();
  });

  test("renders markdown in About me, safely", async ({ page }) => {
    await login(page);
    await page.goto("/Conference-Alpha/proposals");

    await selectCurrentUser(page);
    await page.getByRole("link", { name: "Attendees", exact: true }).click();
    await page.getByRole("link", { name: /Edit profile/i }).click();

    await page
      .getByLabel("About me")
      .fill(
        "# Big header\n\n**Bold statement** and [my site](https://example.com)\n\n<script>alert(1)</script>"
      );
    await page.getByRole("button", { name: /^Save$/ }).click();
    await expect(page).toHaveURL(/\/guests\/[^/]+$/);

    // Markdown renders: bold text and a real link.
    await expect(
      page.locator("strong", { hasText: "Bold statement" })
    ).toBeVisible();
    const link = page.getByRole("link", { name: "my site" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://example.com");

    // Headings are capped: text shows but not as a heading element.
    await expect(page.getByText("Big header")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Big header" })).toHaveCount(
      0
    );

    // Raw HTML is escaped and displayed as literal text, not executed.
    await expect(page.getByText("<script>alert(1)</script>")).toBeVisible();

    // The attendees list no longer previews the bio: rows keep a fixed shape.
    await page.getByRole("link", { name: "Attendees", exact: true }).click();
    await expect(page).toHaveURL(/\/guests$/);
    await expect(page.getByRole("link", { name: /Alice Test/ })).toBeVisible();
    await expect(page.getByText("Big header Bold statement")).toHaveCount(0);
  });

  test("edits the extended profile fields and finds them in the directory", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/Conference-Alpha/proposals");

    await selectCurrentUser(page);
    await page.getByRole("link", { name: "Attendees", exact: true }).click();
    await page.getByRole("link", { name: /Edit profile/i }).click();

    await page.getByLabel("Based in").fill("Berlin");

    // The optional sections sit behind expandable disclosures. A retry of
    // this test runs against the profile saved by the previous attempt:
    // filled sections then start open and contain the saved rows, so only
    // click closed summaries and clear leftover rows before adding new ones.
    const ensureSectionOpen = async (
      title: string,
      probe: import("@playwright/test").Locator
    ) => {
      if (!(await probe.isVisible())) {
        await page.getByText(title, { exact: true }).click();
      }
      await expect(probe).toBeVisible();
    };
    await ensureSectionOpen(
      "Conversation starters",
      page.getByLabel("Ask me about")
    );
    await ensureSectionOpen(
      "Languages",
      page.getByRole("button", { name: "Add language" })
    );
    await ensureSectionOpen(
      "Contact details",
      page.getByRole("button", { name: "Add contact" })
    );
    const leftoverRows = page.getByRole("button", { name: "Remove" });
    while ((await leftoverRows.count()) > 0) {
      await leftoverRows.first().click();
    }

    await page.getByLabel("Ask me about").fill("Urban beekeeping");

    // Suggested prompts can be swapped in place for a different one. The
    // suggestion is random, so find which pool prompt is on screen.
    const visiblePoolPrompts = async () => {
      const shown: string[] = [];
      for (const prompt of PROMPT_POOL) {
        if (await page.getByText(prompt, { exact: true }).isVisible()) {
          shown.push(prompt);
        }
      }
      return shown;
    };
    await page.getByRole("button", { name: "Suggest a prompt" }).click();
    const [suggestedPrompt, ...extraBefore] = await visiblePoolPrompts();
    expect(suggestedPrompt).toBeDefined();
    expect(extraBefore).toEqual([]);
    await page
      .getByRole("button", { name: "Suggest a different prompt" })
      .click();
    await expect.poll(visiblePoolPrompts).not.toEqual([suggestedPrompt]);
    // Left unanswered, so it must not appear on the saved profile.
    const [swappedPrompt, ...extraAfter] = await visiblePoolPrompts();
    expect(swappedPrompt).toBeDefined();
    expect(extraAfter).toEqual([]);

    await page.getByRole("button", { name: "Add language" }).click();
    await page.getByRole("combobox", { name: "Language" }).fill("Italian");
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Add contact" }).click();
    await page.getByLabel("Contact type").selectOption("Signal");
    await page.getByLabel("Contact value").fill("@alice.01");

    await page.getByRole("button", { name: /^Save$/ }).click();

    // Profile page shows every filled-in section.
    await expect(page).toHaveURL(/\/guests\/[^/]+$/);
    await expect(page.getByText("Berlin")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Ask me about" })
    ).toBeVisible();
    await expect(page.getByText("Urban beekeeping")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: swappedPrompt })
    ).toHaveCount(0);
    await expect(page.getByText("Italian")).toBeVisible();
    await expect(page.getByText("Signal:")).toBeVisible();
    await expect(page.getByText("@alice.01")).toBeVisible();

    // The directory row shows Based in, and search finds the language.
    await page.getByRole("link", { name: "Back to attendees" }).click();
    const aliceRow = page.getByRole("link", { name: /Alice Test/ });
    await expect(aliceRow).toContainText("Berlin");

    // Contacts belong to the profile page only: the directory response must
    // not embed them (rows are serialized into the page payload).
    await page.reload();
    await expect(aliceRow).toBeVisible();
    expect(await page.content()).not.toContain("@alice.01");

    await page.getByLabel("Search").fill("Italian");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.getByRole("link", { name: /Alice Test/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Bob Test/ })).toHaveCount(0);
  });

  test("shows no image when the user avatar is reset", async ({ page }) => {
    await login(page);
    await page.goto("/Conference-Alpha/proposals");

    // Identify as Alice, then reach the attendees page via the header link.
    await selectCurrentUser(page);
    await page.getByRole("link", { name: "Attendees", exact: true }).click();

    // Edit profile always targets the current user (Alice).
    await page.getByRole("link", { name: /Edit profile/i }).click();

    // Reset the avatar
    await page.getByRole("button", { name: /^Reset$/ }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await expect(
      page.getByAltText("Profile avatar of Alice Test")
    ).toBeHidden();
    await expect(page.getByText(/^AT$/)).toBeVisible();
  });
});

test("shows an error on the edit page when no user is selected", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests/edit");

  await expect(page.getByText(/select who you are/i)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Edit profile/i })
  ).toHaveCount(0);
});

test("Back to attendees preserves pagination", async ({ page }) => {
  await login(page);
  await page.goto("/guests");

  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByText("Page 2 of 2")).toBeVisible();

  // Seed data is 40 guests sorted alphabetically; "Mateo Quispe" is 26th,
  // i.e. the first row of page 2.
  await page.getByRole("link", { name: "Mateo Quispe" }).click();
  await expect(page).toHaveURL(/\/guests\/[^/]+/);

  await page.getByRole("link", { name: "Back to attendees" }).click();
  await expect(page.getByText("Page 2 of 2")).toBeVisible();
  await expect(page.getByRole("link", { name: "Mateo Quispe" })).toBeVisible();
});

test("Back to attendees preserves the search query", async ({ page }) => {
  await login(page);
  await page.goto("/guests");

  await page.getByLabel("Search").fill("Test");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("link", { name: "Alice Test" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Bob Test" })).toBeVisible();

  await page.getByRole("link", { name: "Alice Test" }).click();
  await expect(page).toHaveURL(/\/guests\/[^/]+/);

  await page.getByRole("link", { name: "Back to attendees" }).click();
  await expect(page.getByLabel("Search")).toHaveValue("Test");
  await expect(page.getByRole("link", { name: "Bob Test" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Charlie Test" })).toBeVisible();
});
