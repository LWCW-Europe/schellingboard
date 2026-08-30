import path from "node:path";
import { describe, it, expect } from "vitest";
import {
  flakyTests,
  formatAnnotations,
  formatSummary,
} from "@/scripts/ci-flaky-summary";

/**
 * A Playwright JSON report with one steady test and one that flaked, shaped
 * like the real thing: `config.rootDir` is the test directory and every spec
 * file is relative to it, not to the repository root.
 */
function report() {
  return {
    config: { rootDir: path.join(process.cwd(), "tests", "e2e") },
    stats: { unexpected: 0, flaky: 1 },
    suites: [
      {
        title: "voting.spec.ts",
        file: "voting.spec.ts",
        specs: [
          {
            title: "steady",
            file: "voting.spec.ts",
            line: 10,
            tests: [{ status: "expected", results: [{ status: "passed" }] }],
          },
        ],
        suites: [
          {
            title: "voting",
            file: "voting.spec.ts",
            specs: [
              {
                title: "wobbly",
                file: "voting.spec.ts",
                line: 42,
                tests: [
                  {
                    status: "flaky",
                    results: [{ status: "failed" }, { status: "passed" }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

describe("flakyTests", () => {
  it("finds tests that only passed on retry, nested suites included", () => {
    expect(flakyTests(report())).toEqual([
      {
        file: "tests/e2e/voting.spec.ts",
        line: 42,
        title: "voting › wobbly",
        attempts: 2,
      },
    ]);
  });

  it("keeps the reported path when the report names no rootDir", () => {
    const truncated = { suites: report().suites };
    expect(flakyTests(truncated)[0]?.file).toBe("voting.spec.ts");
  });

  it("keeps the reported path when rootDir is another checkout", () => {
    const elsewhere = { ...report(), config: { rootDir: "/somewhere/else" } };
    expect(flakyTests(elsewhere)[0]?.file).toBe("voting.spec.ts");
  });

  it("returns nothing for a clean report", () => {
    expect(flakyTests({ suites: [] })).toEqual([]);
  });

  it("survives a truncated report", () => {
    expect(flakyTests({})).toEqual([]);
  });
});

describe("formatAnnotations", () => {
  it("emits one workflow warning command per flaky test", () => {
    expect(formatAnnotations(flakyTests(report()))).toEqual([
      "::warning file=tests/e2e/voting.spec.ts,line=42::flaky: voting › wobbly (passed on attempt 2)",
    ]);
  });

  it("escapes the characters GitHub reads as command syntax", () => {
    const lines = formatAnnotations([
      { file: "a.spec.ts", line: 1, title: "a % b\nc", attempts: 2 },
    ]);
    expect(lines[0]).toContain("a %25 b%0Ac");
  });

  it("escapes the separators GitHub reads inside the file property", () => {
    const lines = formatAnnotations([
      { file: "od,d:name.spec.ts", line: 1, title: "t", attempts: 2 },
    ]);
    expect(lines[0]).toBe(
      "::warning file=od%2Cd%3Aname.spec.ts,line=1::flaky: t (passed on attempt 2)"
    );
  });
});

describe("formatSummary", () => {
  it("is empty when nothing flaked, so the job summary stays clean", () => {
    expect(formatSummary([])).toBe("");
  });

  it("tables the flaky tests", () => {
    const summary = formatSummary(flakyTests(report()));
    expect(summary).toContain("Flaky tests");
    expect(summary).toContain("tests/e2e/voting.spec.ts:42");
    expect(summary).toContain("voting › wobbly");
  });
});
