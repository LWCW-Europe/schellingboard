#!/usr/bin/env bash
# Run the E2E suite N times and keep machine-readable results, so flaky tests
# can be found by rate instead of by anecdote. Typically started once and left
# to run (overnight):
#
#     nohup scripts/e2e-flake-hunt.sh 20 > flake-hunt.log 2>&1 &
#     scripts/e2e-flake-hunt.sh 5 -- tests/e2e/voting.spec.ts --repeat-each=3
#
# Results land in .flake-hunt/<UTC timestamp>/run-NNN/ (results.json, the
# Playwright JSON report, plus traces of whatever failed). The run ends by
# aggregating them with scripts/e2e-flake-report.ts.
#
# Knobs:
#   E2E_WORKERS=N       passed to playwright as --workers; setting it to (or
#                       above) the core count overloads the CPU on purpose,
#                       which is what makes timing flakes show up sooner.
#   HUNT_KEEP_PASSING=0 shrink a green run's results.json to its stats block.
#                       Only worth it for very long hunts — the per-test data
#                       it drops is what the duration-outlier section needs.
#
# The server is built and started once for the whole hunt, not per run: a
# `next build` per iteration would dominate the runtime, while the part that
# actually has to repeat — reseeding the database in globalSetup — still runs
# once per iteration.
#
# If the mail variables are set in .env.test.local, mailpit must be running
# (`make mailpit`), otherwise every run fails the email specs identically. The
# report calls that out as a persistent failure rather than a flake.
set -euo pipefail

cd "$(dirname "$0")/.."

# Playwright and the package scripts get this for free from their runner; a
# plain shell script has to put `next` on the PATH itself.
PATH="$PWD/node_modules/.bin:$PATH"
export PATH

RUNS=20
if [ $# -gt 0 ] && [ "$1" != "--" ]; then
  RUNS="$1"
  shift
fi
if [ $# -gt 0 ]; then
  if [ "$1" != "--" ]; then
    echo "usage: $0 [runs] [-- extra playwright args]" >&2
    exit 2
  fi
  shift
fi
EXTRA=("$@")

if ! [[ "$RUNS" =~ ^[1-9][0-9]*$ ]]; then
  echo "runs must be a positive integer, got \"$RUNS\"" >&2
  exit 2
fi

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT=".flake-hunt/$TIMESTAMP"
mkdir -p "$OUT"

PORT="$(bun -e 'const s=require("net").createServer();s.listen(0,()=>{process.stdout.write(String(s.address().port));s.close();})')"
BASE_URL="http://localhost:$PORT"

server_answering() { curl -fsS "$BASE_URL/api/health" >/dev/null 2>&1; }

SERVER_PID=""
cleanup() {
  status=$?
  if [ -n "$SERVER_PID" ]; then
    # setsid put the server in its own process group, so the whole tree
    # (bun → sh → next-server) goes down with one signal.
    kill -- "-$SERVER_PID" 2>/dev/null || kill "$SERVER_PID" 2>/dev/null || true
    for _ in $(seq 1 20); do
      if ! server_answering; then break; fi
      sleep 0.5
    done
    if server_answering; then
      echo "warning: something is still answering $BASE_URL — kill it by hand" >&2
    fi
  fi
  exit $status
}
trap cleanup EXIT

echo "==> Building the app"
bun set-env.ts test "next build"

echo "==> Starting the server on $BASE_URL"
# SITE_URL ends up in the links of sent mail; a real environment variable beats
# the .env.test value (see set-env.ts), so the email specs follow links back to
# this hunt's server.
SITE_URL="$BASE_URL" setsid bun set-env.ts test "next start -p $PORT" \
  >"$OUT/server.log" 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 120); do
  if server_answering; then
    ready=1
    break
  fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "The server exited before answering — see $OUT/server.log" >&2
    exit 1
  fi
  sleep 1
done
if [ -z "${ready:-}" ]; then
  echo "The server did not answer $BASE_URL/api/health within 120s" >&2
  exit 1
fi

PW_ARGS=(--reporter=json --trace=retain-on-failure)
# Raw failure rates are the point, so no retries — and with one server shared
# by every run, a retry would re-enter a database the suite has already
# mutated. (CI=1 in the environment would otherwise switch retries on.)
PW_ARGS+=(--retries=0)
if [ -n "${E2E_WORKERS:-}" ]; then
  PW_ARGS+=("--workers=$E2E_WORKERS")
fi

HUNT_META_COMMAND="$0 $RUNS${EXTRA[*]:+ -- ${EXTRA[*]}}" \
  HUNT_META_COMMIT="$(git rev-parse HEAD 2>/dev/null || echo unknown)" \
  HUNT_META_DIRTY="$(test -n "$(git status --porcelain 2>/dev/null)" && echo 1 || echo 0)" \
  HUNT_META_RUNS="$RUNS" \
  HUNT_META_WORKERS="${E2E_WORKERS:-default}" \
  HUNT_META_NPROC="$(nproc 2>/dev/null || echo unknown)" \
  HUNT_META_PLAYWRIGHT="$(bun x playwright --version 2>/dev/null || echo unknown)" \
  HUNT_META_PORT="$PORT" \
  bun -e 'console.log(JSON.stringify({
    command: process.env.HUNT_META_COMMAND,
    startedAt: new Date().toISOString(),
    commit: process.env.HUNT_META_COMMIT,
    dirty: process.env.HUNT_META_DIRTY === "1",
    runs: Number(process.env.HUNT_META_RUNS),
    workers: process.env.HUNT_META_WORKERS,
    nproc: process.env.HUNT_META_NPROC,
    playwright: process.env.HUNT_META_PLAYWRIGHT,
    port: Number(process.env.HUNT_META_PORT),
  }, null, 2))' >"$OUT/meta.json"

