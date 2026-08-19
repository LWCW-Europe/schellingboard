import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// The enlarged view itself is E2E-tested; stubbing it keeps this test off the
// modals module and the whole client-context tree it imports.
vi.mock("@/app/(site)/modals", () => ({ Modal: () => null }));

import { ProfilePhoto } from "@/app/(site)/guests/profile-photo";

describe("ProfilePhoto", () => {
  it("makes an uploaded photo clickable", () => {
    const html = renderToStaticMarkup(
      <ProfilePhoto name="Amara Okafor" image="/media/avatars/amara.webp" />
    );
    expect(html).toContain("Enlarge photo of Amara Okafor");
  });

  it("leaves an initials placeholder non-interactive", () => {
    const html = renderToStaticMarkup(<ProfilePhoto name="Amara Okafor" />);
    expect(html).not.toContain("<button");
    expect(html).toContain("AO");
  });

  // The name is right below the photo as a heading, so announcing the initials
  // (or the image's alt, on top of the button's own label) only repeats it.
  it("hides the picture itself from screen readers", () => {
    for (const html of [
      renderToStaticMarkup(<ProfilePhoto name="Amara Okafor" />),
      renderToStaticMarkup(
        <ProfilePhoto name="Amara Okafor" image="/media/avatars/amara.webp" />
      ),
    ]) {
      expect(html).toContain('aria-hidden="true"');
    }
  });
});
