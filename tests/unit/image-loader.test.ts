import { describe, it, expect } from "vitest";
import loader from "@/utils/image-loader";

// Next's built-in optimizer cannot fetch /media: it builds its upstream
// request with no headers at all, so the proxy sees no site-auth cookie and
// bounces it. This loader therefore points media at the media routes
// themselves, which resize and check auth, and leaves everything else on the
// default path.

describe("image loader", () => {
  it("asks the media route for the width, keeping the cache-buster", () => {
    expect(loader({ src: "/media/avatars/a1.webp?v=123", width: 128 })).toBe(
      "/media/avatars/a1.webp?v=123&w=128&q=75"
    );
  });

  it("starts the query when the source carries none", () => {
    expect(loader({ src: "/media/site/map.webp", width: 640 })).toBe(
      "/media/site/map.webp?w=640&q=75"
    );
  });

  it("passes an explicit quality through", () => {
    expect(
      loader({ src: "/media/locations/l1.jpg", width: 256, quality: 90 })
    ).toBe("/media/locations/l1.jpg?w=256&q=90");
  });

  // Configuring any custom loader makes Next answer /_next/image with a 404
  // (next-server.js: `imagesConfig.loader !== 'default'` → render404), so a
  // URL pointing there would be a broken image, not an optimized one.
  it("never routes anything to the built-in optimizer", () => {
    for (const src of [
      "/locations/loc-room-a.jpg",
      "/mediafoo/x.webp",
      "https://res.cloudinary.com/x/y.jpg",
    ]) {
      expect(loader({ src, width: 384 })).toBe(src);
    }
  });
});
