import { execFileSync } from "child_process";

/**
 * @param {string} file
 * @param {readonly string[]} args
 */
function runQuiet(file, args) {
  try {
    return execFileSync(file, args, {
      encoding: "utf-8",
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function getAppVersion() {
  // Prefer jj: some workspaces (e.g. `jj workspace add`) have no `.git` dir,
  // where git commands always fail. Fall back to git for devs without jj.
  const jjVersion = runQuiet("jj", [
    "log",
    "-r",
    "@",
    "--no-graph",
    "-T",
    'commit_id.short(8) ++ if(!empty, "-dirty")',
  ]);
  if (jjVersion) return jjVersion;

  const gitVersion = runQuiet("git", [
    "describe",
    "--tags",
    "--always",
    "--dirty",
  ]);
  return gitVersion ?? "unknown";
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
