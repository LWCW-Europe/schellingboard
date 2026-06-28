import { execSync } from "child_process";

function getAppVersion() {
  try {
    return execSync("git describe --tags --always --dirty", {
      encoding: "utf-8",
      cwd: process.cwd(),
    }).trim();
  } catch {
    return "unknown";
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output is only used by the Docker production image
  // (`node server.js`). `next start` can't serve it and warns, so we gate it
  // behind an env var the Dockerfile sets and leave it off for local/e2e builds.
  ...(process.env.BUILD_STANDALONE === "1" ? { output: "standalone" } : {}),
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    localPatterns: [
      // Location uploads carry a ?v=<timestamp> cache-buster; omitting `search`
      // allows any query string for these paths.
      { pathname: "/media/**" },
      // Other local/public assets (e.g. /map.png) without a query string.
      { pathname: "/**", search: "" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_VERSION:
      process.env.APP_VERSION ||
      (process.env.VERCEL_GIT_COMMIT_SHA
        ? process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7)
        : getAppVersion()),
  },
};

export default nextConfig;
