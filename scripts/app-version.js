// The version of the working tree, e.g. `v3.2.0` or `802a340f-dirty`.
//
// Two consumers, one definition, because they have to agree: next.config.js
// bakes it into the build as NEXT_PUBLIC_APP_VERSION (the footer shows it, see
// utils/git.ts), and scripts/docker-build.sh passes it as the APP_VERSION build
// arg and uses it as the image tag — so the release build reuses the layers the
// E2E run built instead of compiling its own.
//
// Run directly (`bun scripts/app-version.js`) to print it.
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

export function getAppVersion() {
  // Prefer jj: some workspaces (e.g. `jj workspace add`) have no `.git` dir,
  // where git commands always fail. Fall back to git for devs without jj.
  //
  // Describe the parent, not `@`: `@` is usually an empty working-copy commit,
  // so its own hash names nothing recognisable. A tag on the parent wins over
  // its hash, so `jj new v3.1.0` reports "v3.1.0" — matching what `git
  // describe --tags` gives below. `-dirty` marks actual local changes.
  const jjVersion = runQuiet("jj", [
    "log",
    "-r",
    "@",
    "--no-graph",
    "-T",
    'parents.map(|p| if(p.tags(), p.tags().map(|t| t.name()).join("+"), ' +
      'p.commit_id().short(8))).join("+") ++ if(!empty, "-dirty")',
  ]);
  if (jjVersion) return jjVersion;

  const gitVersion = runQuiet("git", [
    "describe",
    "--tags",
    "--always",
    "--dirty",
  ]);
  // Never empty: it is used as a Docker tag, which cannot be.
  return gitVersion ?? "unknown";
}

if (import.meta.main) {
  console.log(getAppVersion());
}
