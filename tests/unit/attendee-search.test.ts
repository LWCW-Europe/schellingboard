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

  it("ranks a partial language hit as free text, not a declared language", () => {
    const rows = [
      attendee({ name: "Foodie", aboutMe: "I adore Italian food" }),
      attendee({ name: "Speaker", languages: ["Italian"] }),
    ];

    // "ital" is nobody's declared language, so both are free-text hits and
    // sort by name.
    const result = searchAttendees(rows, "ital");
    expect(result.map((r) => r.name)).toEqual(["Foodie", "Speaker"]);
  });

  it("ignores accents in names and declared languages", () => {
    const rows = [
      attendee({ name: "Amélie", aboutMe: "Español food blog" }),
      attendee({ name: "Bruno", languages: ["Español"] }),
    ];

    expect(searchAttendees(rows, "amelie").map((r) => r.name)).toEqual([
      "Amélie",
    ]);
    // Bruno declares the language, Amélie only mentions it.
    expect(searchAttendees(rows, "espanol").map((r) => r.name)).toEqual([
      "Bruno",
      "Amélie",
    ]);
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

  it("matches public contact values and their labels", () => {
    const rows = [
      attendee({
        name: "Alice",
        contacts: [{ type: "telegram", value: "@alice_in_wonderland" }],
      }),
      attendee({
        name: "Bob",
        contacts: [
          { type: "other", label: "Mastodon", value: "@bob@example.social" },
        ],
      }),
      attendee({ name: "Carol" }),
    ];

    expect(searchAttendees(rows, "wonderland").map((r) => r.name)).toEqual([
      "Alice",
    ]);
    expect(searchAttendees(rows, "mastodon").map((r) => r.name)).toEqual([
      "Bob",
    ]);
    // Built-in types carry no stored label; the profile prints the type's
    // name, so that is what has to match.
    expect(searchAttendees(rows, "telegram").map((r) => r.name)).toEqual([
      "Alice",
    ]);
  });

  it("matches the prompt question, not just its answer", () => {
    const rows = [
      attendee({
        name: "Alice",
        prompts: [{ prompt: "Looking for", answer: "a climbing partner" }],
      }),
      attendee({ name: "Bob" }),
    ];

    expect(searchAttendees(rows, "looking for").map((r) => r.name)).toEqual([
      "Alice",
    ]);
  });

  it("ranks a name match above a contact match", () => {
    const rows = [
      attendee({
        name: "Zoe",
        contacts: [{ type: "discord", value: "kim#1234" }],
      }),
      attendee({ name: "Kim" }),
    ];

    expect(searchAttendees(rows, "kim").map((r) => r.name)).toEqual([
      "Kim",
      "Zoe",
    ]);
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

describe("searchAttendees sorted by recently updated", () => {
  const updated = (name: string, iso: string | null) =>
    attendee({
      name,
      profileUpdatedAt: iso === null ? null : new Date(iso),
    });

  it("puts the most recently updated profile first", () => {
    const rows = [
      updated("Older", "2026-01-01T00:00:00Z"),
      updated("Newest", "2026-03-01T00:00:00Z"),
      updated("Middle", "2026-02-01T00:00:00Z"),
    ];

    const result = searchAttendees(rows, "", "updated");
    expect(result.map((r) => r.name)).toEqual(["Newest", "Middle", "Older"]);
  });

  it("sorts profiles never updated last, among themselves by name", () => {
    const rows = [
      updated("Zoe", null),
      updated("Anna", null),
      updated("Updated", "2026-01-01T00:00:00Z"),
    ];

    const result = searchAttendees(rows, "", "updated");
    expect(result.map((r) => r.name)).toEqual(["Updated", "Anna", "Zoe"]);
  });

  it("keeps relevance ranking while a query is active", () => {
    const rows = [
      attendee({
        name: "Foodie",
        aboutMe: "I adore Italian food",
        profileUpdatedAt: new Date("2026-03-01T00:00:00Z"),
      }),
      attendee({
        name: "Speaker",
        languages: ["Italian"],
        profileUpdatedAt: new Date("2026-01-01T00:00:00Z"),
      }),
    ];

    const result = searchAttendees(rows, "Italian", "updated");
    expect(result.map((r) => r.name)).toEqual(["Speaker", "Foodie"]);
  });
});
