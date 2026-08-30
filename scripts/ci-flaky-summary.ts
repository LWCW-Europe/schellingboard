/**
 * Report the tests a CI run only passed on retry, which a green check would
 * otherwise hide (CI runs with retries).
 *
 *   bun scripts/ci-flaky-summary.ts [playwright-results.json]
 *
 * Writes a warning annotation per flaky test to stdout — GitHub Actions reads
 * those off the log — and a table to the job summary. Always exits 0: the
 * point is a greppable record, not a new gate.
 */
import fs from "node:fs";
import path from "node:path";
import {
  collectSpecs,
  specFile,
  specTitle,
  type JsonReport,
} from "./playwright-json";

interface FlakyTest {
  file: string;
  line?: number;
  title: string;
  attempts: number;
}

/**
 * Playwright reports spec files relative to `rootDir` — the common root of the
 * test directories, `tests/e2e/`, not the repository. GitHub resolves an
 * annotation's `file=` against the workspace, so rebase it there. A report
 * from another checkout (`rootDir` outside this one) keeps its own path;
 * a wrong guess would be worse than the raw one.
 */
function repoRelative(file: string, rootDir?: string): string {
  if (!rootDir) return file;
  const relative = path.relative(process.cwd(), path.resolve(rootDir, file));
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative)
    ? relative
    : file;
}

function flakyTests(report: JsonReport): FlakyTest[] {
  const rootDir = report.config?.rootDir;
  const out: FlakyTest[] = [];
  for (const collected of collectSpecs(report.suites ?? [])) {
    for (const test of collected.spec.tests ?? []) {
      if (test.status !== "flaky") continue;
      out.push({
        file: repoRelative(specFile(collected), rootDir),
        line: collected.spec.line,
        title: specTitle(collected),
        attempts: test.results?.length ?? 0,
      });
    }
  }
  return out;
}

// https://docs.github.com/actions/reference/workflow-commands-for-github-actions
function escapeCommandData(value: string): string {
  return value.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}

// Property values are parsed off a comma-separated, colon-terminated list, so
// they need those two escaped on top of the data escapes.
function escapeCommandProperty(value: string): string {
  return escapeCommandData(value).replace(/:/g, "%3A").replace(/,/g, "%2C");
}

function formatAnnotations(flaky: FlakyTest[]): string[] {
  return flaky.map((test) => {
    const location = test.line ? `,line=${test.line}` : "";
    const attempt = test.attempts
      ? ` (passed on attempt ${test.attempts})`
      : "";
    return (
      `::warning file=${escapeCommandProperty(test.file)}${location}::` +
      escapeCommandData(`flaky: ${test.title}${attempt}`)
    );
  });
}

function formatSummary(flaky: FlakyTest[]): string {
  if (flaky.length === 0) return "";
  const lines = [
    `### Flaky tests (${flaky.length})`,
    "",
    "Passed only on retry. Open the `playwright-report` artifact — the trace of" +
      " the failed attempt is in it (see docs/dev/testing.md § Flaky tests on CI).",
    "",
    "| Test | Where | Attempts |",
    "| --- | --- | --- |",
  ];
  for (const test of flaky) {
    const where = test.line ? `${test.file}:${test.line}` : test.file;
    lines.push(
      `| ${test.title.replace(/\|/g, "\\|")} | \`${where}\` | ${test.attempts || "?"} |`
    );
  }
  return `${lines.join("\n")}\n`;
}

function main() {
  const file = process.argv[2] ?? "playwright-results.json";
  let report: JsonReport;
  try {
    report = JSON.parse(fs.readFileSync(file, "utf8")) as JsonReport;
  } catch (error) {
    // A run that died before writing the report is already reported as a
    // failure by the test step; do not add a second, confusing one.
    console.log(`No usable ${file} (${String(error)}) — skipping flake check.`);
    return;
  }

  const flaky = flakyTests(report);
  if (flaky.length === 0) {
    console.log("No tests passed on retry.");
    return;
  }
  for (const line of formatAnnotations(flaky)) console.log(line);

  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) fs.appendFileSync(summaryFile, formatSummary(flaky));
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}

export { flakyTests, formatAnnotations, formatSummary };
export type { FlakyTest };
