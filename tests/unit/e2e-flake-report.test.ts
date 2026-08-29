import { describe, it, expect, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  normalizeSignature,
  loadHunt,
  buildReport,
} from "@/scripts/e2e-flake-report";

const tmpDirs: string[] = [];

afterEach(() => {
  for (const dir of tmpDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

/** A Playwright JSON report holding one passing and one optionally failing test. */
function report(failing: boolean) {
  const test = (title: string, ok: boolean, durationMs: number) => ({
    title,
    file: "tests/e2e/x.spec.ts",
    tests: [
      {
        status: ok ? "expected" : "unexpected",
        timeout: 30_000,
        results: [
          {
            status: ok ? "passed" : "failed",
            duration: durationMs,
            errors: ok ? [] : [{ message: "Error: locator.click: Timeout" }],
            attachments: ok
              ? []
              : [{ name: "trace", path: "/abs/test-results/x/trace.zip" }],
          },
        ],
      },
    ],
  });
  return {
    stats: { duration: 60_000, unexpected: failing ? 1 : 0 },
    errors: [],
    suites: [
      {
        title: "tests/e2e/x.spec.ts",
        file: "tests/e2e/x.spec.ts",
        specs: [test("steady", true, 1_000), test("wobbly", !failing, 25_000)],
        suites: [],
      },
    ],
  };
}

/** Lay out a hunt directory whose run `redRuns` (1-based) failed. */
function hunt(runs: number, redRuns: number[], shrinkGreen = false): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "flake-hunt-"));
  tmpDirs.push(dir);
  for (let i = 1; i <= runs; i++) {
    const runDir = path.join(dir, `run-${String(i).padStart(3, "0")}`);
    fs.mkdirSync(runDir);
    const red = redRuns.includes(i);
    const full = report(red);
    const written =
      !red && shrinkGreen
        ? { stats: full.stats, errors: full.errors, suites: [], shrunk: true }
        : full;
    fs.writeFileSync(
      path.join(runDir, "results.json"),
      JSON.stringify(written)
    );
  }
  return dir;
}

describe("normalizeSignature", () => {
  it("keeps the first line and strips ANSI colouring", () => {
    const esc = String.fromCharCode(27);
    expect(
      normalizeSignature(`${esc}[31mError: boom${esc}[39m\n  at foo.ts:1`)
    ).toBe("Error: boom");
  });

  it("collapses the detail that differs between two runs of the same failure", () => {
    const a = normalizeSignature(
      "Timeout 5000ms exceeded at 2026-08-29T10:00:00Z on localhost:41234 for id a1b2c3d4e5"
    );
    const b = normalizeSignature(
      "Timeout 30s exceeded at 2026-01-02T03:04:05Z on localhost:9 for id ffffffffff"
    );
    expect(a).toBe(b);
    expect(a).toBe(
      "Timeout <dur> exceeded at <ts> on localhost:<port> for id <hex>"
    );
  });
});

describe("loadHunt", () => {
  it("counts a test's failures against every run it took part in", () => {
    const { tests } = loadHunt(hunt(3, [3]));
    const wobbly = tests.get("tests/e2e/x.spec.ts › wobbly");
    expect(wobbly).toBeDefined();
    expect(wobbly?.fails).toBe(1);
    expect(wobbly?.runsSeen).toBe(3);
    expect(wobbly?.failedIn).toEqual(["run-003"]);
  });

  it("still counts green runs that were shrunk to their stats block", () => {
    const { tests } = loadHunt(hunt(3, [3], true));
    const wobbly = tests.get("tests/e2e/x.spec.ts › wobbly");
    // Otherwise a flake that failed once in twenty runs reads as 1/1 — a
    // persistent failure — which is the opposite of what the hunt found.
    expect(wobbly?.fails).toBe(1);
    expect(wobbly?.runsSeen).toBe(3);
  });

  it("rejects a directory with no runs in it", () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), "flake-hunt-"));
    tmpDirs.push(empty);
    expect(() => loadHunt(empty)).toThrow(/No run-\* directories/);
  });
});

describe("buildReport", () => {
  it("reports a test that failed in some runs as flaky", () => {
    const report = buildReport([loadHunt(hunt(3, [3]))]);
    const flaky = report.slice(
      report.indexOf("### Flaky tests"),
      report.indexOf("### Duration outliers")
    );
    expect(flaky).toContain("wobbly");
    expect(flaky).toContain("1/3");
    expect(report).not.toContain("### Persistent failures");
  });

  it("reports a test that failed in every run as a persistent failure", () => {
    const report = buildReport([loadHunt(hunt(3, [1, 2, 3]))]);
    expect(report).toContain("### Persistent failures");
    const flaky = report.slice(
      report.indexOf("### Flaky tests"),
      report.indexOf("### Persistent failures")
    );
    expect(flaky).toContain("None");
  });

  it("keeps a shrunk hunt's flake out of the persistent failures", () => {
    const report = buildReport([loadHunt(hunt(3, [3], true))]);
    expect(report).not.toContain("### Persistent failures");
    expect(report).toContain("1/3");
  });
});
