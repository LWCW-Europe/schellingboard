import { describe, it, expect } from "vitest";

import type { Attendee } from "@/db/repositories/interfaces";
import { searchAttendees } from "@/utils/attendee-search";

let counter = 0;

function attendee(overrides: Partial<Attendee> & { name: string }): Attendee {
  return {
    id: `id-${++counter}`,
    isHost: false,
    info: undefined,
    ...overrides,
  };
}

describe("searchAttendees", () => {
  it("returns everyone in name order for an empty query", () => {
    const rows = [
      attendee({ name: "Carol" }),
      attendee({ name: "Alice" }),
      attendee({ name: "Bob" }),
    ];

    const result = searchAttendees(rows, "");
    expect(result.map((r) => r.name)).toEqual(["Alice", "Bob", "Carol"]);
  });

  it("excludes attendees that match nowhere", () => {
    const rows = [
      attendee({ name: "Alice", aboutMe: "I love hiking" }),
      attendee({ name: "Bob", aboutMe: "Trains and railways" }),
    ];

    const result = searchAttendees(rows, "hiking");
    expect(result.map((r) => r.name)).toEqual(["Alice"]);
  });

  it("ranks a declared language speaker above an incidental bio mention", () => {
    const rows = [
      attendee({ name: "Foodie", aboutMe: "I adore Italian food" }),
      attendee({ name: "Speaker", languages: ["Italian"] }),
    ];

    const result = searchAttendees(rows, "Italian");
    expect(result.map((r) => r.name)).toEqual(["Speaker", "Foodie"]);
  });

  it("ranks a name match above everything else", () => {
    const rows = [
      attendee({ name: "Zoe", languages: ["Kim"] }),
      attendee({ name: "Kim" }),
    ];

    const result = searchAttendees(rows, "kim");
    expect(result.map((r) => r.name)).toEqual(["Kim", "Zoe"]);
  });

  it("matches case-insensitively across basedIn and prompt answers", () => {
    const rows = [
      attendee({ name: "Alice", basedIn: "Berlin" }),
      attendee({
        name: "Bob",
        prompts: [{ prompt: "Ask me about", answer: "moving to berlin" }],
      }),
      attendee({ name: "Carol" }),
    ];

    const result = searchAttendees(rows, "BERLIN");
    expect(result.map((r) => r.name).sort()).toEqual(["Alice", "Bob"]);
  });

  it("does not match contact values", () => {
    // Contacts are shown on the profile, but searching them invites scraping
    // and matches nothing a directory scanner is looking for.
    const rows = [
      attendee({
        name: "Alice",
        contacts: [{ type: "email", value: "secret-handle@example.com" }],
      }),
    ];

    expect(searchAttendees(rows, "secret-handle")).toEqual([]);
  });

  it("orders ties within a rank tier by name", () => {
    const rows = [
      attendee({ name: "Zoe", languages: ["French"] }),
      attendee({ name: "Anna", languages: ["French"] }),
    ];

    const result = searchAttendees(rows, "French");
    expect(result.map((r) => r.name)).toEqual(["Anna", "Zoe"]);
  });
});
