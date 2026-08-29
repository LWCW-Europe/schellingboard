import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";

import {
  ADMIN_COOKIE_NAME,
  AUTH_COOKIE_NAME,
  createAdminAuthCookie,
  createAuthCookie,
} from "@/utils/auth";
import { GET as avatarGET } from "@/app/media/avatars/[filename]/route";
import { GET as locationGET } from "@/app/media/locations/[filename]/route";
import { GET as siteGET } from "@/app/media/site/[filename]/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

let uploadsDir: string;

/** Writes a square test image and returns its filename. */
async function writeImage(
  dir: string,
  name: string,
  size: number
): Promise<string> {
  const target = path.join(uploadsDir, dir);
  await fs.mkdir(target, { recursive: true });
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: { r: 10, g: 120, b: 200 },
    },
  })
    .webp()
    .toFile(path.join(target, name));
  return name;
}

function req(url: string, authed = true): NextRequest {
  const request = new NextRequest(`http://test${url}`);
  if (authed) request.cookies.set(AUTH_COOKIE_NAME, siteCookieValue);
  return request;
}

let siteCookieValue: string;

const params = (filename: string) => ({
  params: Promise.resolve({ filename }),
});

describe("media routes", () => {
  beforeEach(async () => {
    uploadsDir = await fs.mkdtemp(path.join(os.tmpdir(), "media-test-"));
    vi.stubEnv("SB_UPLOADS_DIR", uploadsDir);
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    vi.stubEnv("SITE_PASSWORD", "site-pw");
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    siteCookieValue = (await createAuthCookie()).value;
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    await fs.rm(uploadsDir, { recursive: true, force: true });
  });

  // The map is stored under its own fixed name, not a generated id.
  describe.each([
    ["avatars", avatarGET, "probe.webp"],
    ["locations", locationGET, "probe.webp"],
    ["site", siteGET, "map.webp"],
  ] as const)("/media/%s", (dir, GET, file) => {
    it("refuses a request with no site-auth cookie", async () => {
      const name = await writeImage(dir, file, 300);
      const res = await GET(req(`/media/${dir}/${name}`, false), params(name));
      expect(res.status).toBe(401);
      expect(res.headers.get("content-type")).not.toMatch(/^image\//);
    });

    it("refuses a forged site-auth cookie", async () => {
      const name = await writeImage(dir, file, 300);
      const request = new NextRequest(`http://test/media/${dir}/${name}`);
      request.cookies.set(AUTH_COOKIE_NAME, "not.a.real.signature");
      const res = await GET(request, params(name));
      expect(res.status).toBe(401);
    });

    it("serves the image to a site-authenticated caller", async () => {
      const name = await writeImage(dir, file, 300);
      const res = await GET(req(`/media/${dir}/${name}`), params(name));
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toBe("image/webp");
      expect((await res.arrayBuffer()).byteLength).toBeGreaterThan(0);
    });

    // The admin UI is reachable with the admin cookie alone (see
    // tests/e2e/admin.spec.ts), and it previews the very images it uploads.
    it("serves the image to an admin with no site-auth cookie", async () => {
      const name = await writeImage(dir, file, 300);
      const request = new NextRequest(`http://test/media/${dir}/${name}`);
      request.cookies.set(
        ADMIN_COOKIE_NAME,
        (await createAdminAuthCookie()).value
      );
      const res = await GET(request, params(name));
      expect(res.status).toBe(200);
    });

    it("404s a missing file rather than leaking the difference", async () => {
      const res = await GET(
        req(`/media/${dir}/nothing.webp`),
        params("nothing.webp")
      );
      expect(res.status).toBe(404);
    });

    it("rejects a traversing filename", async () => {
      const res = await GET(
        req(`/media/${dir}/..%2F..%2Fetc%2Fpasswd`),
        params("../../etc/passwd")
      );
      expect(res.status).toBe(404);
    });
  });

  // The built-in optimizer can't fetch these (its upstream request carries no
  // cookies, so the proxy bounces it), so the handlers resize themselves and
  // the loader asks for a width. See utils/image-loader.js.
  describe("resizing", () => {
    it("serves a smaller rendition for a requested width", async () => {
      const name = await writeImage("avatars", "big.webp", 1024);
      const res = await avatarGET(
        req(`/media/avatars/${name}?w=128`),
        params(name)
      );
      expect(res.status).toBe(200);
      const meta = await sharp(Buffer.from(await res.arrayBuffer())).metadata();
      expect(meta.width).toBe(128);
    });

    it("never upscales past the stored size", async () => {
      const name = await writeImage("avatars", "small.webp", 200);
      const res = await avatarGET(
        req(`/media/avatars/${name}?w=640`),
        params(name)
      );
      const meta = await sharp(Buffer.from(await res.arrayBuffer())).metadata();
      expect(meta.width).toBe(200);
    });

    it("serves the original when no width is asked for", async () => {
      const name = await writeImage("avatars", "big.webp", 1024);
      const res = await avatarGET(req(`/media/avatars/${name}`), params(name));
      const meta = await sharp(Buffer.from(await res.arrayBuffer())).metadata();
      expect(meta.width).toBe(1024);
    });

    // An open width parameter is a CPU-burn oracle: one URL per width, each
    // missing the rendition cache and costing a full decode plus resize.
    it("rejects a width outside the allowed set", async () => {
      const name = await writeImage("avatars", "big.webp", 1024);
      for (const w of ["127", "999", "-1", "0", "abc", "1e9"]) {
        const res = await avatarGET(
          req(`/media/avatars/${name}?w=${w}`),
          params(name)
        );
        expect(res.status, `w=${w} must be refused`).toBe(400);
      }
    });

    it("caches a rendition so the second request doesn't resize again", async () => {
      const name = await writeImage("avatars", "big.webp", 1024);
      const url = `/media/avatars/${name}?w=256`;
      await avatarGET(req(url), params(name));

      const cached = await fs.readdir(path.join(uploadsDir, "avatars"));
      expect(cached).toContain("big.256.webp");

      // Replacing the cached file with a differently shaped image is the only
      // way to tell a cache hit from a second resize: both answer 256 wide.
      await sharp({
        create: {
          width: 256,
          height: 64,
          channels: 3,
          background: { r: 1, g: 2, b: 3 },
        },
      })
        .webp()
        .toFile(path.join(uploadsDir, "avatars", "big.256.webp"));

      const res = await avatarGET(req(url), params(name));
      const meta = await sharp(Buffer.from(await res.arrayBuffer())).metadata();
      expect(meta.height).toBe(64);
    });
  });
});