echo "==> $RUNS runs into $OUT"
for i in $(seq 1 "$RUNS"); do
  RUN_DIR="$OUT/$(printf 'run-%03d' "$i")"
  mkdir -p "$RUN_DIR"
  started=$(date +%s)

  set +e
  PLAYWRIGHT_JSON_OUTPUT_FILE="$RUN_DIR/results.json" \
    E2E_EXTERNAL_SERVER=1 \
    E2E_PORT="$PORT" \
    SITE_URL="$BASE_URL" \
    bun set-env.ts test bun x playwright test \
    "${PW_ARGS[@]}" --output="$RUN_DIR/test-results" "${EXTRA[@]}" \
    >"$RUN_DIR/run.log" 2>&1
  exit_code=$?
  set -e
  echo "$exit_code" >"$RUN_DIR/exit-code"

  elapsed=$(($(date +%s) - started))
  failed="$(RESULTS="$RUN_DIR/results.json" bun -e '
    const fs = require("fs");
    try {
      const r = JSON.parse(fs.readFileSync(process.env.RESULTS, "utf8"));
      process.stdout.write(String(r.stats?.unexpected ?? "?"));
    } catch {
      process.stdout.write("?");
    }' 2>/dev/null || echo "?")"

  if [ "$failed" = "0" ] && [ "${HUNT_KEEP_PASSING:-1}" = "0" ]; then
    RESULTS="$RUN_DIR/results.json" bun -e '
      const fs = require("fs");
      const r = JSON.parse(fs.readFileSync(process.env.RESULTS, "utf8"));
      fs.writeFileSync(
        process.env.RESULTS,
        JSON.stringify({
          stats: r.stats,
          errors: r.errors,
          suites: [],
          // Read by e2e-flake-report.ts: without it the run would drop out of
          // the failure-rate denominator and turn every flake into a
          // persistent failure.
          shrunk: true,
        })
      );'
  fi

  printf 'run %03d: %s failed, exit %s (%ds)\n' "$i" "$failed" "$exit_code" "$elapsed"
done

echo "==> Aggregating"
bun scripts/e2e-flake-report.ts "$OUT"
