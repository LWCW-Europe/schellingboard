#!/usr/bin/env bash
# Run the E2E suite against the production Docker image.
#
# `make test-e2e` exercises a `next build && next start` server, which is not
# what we ship: the image runs the standalone output as `node server.js`, with
# migrations, uploads and the SQLite file on a mounted /data volume. Bugs that
# only exist there (a file the standalone tracer failed to copy, a path that
# resolves differently under a different working directory) are invisible to
# every other test tier, which is why this is a release checklist item — see
# docs/dev/testing.md § Testing the Docker image.
#
# Run through set-env.ts (`make test-e2e-docker`) so the test credentials and
# the optional mail variables are already in the environment; they are handed
# to the container so the suite's logins work against it.
#
# Extra arguments are passed to `playwright test`, e.g.
#
#     bun set-env.ts test bash scripts/e2e-docker.sh tests/e2e/proposals.spec.ts
set -euo pipefail

cd "$(dirname "$0")/.."

# The seed script refuses to touch an uploads directory outside the project
# (a guard against wiping a real one), so the volume lives here rather than in
# a temp directory. Gitignored, and left behind after a run for inspection.
DATA_DIR="$PWD/.e2e-docker"
# The PID keeps clones and workspaces from clashing over the container name.
CONTAINER="schellingboard-e2e-$$"

# Build from the working tree unless the caller named an image (e.g. to run the
# suite against a release image that was already built or pulled).
#
# Through the same script `make docker-build` runs, so the release build is a
# cache hit of this one and what gets published is what was tested here. That
# guarantee is the reason the build command isn't inlined here.
if [ -n "${IMAGE:-}" ]; then
  echo "==> Using existing image $IMAGE"
else
  echo "==> Building the image"
  IMAGE="$(bash scripts/docker-build.sh)"
  echo "==> Built $IMAGE"
fi

# Playwright's own port picking is bypassed here (E2E_EXTERNAL_SERVER), so pick
# the port before starting the container: SITE_URL has to be baked into its
# environment at startup, and the port is part of it.
PORT="$(bun -e 'const s=require("net").createServer();s.listen(0,()=>{process.stdout.write(String(s.address().port));s.close();})')"
BASE_URL="http://localhost:$PORT"

# A stale database would hide exactly the failures this run is looking for
# (a migration that never ran, an upload directory that is never created).
rm -rf "$DATA_DIR"
mkdir -p "$DATA_DIR"

# Mail, when configured: the suite's mailpit runs on the host's localhost,
# which inside the container means the host-gateway alias.
to_container_host() {
  printf '%s' "${1//localhost/host.docker.internal}" |
    sed 's/127\.0\.0\.1/host.docker.internal/g'
}

env_args=()
for var in SITE_PASSWORD ADMIN_PASSWORD AUTH_SECRET SB_ENABLE_DEV_TOOLS \
  SMTP_FROM SMTP_PORT SMTP_USER SMTP_PASSWORD SMTP_SECURE; do
  if [ -n "${!var:-}" ]; then
    env_args+=(-e "$var=${!var}")
  fi
done
for var in SMTP_URL SMTP_HOST; do
  if [ -n "${!var:-}" ]; then
    env_args+=(-e "$var=$(to_container_host "${!var}")")
  fi
done
# Emails link back to the site, so point them at the container's host port.
env_args+=(-e "SITE_URL=$BASE_URL")

# Once the mail variables are set, the email specs fail rather than skip
# (docs/dev/testing.md § Running tests), so start mailpit if it isn't up — a
# release check shouldn't fall over because a background service wasn't
# started by hand. Ports come from .env.dev.local, the file `make mailpit`
# feeds compose (see the note above that target).
mailpit_compose=(docker compose -f docker-compose.dev.yml)
if [ -f .env.dev.local ]; then
  mailpit_compose+=(--env-file .env.dev.local)
fi
started_mailpit=""
mailpit_ready() { curl -fsS "$MAILPIT_API_URL/readyz" >/dev/null 2>&1; }

container_started=""
cleanup() {
  status=$?
  # Leave a self-started mailpit up after a failure: its web UI is where a
  # failing email test is diagnosed.
  if [ -n "$started_mailpit" ]; then
    if [ "$status" -eq 0 ]; then
      "${mailpit_compose[@]}" stop mailpit >/dev/null 2>&1 || true
    else
      echo "==> Leaving mailpit running for inspection ($MAILPIT_API_URL);" \
        "stop it with: ${mailpit_compose[*]} stop mailpit" >&2
    fi
  fi
  if [ -n "$container_started" ]; then
    if [ "$status" -ne 0 ]; then
      echo "==> Container logs (last 50 lines):" >&2
      docker logs --tail 50 "$CONTAINER" >&2 2>&1 || true
    fi
    docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  fi
}
# Installed before mailpit is started, so an early exit still tidies up.
trap cleanup EXIT

if [ -n "${MAILPIT_API_URL:-}" ] && ! mailpit_ready; then
  echo "==> Starting mailpit ($MAILPIT_API_URL is not answering)"
  "${mailpit_compose[@]}" up -d mailpit
  started_mailpit=1
  for _ in $(seq 1 30); do
    if mailpit_ready; then break; fi
    sleep 1
  done
  if ! mailpit_ready; then
    echo "mailpit did not answer at $MAILPIT_API_URL — do MAILPIT_UI_PORT" \
      "(.env.dev.local) and MAILPIT_API_URL (.env.test.local) agree?" >&2
    exit 1
  fi
fi

# --user: the image's own uid (1001) would own the files it writes into the
#   bind mount, leaving directories the host user cannot clean up afterwards.
#   The app itself is uid-agnostic.
# --tmpfs: consequence of the above — /app is owned by 1001, so Next's image
#   optimizer cannot create its cache directory and every optimized image logs
#   an unhandled EACCES. A writable tmpfs at that path keeps the run quiet.
echo "==> Starting $CONTAINER on $BASE_URL"
# Set before `docker run`, which leaves the container behind even when it fails
# to start.
container_started=1
docker run -d \
  --name "$CONTAINER" \
  --user "$(id -u):$(id -g)" \
  -p "127.0.0.1:$PORT:3000" \
  -v "$DATA_DIR:/data" \
  --tmpfs "/app/.next/cache:uid=$(id -u),gid=$(id -g)" \
  --add-host host.docker.internal:host-gateway \
  "${env_args[@]}" \
  "$IMAGE" >/dev/null

echo "==> Waiting for the container to become healthy"
for _ in $(seq 1 120); do
  if curl -fsS "$BASE_URL/api/health" >/dev/null 2>&1; then
    ready=1
    break
  fi
  if [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER")" != "true" ]; then
    echo "Container exited before becoming healthy" >&2
    exit 1
  fi
  sleep 1
done
if [ -z "${ready:-}" ]; then
  echo "Container did not answer $BASE_URL/api/health within 120s" >&2
  exit 1
fi

# Seeding (Playwright's globalSetup) writes to the same SQLite file and uploads
# directory the container reads through the bind mount, so the suite gets its
# usual test data without any seeding code inside the image.
echo "==> Running E2E tests against the container"
DATABASE_URL="file:$DATA_DIR/data.db" \
  SB_UPLOADS_DIR="$DATA_DIR/uploads" \
  E2E_EXTERNAL_SERVER=1 \
  E2E_PORT="$PORT" \
  bun x playwright test "$@"
