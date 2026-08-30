import { describe, it, expect } from "vitest";
import { collectSpecs, specFile, specTitle } from "@/scripts/playwright-json";

/** The suite tree Playwright writes for a file with a describe block in it. */
const suites = [
  {
    title: "voting.spec.ts",
    file: "voting.spec.ts",
    specs: [{ title: "top level", file: "voting.spec.ts", line: 10 }],
    suites: [
      {
        title: "voting",
        file: "voting.spec.ts",
        suites: [
          {
            title: "as a guest",
            file: "voting.spec.ts",
            specs: [
              { title: "casts a vote", file: "voting.spec.ts", line: 42 },
            ],
          },
        ],
      },
    ],
  },
];

describe("collectSpecs", () => {
  it("flattens the tree, naming each spec by the describes around it", () => {
    expect(collectSpecs(suites).map(specTitle)).toEqual([
      "top level",
      "voting › as a guest › casts a vote",
    ]);
  });

  it("survives a truncated report", () => {
    expect(collectSpecs([])).toEqual([]);
    expect(collectSpecs([{ title: "x.spec.ts", file: "x.spec.ts" }])).toEqual(
      []
    );
  });
});

describe("specTitle / specFile", () => {
  it("names what a report left unnamed", () => {
    const collected = { spec: {}, titlePath: ["outer"] };
    expect(specTitle(collected)).toBe("outer › (untitled)");
    expect(specFile(collected)).toBe("(unknown file)");
  });
});
