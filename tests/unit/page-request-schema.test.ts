import { describe, it, expect } from "vitest";
import { pageRequestSchema } from "@/model/page";

describe("pageRequestSchema", () => {
  it("parses a valid page and query", () => {
    expect(pageRequestSchema.parse({ page: "3", query: " smith " })).toEqual({
      page: 3,
      query: "smith",
    });
  });

  it("defaults page to 1 when missing", () => {
    expect(pageRequestSchema.parse({})).toEqual({ page: 1, query: "" });
  });

  it("clamps a non-numeric page to 1 instead of failing", () => {
    expect(pageRequestSchema.parse({ page: "abc" })).toEqual({
      page: 1,
      query: "",
    });
  });

  it("clamps a non-integer page to 1", () => {
    expect(pageRequestSchema.parse({ page: "1.5" })).toEqual({
      page: 1,
      query: "",
    });
  });

  it("clamps a zero or negative page to 1", () => {
    expect(pageRequestSchema.parse({ page: "0" })).toEqual({
      page: 1,
      query: "",
    });
    expect(pageRequestSchema.parse({ page: "-5" })).toEqual({
      page: 1,
      query: "",
    });
  });
});
