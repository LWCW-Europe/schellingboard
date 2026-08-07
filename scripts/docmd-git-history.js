// A docmd plugin that dates every page from git: "Last updated" under the
// page, with its recent commits in the tooltip.
//
// docmd ships that feature (@docmd/plugin-git), but it asks the build engine
// for the log and the engine runs `git log -- <absolute path>` in the process
// working directory. Every published version is built from a worktree in a
// temporary directory (see build-docs.sh), so git rejects the path as outside
// the repository, the plugin treats the failure as "no history", and the whole
// site ships undated. Resolving the repository per page instead is the only
// part that has to change, so this hook overwrites `_git` after theirs runs.
import { execFileSync } from "child_process";
import path from "path";

export const plugin = {
  name: "git-history",
  version: "1.0.0",
  capabilities: ["build"],
};

// What the theme's tooltip has room for.
const MAX_COMMITS = 5;

/**
 * @param {readonly string[]} args
 * @param {string} cwd
 */
function git(args, cwd) {
  try {
    return execFileSync("git", args, {
      encoding: "utf-8",
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

/** @type {Map<string, string | null>} */
const gitRoots = new Map();

/** @param {string} dir */
function gitRootOf(dir) {
  if (!gitRoots.has(dir)) {
    gitRoots.set(dir, git(["rev-parse", "--show-toplevel"], dir));
  }
  return gitRoots.get(dir) ?? null;
}

/** @param {string} sourcePath */
function commitsFor(sourcePath) {
  const root = gitRootOf(path.dirname(sourcePath));
  if (!root) return [];

  const log = git(
    [
      "log",
      "--follow",
      "-n",
      String(MAX_COMMITS),
      "--format=%H|%h|%an|%at|%s",
      "--",
      path.relative(root, sourcePath),
    ],
    root
  );
  if (!log) return [];

  return log
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, shortHash, author, seconds, ...subject] = line.split("|");
      const timestamp = Number(seconds) * 1000;
      return {
        hash,
        shortHash,
        author,
        timestamp,
        date: new Date(timestamp).toISOString(),
        // A `|` in the subject survives the split.
        message: subject.join("|"),
        // Left empty on purpose: the theme renders an <img> per commit when
        // this is set, which would have every reader's browser fetch each
        // contributor's picture from Gravatar. Without it the theme falls back
        // to the author's initials.
        avatarUrl: "",
      };
    });
}

/**
 * @param {{ pages?: { sourcePath?: string, frontmatter?: Record<string, unknown> }[] }} context
 */
export function onBeforeBuild(context) {
  for (const page of context.pages ?? []) {
    if (!page.sourcePath || !page.frontmatter) continue;

    const commits = commitsFor(page.sourcePath);
    if (commits.length === 0) continue;

    page.frontmatter._git = {
      lastUpdated: commits[0].date,
      lastUpdatedTimestamp: commits[0].timestamp,
      commits,
    };
  }
}
