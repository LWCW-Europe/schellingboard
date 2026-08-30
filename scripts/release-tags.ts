// The Docker tags a release publishes, and in particular whether it takes over
// `:latest`.
//
// `:latest` has to keep meaning the newest published release, so a patch cut
// from an older line (v3.3.2 released after v3.4.0) publishes its own three
// tags and leaves `:latest` pointing at v3.4.0. That used to be a judgement
// call in the release checklist; deciding it from the repository's tags is why
// the release workflow checks out the full tag history.
//
// Run as a command with the image the build produced, to get every reference to
// push — the repository comes from that image, so the name lives only in
// scripts/docker-build.sh:
//
//     bun scripts/release-tags.ts schellingboard/schellingboard:v3.4.2

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compareVersions } from "./release-dumps";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const RELEASE_VERSION = /^v\d+\.\d+\.\d+$/;

export function releaseTags(
  version: string,
  released: readonly string[]
): string[] {
  if (!RELEASE_VERSION.test(version)) {
    throw new Error(`Not a release version: "${version}" (expected vX.Y.Z)`);
  }
  const [major, minor] = version.split(".");
  const tags = [version, `${major}.${minor}`, major];

  // Anything unparseable — a release candidate, a stray marker — is nobody's
  // published release and must not keep this one off `:latest`.
  const isNewest = released
    .filter((tag) => RELEASE_VERSION.test(tag))
    .every((tag) => compareVersions(tag, version) <= 0);
  if (isNewest) tags.push("latest");

  return tags;
}

export function releaseRefs(
  image: string,
  released: readonly string[]
): string[] {
  // A registry host may carry a port, so the tag is after the last colon —
  // and only if that colon is in the last path segment.
  const colon = image.lastIndexOf(":");
  if (colon === -1 || image.slice(colon).includes("/")) {
    throw new Error(`Image reference has no tag: "${image}"`);
  }
  const repository = image.slice(0, colon);
  return releaseTags(image.slice(colon + 1), released).map(
    (tag) => `${repository}:${tag}`
  );
}

function releasedVersions(): string[] {
  return execFileSync("git", ["tag", "--list"], {
    encoding: "utf8",
    cwd: repoRoot,
  })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const image = process.argv[2];
  if (!image) {
    console.error("Usage: bun scripts/release-tags.ts <image>");
    process.exit(1);
  }
  for (const ref of releaseRefs(image, releasedVersions())) console.log(ref);
}
