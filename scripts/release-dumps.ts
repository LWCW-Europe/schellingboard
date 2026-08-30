// The record of which stored database dump covers upgrading from each released
// version — read by the release-upgrade tests, written by
// scripts/dump-release-db.ts. See docs/dev/testing.md.
//
// A release that ships no migration reaches the same database as the release
// before it and gets no dump of its own; it points at that release's dump
// instead, so "deliberately no dump" is on the record rather than looking like
// a forgotten one.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export const DUMP_DIR = path.join(repoRoot, "tests", "fixtures", "upgrade");
const MANIFEST_FILE = path.join(DUMP_DIR, "releases.json");

export type ReleaseManifest = {
  /** Upgrading from anything older is no longer covered. */
  oldestSupported: string;
  /** Released version → the version whose dump covers upgrading from it. */
  coveredBy: Record<string, string>;
};

export function compareVersions(a: string, b: string): number {
  const parts = (v: string) => v.replace(/^v/, "").split(".").map(Number);
  const [av, bv] = [parts(a), parts(b)];
  for (let i = 0; i < Math.max(av.length, bv.length); i++) {
    const diff = (av[i] ?? 0) - (bv[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function dumpPath(version: string): string {
  return path.join(DUMP_DIR, `${version}.sql`);
}

/** The versions with a dump of their own, oldest first. */
export function listDumpVersions(): string[] {
  if (!fs.existsSync(DUMP_DIR)) return [];
  return fs
    .readdirSync(DUMP_DIR)
    .filter((name) => name.endsWith(".sql"))
    .map((name) => name.replace(/\.sql$/, ""))
    .sort(compareVersions);
}

export function readManifest(): ReleaseManifest {
  return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8")) as ReleaseManifest;
}

export function recordRelease(version: string, coveredBy: string): void {
  const manifest = fs.existsSync(MANIFEST_FILE)
    ? readManifest()
    : { oldestSupported: version, coveredBy: {} };
  manifest.coveredBy = Object.fromEntries(
    Object.entries({ ...manifest.coveredBy, [version]: coveredBy }).sort(
      ([a], [b]) => compareVersions(a, b)
    )
  );
  fs.writeFileSync(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
}

/** The released versions named in the changelog, newest first. */
export function changelogReleases(): string[] {
  const changelog = fs.readFileSync(
    path.join(repoRoot, "CHANGELOG.md"),
    "utf8"
  );
  return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\]/gm)].map(
    (match) => `v${match[1]}`
  );
}
