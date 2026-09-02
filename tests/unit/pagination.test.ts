import { describe, it, expect } from "vitest";
import { outOfRangePageRedirect, parsePage } from "@/utils/pagination";

// A non-integer OFFSET is rejected by SQLite with "datatype mismatch", so a
// page number that is not a whole number has to become 1 rather than reach a
// query. Six pages share this.
describe("parsePage", () => {
  it("reads an ordinary page number", () => {
    expect(parsePage("3")).toBe(3);
  });

  it("falls back to the first page for anything that is not one", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("")).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-4")).toBe(1);
  });

  it("rejects fractions and infinities rather than rounding them", () => {
    expect(parsePage("1.05")).toBe(1);
    expect(parsePage("2.9")).toBe(1);
    expect(parsePage("1e999")).toBe(1);
  });

  // Beyond the last page is not this function's problem: outOfRangePageRedirect
  // sends the visitor to the last real one.
  it("passes a too-large page through", () => {
    expect(parsePage("99999999")).toBe(99999999);
  });
});

describe("outOfRangePageRedirect", () => {
  it("returns null when the page is within range", () => {
    expect(
      outOfRangePageRedirect({
        basePath: "/admin/events/e1/guests",
        page: 2,
        total: 26,
        pageSize: 25,
      })
    ).toBeNull();
  });

  it("redirects to the last page when the page is out of range", () => {
    expect(
      outOfRangePageRedirect({
        basePath: "/admin/events/e1/guests",
        page: 99,
        total: 26,
        pageSize: 25,
      })
    ).toBe("/admin/events/e1/guests?page=2");
  });

  it("preserves extra params and drops empty ones", () => {
    expect(
      outOfRangePageRedirect({
        basePath: "/admin/events/e1/guests",
        page: 99,
        total: 26,
        pageSize: 25,
        params: { q: "smith", filter: "" },
      })
    ).toBe("/admin/events/e1/guests?q=smith&page=2");
  });

  it("omits the page param when clamping to page 1", () => {
    expect(
      outOfRangePageRedirect({
        basePath: "/admin/events/e1/guests",
        page: 5,
        total: 0,
        pageSize: 25,
        params: { q: "zzz", filter: "not-assigned" },
      })
    ).toBe("/admin/events/e1/guests?q=zzz&filter=not-assigned");
  });

  it("returns the bare path when clamping to page 1 with no params", () => {
    expect(
      outOfRangePageRedirect({
        basePath: "/admin/events/e1/guests",
        page: 2,
        total: 0,
        pageSize: 25,
      })
    ).toBe("/admin/events/e1/guests");
  });
});
