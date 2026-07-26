#!/usr/bin/env bash
# Build the public documentation site into site/.
#
# The published site is made of released versions only, and none of them live
# in the working tree — each is reconstructed from git. Every release tag that
# carries docs/public/ is checked out into a temporary worktree and built as a
# version: the newest at the site root, older ones under /<id>/.
#
# What follows from that:
#
#   - Publishing documentation for a release is tagging the repository. There
#     is no snapshot step and no copy to keep in sync.
#   - docs/public/ is the working copy of the next release's documentation. It
#     is never published; preview it with `make docs`.
#   - To correct published docs without cutting a release, commit to a
#     docs-<id> branch (e.g. docs-3.2). It takes precedence over the tag for
#     that version. Merge it back into main so the fix is not lost.
#
# A worktree is used rather than `git archive` on purpose: it is a real
# checkout, so the git plugin's per-page commit history keeps working.
set -euo pipefail

cd "$(dirname "$0")/.."
REPO_ROOT="$PWD"

# Reading tags and adding worktrees needs git. Workspaces created with
# `jj workspace add` have no .git at all (see the same caveat in
# next.config.js), where every git command below would fail one by one.
if [ ! -e ".git" ]; then
  echo "$REPO_ROOT has no .git — building the site needs a git checkout, because" >&2
  echo "every published version is read from a release tag. Run this from the" >&2
  echo "git-colocated clone; 'make docs' previews docs/public anywhere." >&2
  exit 1
fi

WORK="$(mktemp -d)"

# docmd resolves every relative path in a config against the config's own
# directory, not the working directory, so the derived config has to sit next
# to docmd.config.json for "site" to mean what it says.
BUILD_CONFIG="$REPO_ROOT/.docmd.build.json"

cleanup() {
  cd "$REPO_ROOT"
  for worktree in "$WORK"/version-*; do
    [ -d "$worktree" ] || continue
    git worktree remove --force "$worktree" >/dev/null 2>&1 || true
  done
  rm -rf "$WORK" "$BUILD_CONFIG"
  # A removal that failed above leaves the worktree registered against a path
  # that no longer exists, which then blocks the next build.
  git worktree prune
}
trap cleanup EXIT

# --- Discover released versions -------------------------------------------
#
# Tags are walked newest first, so the first tag seen for a given major.minor
# is its highest patch — v3.2.1 supersedes v3.2.0, and both publish as "3.2".

version_ids=()
version_dirs=()
seen_ids=" "

while read -r tag; do
  [[ "$tag" =~ ^v([0-9]+)\.([0-9]+)\.[0-9]+$ ]] || continue
  id="${BASH_REMATCH[1]}.${BASH_REMATCH[2]}"
  [[ "$seen_ids" == *" $id "* ]] && continue

  # An optional docs-<id> branch overrides the tag, so published docs can be
  # corrected without a new release. Prefer a local branch, fall back to the
  # remote-tracking one (CI checkouts have no local branches).
  ref="$tag"
  for candidate in "docs-$id" "origin/docs-$id"; do
    if git rev-parse --verify --quiet "$candidate^{commit}" >/dev/null; then
      ref="$candidate"
      break
    fi
  done

  # Releases predating the documentation site have no docs to build.
  git cat-file -e "$ref:docs/public/index.md" 2>/dev/null || continue

  seen_ids+="$id "
  worktree="$WORK/version-$id"
  git worktree add --detach "$worktree" "$ref" >/dev/null
  version_ids+=("$id")
  version_dirs+=("$worktree/docs/public")
  echo "Version $id ← $ref"
done < <(git tag -l 'v*' --sort=-v:refname)

if [ ${#version_ids[@]} -eq 0 ]; then
  echo "No release tag carries docs/public/ — there is nothing to publish yet." >&2
  echo "Documentation is published by tagging a release; use 'make docs' to preview docs/public." >&2
  exit 1
fi

# --- Derive the build config ----------------------------------------------
#
# docmd.config.json stays free of `versions` so `make docs` and
# `make docs-validate` operate on docs/public alone. The version list is
# git-derived, so it is only ever assembled here.

IDS="${version_ids[*]}" DIRS="${version_dirs[*]}" OUT="$BUILD_CONFIG" bun -e '
const fs = require("fs");
const ids = (process.env.IDS || "").split(" ").filter(Boolean);
const dirs = (process.env.DIRS || "").split(" ").filter(Boolean);
const config = JSON.parse(fs.readFileSync("docmd.config.json", "utf8"));

config.versions = {
  position: "sidebar-top",
  current: ids[0],
  all: ids.map((id, i) => ({ id, dir: dirs[i], label: `v${id}.x` })),
};

fs.writeFileSync(process.env.OUT, JSON.stringify(config, null, 2));
'

# --- Build ----------------------------------------------------------------

rm -rf site
bun x docmd build -c "$BUILD_CONFIG"

# --- Screenshots ----------------------------------------------------------
#
# docmd discovers markdown and nothing else — a PNG in docs/public/ is simply
# not copied — so images have to be placed here. They live in docs/screenshots/
# rather than under docs/public/ because the marketing site in www/ uses the
# same files (see scripts/build-www.sh).
#
# Each version gets the screenshots from its own worktree, so an old release
# keeps the interface it shipped with. Pages should reference them relatively
# (`../screenshots/x.webp`), which resolves the same at the site root and under
# /<id>/; a root-relative /screenshots/ would send every old version to the
# newest images.

for i in "${!version_ids[@]}"; do
  src="${version_dirs[$i]%/public}/screenshots"
  # Releases predating the shared screenshots have none to copy.
  [ -d "$src" ] || continue

  if [ "$i" -eq 0 ]; then dest="site/screenshots"; else dest="site/${version_ids[$i]}/screenshots"; fi
  cp -R "$src" "$dest"
  rm -f "$dest/README.md" # the capture checklist is for contributors
done

# GitHub Pages serves the custom domain from this file. Taken from the config's
# `url` so the domain is stated exactly once.
bun -e '
const { host } = new URL(require("./docmd.config.json").url);
require("fs").writeFileSync("site/CNAME", host + "\n");
'

echo "Documentation site built in site/"
