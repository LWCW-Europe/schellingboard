#!/usr/bin/env bash
# Build the image we publish, and print its name.
#
# Two callers, one build: `make docker-build` (the release build) and
# scripts/e2e-docker.sh (the E2E run against the image). Building the same
# thing is the point — the release build is meant to be a cache hit of the one
# the suite already ran against, so what gets published is what was tested —
# and that only holds as long as neither side grows a build flag the other
# lacks. Keeping the command in one place is what keeps that true.
#
# Only the image reference goes to stdout, so a caller can capture it:
#
#     IMAGE="$(bash scripts/docker-build.sh)"
#
# The build's own output goes to stderr. BuildKit writes there anyway; the
# redirect is for the legacy builder, which would otherwise land in the capture.
#
# APP_VERSION may be passed in by a caller that already knows it.
set -euo pipefail

cd "$(dirname "$0")/.."

# The version the UI displays is baked in at build time, so an empty
# APP_VERSION builds an image nobody ships.
APP_VERSION="${APP_VERSION:-$(bun scripts/app-version.js)}"
# It is the tag too, so a leftover image says which tree it came from and
# successive builds don't overwrite each other. Never :latest — that means the
# newest published release, which the release checklist tags deliberately (see
# docs/dev/releasing.md).
IMAGE="schellingboard/schellingboard:$APP_VERSION"

docker build --build-arg "APP_VERSION=$APP_VERSION" -t "$IMAGE" . >&2

printf '%s\n' "$IMAGE"
