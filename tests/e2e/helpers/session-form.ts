import { Page } from "@playwright/test";

// The session form's labels are not wired to their inputs, so locate each
// listbox through its labelled section (same approach as the hosts combobox in
// add-session.spec.ts).
export function listboxButton(page: Page, section: RegExp) {
  return page
    .locator("div")
    .filter({ hasText: section })
    .first()
    .getByRole("button")
    .first();
}

export const dayRadios = (page: Page) =>
  page.getByRole("radio", {
    name: /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/,
  });
