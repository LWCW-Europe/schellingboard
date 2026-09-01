import { describe, it, expect } from "vitest";

import { parsePage } from "@/app/(site)/notifications/page";

// SQLite rejects a non-integer OFFSET with "datatype mismatch", so anything
// that reaches the query has to be a whole number.
describe("parsePage", () => {
  it("reads an ordinary page number", () => {
    expect(parsePage("3")).toBe(3);
  });

  it("falls back to the first page for nonsense", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("")).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-4")).toBe(1);
  });

  it("floors a fractional page rather than offsetting by a fraction", () => {
    expect(parsePage("1.05")).toBe(1);
    expect(parsePage("2.9")).toBe(2);
  });

  it("caps a page too large to mean anything", () => {
    expect(parsePage("99999999")).toBe(10_000);
  });

  it("treats an infinite page as the first one", () => {
    expect(parsePage("1e999")).toBe(1);
  });
});
