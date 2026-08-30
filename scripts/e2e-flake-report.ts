/**
 * Aggregate the results of one or more flake hunts (see e2e-flake-hunt.sh)
 * into a markdown report: which tests fail intermittently, how often, with
 * what error signature, and where their traces are.
 *
 *   bun scripts/e2e-flake-report.ts .flake-hunt/<ts> [more hunt dirs...]
 *
 * Passing several hunt directories adds a before/after comparison table. The
 * report is printed and written to report.md in the last directory given.
 */
import fs from "node:fs";
import path from "node:path";
import {
  collectSpecs,
  specFile,
  specTitle,
  type JsonReport,
} from "./playwright-json";

interface HuntReport extends JsonReport {
  // Not Playwright's: set by e2e-flake-hunt.sh when HUNT_KEEP_PASSING=0 threw
  // a green run's per-test data away.
  shrunk?: boolean;
}

interface Observation {
  key: string;
  status: string;
  durationMs: number;
  timeoutMs: number;
  signature?: string;
  hasTrace: boolean;
}

interface Run {
  name: string;
  green: boolean;
  shrunk: boolean;
  durationMs: number;
  observations: Observation[];
}

interface TestAggregate {
  key: string;
  runsSeen: number;
  fails: number;
  durations: number[];
  timeoutMs: number;
  signatures: Map<string, number>;
  failedIn: string[];
  tracesIn: string[];
}

interface Hunt {
  dir: string;
  runs: Run[];
  tests: Map<string, TestAggregate>;
  meta: string;
}

const DEFAULT_TIMEOUT_MS = 30_000;
// A test consistently spending most of its budget is one slow machine away
// from a timeout, so flag it before it starts failing.
const OUTLIER_FRACTION = 0.6;

function readJson(file: string): HuntReport | undefined {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as HuntReport;
  } catch {
    return undefined;
  }
}

// Built at runtime because a literal escape byte in a regex trips
// eslint's no-control-regex.
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");

function normalizeSignature(message: string): string {
  const firstLine = message.replace(ANSI, "").split("\n")[0]?.trim() ?? "";
  return firstLine
    .replace(/\d{4}-\d{2}-\d{2}T[\d:.]+Z?/g, "<ts>")
    .replace(/localhost:\d+/g, "localhost:<port>")
    .replace(/\b\d+(\.\d+)?\s?(ms|s)\b/g, "<dur>")
    .replace(/\b\d{9,}\b/g, "<n>")
    .replace(/\b[0-9a-f]{8,}\b/gi, "<hex>")
    .replace(/\s+/g, " ")
    .trim();
}

function observationsOf(report: JsonReport): Observation[] {
  const observations: Observation[] = [];
  for (const collected of collectSpecs(report.suites ?? [])) {
    const key = `${specFile(collected)} › ${specTitle(collected)}`;
    for (const test of collected.spec.tests ?? []) {
      const results = test.results ?? [];
      const durationMs = results.reduce((sum, r) => sum + (r.duration ?? 0), 0);
      const failing = results.find(
        (r) => r.status && r.status !== "passed" && r.status !== "skipped"
      );
      const message =
        failing?.errors?.[0]?.message ?? failing?.error?.message ?? "";
      const hasTrace = results
        .flatMap((r) => r.attachments ?? [])
        .some((a) => a.name === "trace" && a.path);
      observations.push({
        key,
        status: test.status ?? "unknown",
        durationMs,
        timeoutMs: test.timeout ?? DEFAULT_TIMEOUT_MS,
        signature: message ? normalizeSignature(message) : undefined,
        hasTrace,
      });
    }
  }
  return observations;
}

