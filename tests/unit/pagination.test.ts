import { describe, it, expect } from "vitest";
import { outOfRangePageRedirect } from "@/utils/pagination";

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
