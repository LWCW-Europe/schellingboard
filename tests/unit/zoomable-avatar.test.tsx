import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// The enlarged view itself is E2E-tested; stubbing it keeps this test off the
// modals module and the whole client-context tree it imports.
vi.mock("@/app/(site)/modals", () => ({ Modal: () => null }));

import { ZoomableAvatar } from "@/app/(site)/guests/zoomable-avatar";

describe("ZoomableAvatar", () => {
  it("makes an uploaded photo clickable", () => {
    const html = renderToStaticMarkup(
      <ZoomableAvatar name="Amara Okafor" image="/media/avatars/amara.webp" />
    );
    expect(html).toContain("Enlarge photo of Amara Okafor");
  });

  it("leaves an initials placeholder non-interactive", () => {
    const html = renderToStaticMarkup(<ZoomableAvatar name="Amara Okafor" />);
    expect(html).not.toContain("<button");
    expect(html).toContain("AO");
  });
});
