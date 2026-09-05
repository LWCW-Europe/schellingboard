import { expect, test } from "./helpers/fixtures";

// Installing happens on the login page, before anyone has a cookie: Safari
// fetches the manifest and its icons unauthenticated, so a gate in front of
// them makes "Add to Home Screen" produce a broken icon or nothing at all.
// Requesting the URLs directly is what a browser does here — no human clicks
// a manifest.
test("the app is installable before logging in", async ({ page, request }) => {
  await page.goto("/");

  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(href, "the page must link a manifest").toBeTruthy();

  const response = await request.get(href!);
  expect(response.status()).toBe(200);

  const manifest = (await response.json()) as {
    name: string;
    display: string;
    start_url: string;
    icons: { src: string; sizes: string }[];
  };
  expect(manifest.display).toBe("standalone");
  expect(manifest.start_url).toBe("/");
  expect(manifest.name).not.toBe("");

  for (const icon of manifest.icons) {
    const iconResponse = await request.get(icon.src);
    expect(iconResponse.status(), `${icon.src} must be served`).toBe(200);
  }
});