function loadHunt(dir: string): Hunt {
  const runDirs = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("run-"))
    .map((entry) => entry.name)
    .sort();
  if (runDirs.length === 0) {
    throw new Error(`No run-* directories in ${dir}`);
  }

  const runs: Run[] = [];
  for (const name of runDirs) {
    const runDir = path.join(dir, name);
    const report = readJson(path.join(runDir, "results.json"));
    if (!report) {
      runs.push({
        name,
        green: false,
        shrunk: false,
        durationMs: 0,
        observations: [],
      });
      continue;
    }
    runs.push({
      name,
      green: (report.stats?.unexpected ?? 0) === 0,
      shrunk: report.shrunk === true,
      durationMs: report.stats?.duration ?? 0,
      observations: observationsOf(report),
    });
  }

  const tests = new Map<string, TestAggregate>();
  for (const run of runs) {
    for (const observation of run.observations) {
      if (observation.status === "skipped") continue;
      let aggregate = tests.get(observation.key);
      if (!aggregate) {
        aggregate = {
          key: observation.key,
          runsSeen: 0,
          fails: 0,
          durations: [],
          timeoutMs: observation.timeoutMs,
          signatures: new Map(),
          failedIn: [],
          tracesIn: [],
        };
        tests.set(observation.key, aggregate);
      }
      aggregate.runsSeen += 1;
      aggregate.durations.push(observation.durationMs);
      if (observation.status !== "expected") {
        aggregate.fails += 1;
        aggregate.failedIn.push(run.name);
        const signature = observation.signature ?? "(no error message)";
        aggregate.signatures.set(
          signature,
          (aggregate.signatures.get(signature) ?? 0) + 1
        );
        if (observation.hasTrace) aggregate.tracesIn.push(run.name);
      }
    }
  }

  // A shrunk run kept only its stats, but it was green, so every test that
  // ran anywhere in the hunt passed in it. Without this the denominator of
  // the failure rate would count red runs only, and a flake that failed once
  // in twenty runs would read as 1/1 — a persistent failure, the opposite of
  // what the hunt found. (A test skipped only in some runs is credited a pass
  // it never earned; the alternative is not reporting failure rates at all.)
  const shrunkRuns = runs.filter((run) => run.shrunk).length;
  for (const aggregate of tests.values()) aggregate.runsSeen += shrunkRuns;

  const metaFile = path.join(dir, "meta.json");
  const meta = fs.existsSync(metaFile)
    ? fs.readFileSync(metaFile, "utf8").trim()
    : "";

  return { dir, runs, tests, meta };
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil(p * sorted.length) - 1)
  );
  return sorted[index] ?? 0;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const seconds = ms / 1000;
  if (seconds < 90) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m${String(Math.round(seconds % 60)).padStart(2, "0")}s`;
}

function cell(text: string, maxLength = 140): string {
  const trimmed =
    text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
  return trimmed.replace(/\|/g, "\\|");
}

function dominantSignature(aggregate: TestAggregate): string {
  let best = "";
  let bestCount = 0;
  for (const [signature, count] of aggregate.signatures) {
    if (count > bestCount) {
      best = signature;
      bestCount = count;
    }
  }
  const others = aggregate.signatures.size - 1;
  return others > 0 ? `${best} _(+${others} other)_` : best;
}

function runList(names: string[]): string {
  if (names.length === 0) return "—";
  const shown = names.slice(0, 5).join(", ");
  return names.length > 5 ? `${shown}, +${names.length - 5}` : shown;
}

function huntSection(hunt: Hunt): string[] {
  const lines: string[] = [];
  const green = hunt.runs.filter((run) => run.green).length;
  const durations = hunt.runs.map((run) => run.durationMs);

  lines.push(`## ${hunt.dir}`, "");
  lines.push(
    `- Runs: **${hunt.runs.length}** (green ${green}, red ${hunt.runs.length - green})`
  );
  lines.push(
    `- Wall clock per run: p50 ${formatDuration(percentile(durations, 0.5))}, p95 ${formatDuration(percentile(durations, 0.95))}`
  );
  const shrunk = hunt.runs.filter((run) => run.shrunk).length;
  if (shrunk > 0) {
    lines.push(
      `- ${shrunk} green run(s) kept only their stats (\`HUNT_KEEP_PASSING=0\`):` +
        " counted as passes below, but their durations are missing, so the" +
        " duration outliers are drawn from the red runs alone"
    );
  }
  if (hunt.meta) {
    lines.push("", "<details><summary>meta.json</summary>", "");
    lines.push("```json", hunt.meta, "```", "</details>");
  }
  lines.push("");

  const aggregates = [...hunt.tests.values()];
  const persistent = aggregates
    .filter((a) => a.fails > 0 && a.fails === a.runsSeen)
    .sort((a, b) => b.fails - a.fails);
  const flaky = aggregates
    .filter((a) => a.fails > 0 && a.fails < a.runsSeen)
    .sort((a, b) => b.fails / b.runsSeen - a.fails / a.runsSeen);

  lines.push("### Flaky tests", "");
  if (flaky.length === 0) {
    lines.push("None — no test failed in some runs and passed in others.", "");
  } else {
    lines.push("| Test | Fails | Signature | Traces in |");
    lines.push("| --- | --- | --- | --- |");
    for (const aggregate of flaky) {
      lines.push(
        `| ${cell(aggregate.key)} | ${aggregate.fails}/${aggregate.runsSeen} | ${cell(
          dominantSignature(aggregate)
        )} | ${runList(aggregate.tracesIn)} |`
      );
    }
    lines.push("");
  }

  if (persistent.length > 0) {
    lines.push("### Persistent failures", "");
    lines.push(
      "Failed in every run they were part of — a breakage, not a flake.",
      ""
    );
    lines.push("| Test | Fails | Signature | Traces in |");
    lines.push("| --- | --- | --- | --- |");
    for (const aggregate of persistent) {
      lines.push(
        `| ${cell(aggregate.key)} | ${aggregate.fails}/${aggregate.runsSeen} | ${cell(
          dominantSignature(aggregate)
        )} | ${runList(aggregate.tracesIn)} |`
      );
    }
    lines.push("");
  }

  const outliers = aggregates
    .map((aggregate) => ({
      aggregate,
      p95: percentile(aggregate.durations, 0.95),
    }))
    .filter(
      ({ aggregate, p95 }) => p95 > OUTLIER_FRACTION * aggregate.timeoutMs
    )
    .sort((a, b) => b.p95 - a.p95);

  lines.push(
    `### Duration outliers (p95 above ${OUTLIER_FRACTION * 100}% of the timeout)`,
    ""
  );
  if (outliers.length === 0) {
    lines.push("None.", "");
  } else {
    lines.push("| Test | p50 | p95 | Timeout |");
    lines.push("| --- | --- | --- | --- |");
    for (const { aggregate, p95 } of outliers) {
      lines.push(
        `| ${cell(aggregate.key)} | ${formatDuration(
          percentile(aggregate.durations, 0.5)
        )} | ${formatDuration(p95)} | ${formatDuration(aggregate.timeoutMs)} |`
      );
    }
    lines.push("");
  }

  // One root cause often hits several tests, so the same signature appearing
  // across them is the strongest hint the report can give.
  const bySignature = new Map<string, { count: number; tests: Set<string> }>();
  for (const aggregate of aggregates) {
    for (const [signature, count] of aggregate.signatures) {
      const entry = bySignature.get(signature) ?? {
        count: 0,
        tests: new Set(),
      };
      entry.count += count;
      entry.tests.add(aggregate.key);
      bySignature.set(signature, entry);
    }
  }
  lines.push("### Failure signatures", "");
  if (bySignature.size === 0) {
    lines.push("None.", "");
  } else {
    lines.push("| Signature | Failures | Tests |");
    lines.push("| --- | --- | --- |");
    for (const [signature, entry] of [...bySignature].sort(
      (a, b) => b[1].count - a[1].count
    )) {
      lines.push(
        `| ${cell(signature)} | ${entry.count} | ${entry.tests.size} |`
      );
    }
    lines.push("");
  }

  return lines;
}

