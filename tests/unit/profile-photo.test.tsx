import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { ProfilePhoto } from "@/app/(site)/guests/profile-photo";

describe("ProfilePhoto", () => {
  it("makes an uploaded photo clickable", () => {
    const html = renderToStaticMarkup(
      <ProfilePhoto
        name="Amara Okafor"
        image="/media/avatars/amara.webp"
        onToggleZoom={() => {}}
      />
    );
    expect(html).toContain("Enlarge photo of Amara Okafor");
  });

  it("offers the way back once enlarged", () => {
    const html = renderToStaticMarkup(
      <ProfilePhoto
        name="Amara Okafor"
        image="/media/avatars/amara.webp"
        zoomed
        onToggleZoom={() => {}}
      />
    );
    expect(html).toContain("Shrink photo of Amara Okafor");
  });

  it("leaves an initials placeholder non-interactive", () => {
    const html = renderToStaticMarkup(
      <ProfilePhoto name="Amara Okafor" onToggleZoom={() => {}} />
    );
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
