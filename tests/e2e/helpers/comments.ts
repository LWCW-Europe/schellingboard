import type { Locator } from "@playwright/test";
import { expect } from "./fixtures";

// Helpers shared by the proposal, session and profile comment specs: the three
// sections are one component, so they need the same waits.

/**
 * Presses `button` until `settled()` holds. A click landing while a mutation
 * swaps the DOM is lost, so it has to be retried — but the button is a toggle,
 * so a retry that fires while the first click is still rendering would undo it.
 * Hence the wait after each press: only a press that has visibly gone nowhere
 * is repeated.
 */
export async function toggleUntil(
  button: Locator,
  settled: () => Promise<boolean>
) {
  await expect(async () => {
    if (!(await settled())) {
      await button.click();
      await expect.poll(settled, { timeout: 2000 }).toBe(true);
    }
    expect(await settled()).toBe(true);
  }).toPass();
}

export async function openReplyForm(section: Locator) {
  const form = section.getByPlaceholder("Write a reply");
  await toggleUntil(
    section.getByRole("button", { name: "Reply", exact: true }).first(),
    () => form.isVisible()
  );
}

// Scoped to the open form: once a reply exists, its own "Reply" action button
// also matches, and it sits after the form in the DOM.
export async function submitReply(section: Locator, text: string) {
  const form = section
    .locator("form", { has: section.page().getByPlaceholder("Write a reply") })
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
export function postedComment(section: Locator, text: string) {
  return section.locator("section p", { hasText: text });
}