function comparisonSection(hunts: Hunt[]): string[] {
  const keys = new Set<string>();
  for (const hunt of hunts) {
    for (const [key, aggregate] of hunt.tests) {
      if (aggregate.fails > 0) keys.add(key);
    }
  }
  if (keys.size === 0) return [];

  const lines: string[] = ["## Comparison", ""];
  lines.push(`| Test | ${hunts.map((h) => cell(h.dir, 40)).join(" | ")} |`);
  lines.push(`| --- | ${hunts.map(() => "---").join(" | ")} |`);
  for (const key of [...keys].sort()) {
    const cells = hunts.map((hunt) => {
      const aggregate = hunt.tests.get(key);
      if (!aggregate) return "—";
      return `${aggregate.fails}/${aggregate.runsSeen}`;
    });
    lines.push(`| ${cell(key)} | ${cells.join(" | ")} |`);
  }
  lines.push("");
  return lines;
}

function buildReport(hunts: Hunt[]): string {
  const lines = [
    "# E2E flake hunt report",
    "",
    `Generated ${new Date().toISOString()}`,
    "",
  ];
  for (const hunt of hunts) lines.push(...huntSection(hunt));
  if (hunts.length > 1) lines.push(...comparisonSection(hunts));
  return lines.join("\n");
}

function main() {
  const dirs = process.argv.slice(2);
  if (dirs.length === 0) {
    console.error(
      "usage: bun scripts/e2e-flake-report.ts <hunt dir> [more hunt dirs...]"
    );
    process.exit(2);
  }

  const report = buildReport(dirs.map(loadHunt));
  const target = path.join(dirs[dirs.length - 1], "report.md");
  fs.writeFileSync(target, `${report}\n`);
  console.log(report);
  console.log(`\nWritten to ${target}`);
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}

export { normalizeSignature, loadHunt, buildReport };
