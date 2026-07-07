import { describe, it, expect } from "vitest";
import { normalizeEventIconName } from "@/app/event-icons";

describe("normalizeEventIconName", () => {
  it("keeps a known icon name", () => {
    expect(normalizeEventIconName("RocketLaunchIcon")).toBe("RocketLaunchIcon");
  });

  it("maps a legacy free-text value to no icon", () => {
    expect(normalizeEventIconName("rocket emoji 🚀")).toBe("");
  });

  it("maps null to no icon", () => {
    expect(normalizeEventIconName(null)).toBe("");
  });
});
