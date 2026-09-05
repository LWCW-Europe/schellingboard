import { describe, it, expect } from "vitest";
import { config } from "@/proxy";

// tests/integration/proxy.test.ts calls proxy() directly, so it never
// exercises config.matcher — and a path the matcher excludes never reaches
// proxy() at all. That blind spot is what let every uploaded image be served
// unauthenticated: the matcher excluded any path ending in an image extension,
// and media filenames are <id>.<jpg|png|webp>.

const matches = (pathname: string): boolean =>
  new RegExp(`^${config.matcher[0]}$`).test(pathname);

describe("proxy matcher", () => {
  it("covers uploaded media, whatever the extension", () => {
    for (const path of [
      "/media/avatars/abc123.webp",
      "/media/avatars/abc123.png",
      "/media/avatars/abc123.jpg",
      "/media/locations/xyz789.webp",
      "/media/site/map.webp",
      "/media/site/map.png",
      "/media/site/map.jpg",
    ]) {
      expect(matches(path), `${path} must reach the proxy`).toBe(true);
    }
  });

  it("covers pages and API routes", () => {
    for (const path of ["/", "/guests", "/api/votes", "/Conference-Alpha"]) {
      expect(matches(path), `${path} must reach the proxy`).toBe(true);
    }
  });

  // Excluding these is what keeps the login page renderable to someone who
  // has not logged in yet: the root layout loads all three icons.
  //
  // public/locations holds the seeded room photos the sample data points at.
  // They are build output like any other, and gating them broke the admin UI,
  // which renders them with the admin cookie alone and no site cookie.
  it("skips build output and the icons the login page itself loads", () => {
    for (const path of [
      "/_next/static/chunks/main.js",
      "/_next/image",
      "/favicon.ico",
      "/icon.svg",
      "/apple-touch-icon.png",
      "/locations/loc-room-a.jpg",
    ]) {
      expect(matches(path), `${path} must skip the proxy`).toBe(false);
    }
  });

  // An install has to work before anyone can log in: Safari fetches the
  // manifest and its icons without our cookie.
  it("skips the manifest and its icons", () => {
    for (const path of [
      "/manifest.webmanifest",
      "/icon-192.png",
      "/icon-512.png",
      "/icon-maskable-512.png",
    ]) {
      expect(matches(path), `${path} must skip the proxy`).toBe(false);
    }
  });

  // A browser will only deliver a push to a service worker, and it fetches
  // the worker's script without our cookie: a login page in its place takes
  // notifications with it.
  it("skips the service worker", () => {
    expect(matches("/sw.js"), "/sw.js must skip the proxy").toBe(false);
  });

  // The exemptions are file names, and an unescaped dot would let a route
  // that merely shares their letters slip past — the same over-matching that
  // once leaked every uploaded image.
  it("exempts the public files by their exact names", () => {
    for (const path of ["/favicon-ico", "/iconXsvg", "/icon-192_png"]) {
      expect(matches(path), `${path} must reach the proxy`).toBe(true);
    }
  });

  it("no longer exempts a path merely for ending in an image extension", () => {
    for (const path of ["/secret.png", "/guests/leak.webp", "/x.jpg"]) {
      expect(matches(path), `${path} must reach the proxy`).toBe(true);
    }
  });
});
