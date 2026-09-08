import { Locator, Page, expect } from "@playwright/test";

// Settings holds one collapsed panel per event that offers 1-on-1s, except
// that a lone one starts open -- so look before clicking its summary.
export async function openAvailability(
  page: Page,
  eventName: string
): Promise<Locator> {
  const form = page.getByRole("form", { name: `1-on-1s at ${eventName}` });
  const panels = page.getByRole("region", { name: "1-on-1s" });
  await expect(panels).toBeVisible();
  if (!(await form.isVisible())) {
    await panels.getByText(eventName, { exact: true }).click();
  }
  await expect(form).toBeVisible();
  return form;
}
