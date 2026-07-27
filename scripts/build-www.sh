#!/usr/bin/env bash
# Build the marketing site (schellingboard.org) into www-site/.
#
# The site is hand-written HTML in www/ plus the screenshots in
# docs/screenshots/. Those screenshots are shared with the documentation site,
# and that sharing is the reason this build exists at all: the site used to
# live in its own repository with its own copy of every screenshot, which had
# to be recaptured twice.
#
# The output is what .github/workflows/www.yml pushes to
# LWCW-Europe/schellingboard.org, whose default branch GitHub Pages serves.
# Nothing here needs bun or node — it is a copy plus a link check.
set -euo pipefail

cd "$(dirname "$0")/.."

OUT="www-site"

rm -rf "$OUT"
mkdir -p "$OUT"

# `www/.` rather than `www/*` so .nojekyll comes along.
cp -R www/. "$OUT/"
cp -R docs/screenshots "$OUT/screenshots"

# The capture checklist is for contributors, not for visitors.
rm -f "$OUT/screenshots/README.md"

# Nobody edits the deployment repository directly, so leave a pointer home for
# whoever lands in it. Written here rather than checked into www/ because it
# describes the deployment, not the site.
cat >"$OUT/README.md" <<'EOF'
# schellingboard.org

Generated — do not edit this repository.

The site is built from `www/` and `docs/screenshots/` in
[LWCW-Europe/schellingboard](https://github.com/LWCW-Europe/schellingboard) and
pushed here on every change to `main`. Edits made here are overwritten by the
next deploy.
EOF

# A screenshot renamed in docs/screenshots/ without updating the HTML is the
# failure this split invites, and it would otherwise reach production as a
# broken image.
missing=0
while read -r ref; do
  [ -e "$OUT/$ref" ] || {
    echo "$ref is referenced by www/*.html but does not exist in docs/screenshots/" >&2
    missing=1
  }
done < <(grep -ho 'screenshots/[A-Za-z0-9._-]*\.webp' www/*.html | sort -u)
[ -e "$OUT/og-image.jpg" ] || {
  echo "og-image.jpg is referenced by www/index.html but missing from www/" >&2
  missing=1
}
# Both pages share one stylesheet, so a typo in either href silently unstyles a
# whole page.
while read -r ref; do
  [ -e "$OUT/$ref" ] || {
    echo "$ref is linked as a stylesheet by www/*.html but missing from www/" >&2
    missing=1
  }
done < <(grep -ho 'href="[A-Za-z0-9._-]*\.css"' www/*.html | sed 's/href="//;s/"//' | sort -u)
[ "$missing" -eq 0 ] || exit 1

echo "Marketing site built in $OUT/ — open $OUT/index.html"
