import { describe, it, expect } from "vitest";

import type { Attendee } from "@/db/repositories/interfaces";
import { hasFilledProfile, profileExcerpt } from "@/utils/attendee-profile";

let counter = 0;

function attendee(overrides: Partial<Attendee> & { name: string }): Attendee {
  return {
    id: `id-${++counter}`,
    isHost: false,
    info: undefined,
    ...overrides,
  };
}

describe("hasFilledProfile", () => {
  it("is false for a guest who only has what the importer writes", () => {
    expect(hasFilledProfile(attendee({ name: "Imported Person" }))).toBe(false);
  });

  it("is true for any single self-entered field", () => {
    const filled = [
      { aboutMe: "Hello" },
      { pronouns: "she/her" },
      { basedIn: "Lisbon" },
      { avatarUrl: "/media/avatars/x.webp" },
      { languages: ["Portuguese"] },
      { prompts: [{ prompt: "Ask me about", answer: "Boats" }] },
      { contacts: [{ type: "website" as const, value: "https://x.example" }] },
    ];

    for (const fields of filled) {
      expect(hasFilledProfile(attendee({ name: "A", ...fields }))).toBe(true);
    }
  });

  it("ignores fields that are present but say nothing", () => {
    const empty = attendee({
      name: "Blank",
      aboutMe: "   ",
      pronouns: "",
      basedIn: null,
      languages: [],
      prompts: [],
      contacts: [],
    });

    expect(hasFilledProfile(empty)).toBe(false);
  });

  it("does not count a prompt the guest left unanswered", () => {
    const unanswered = attendee({
      name: "Skipped",
      prompts: [{ prompt: "Ask me about", answer: "" }],
    });

    expect(hasFilledProfile(unanswered)).toBe(false);
  });
});

describe("profileExcerpt", () => {
  it("renders the bio as plain text", () => {
    const excerpt = profileExcerpt(
      attendee({
        name: "Alice",
        aboutMe: "I love **accessibility** and [design](https://d.example).",
      })
    );

    expect(excerpt).toBe("I love accessibility and design.");
  });

  it("falls back to the first answered prompt so a filled profile shows something", () => {
    const excerpt = profileExcerpt(
      attendee({
        name: "Quiet",
        prompts: [
          { prompt: "Ask me about", answer: "" },
          { prompt: "Offering", answer: "Sourdough starter **tips**" },
        ],
      })
    );

    expect(excerpt).toBe("Offering — Sourdough starter tips");
  });

  it("is null when there is nothing to excerpt", () => {
    expect(profileExcerpt(attendee({ name: "Blank", basedIn: "Lisbon" }))).toBe(
      null
    );
  });

  it("truncates a long bio, since only two lines are ever shown", () => {
    const excerpt = profileExcerpt(
      attendee({ name: "Verbose", aboutMe: "word ".repeat(200) })
    );

    expect(excerpt!.length).toBeLessThan(400);
  });
});
