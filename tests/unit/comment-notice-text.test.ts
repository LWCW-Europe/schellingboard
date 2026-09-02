import { describe, it, expect } from "vitest";

import { commentNoticeText } from "@/emails/comment";

// The line a guest reads in their notification list, where the title is what
// tells one row from another.
describe("commentNoticeText", () => {
  it("names the session or proposal, whoever is being told", () => {
    const subject = { kind: "session", title: "Hallway Track" } as const;
    expect(commentNoticeText(subject, "responsible", "Rosa Diaz")).toBe(
      'Rosa Diaz commented on "Hallway Track"'
    );
    expect(commentNoticeText(subject, "commenter", "Rosa Diaz")).toBe(
      'Rosa Diaz commented on "Hallway Track"'
    );
    expect(
      commentNoticeText(
        { kind: "proposal", title: "Ask Me Anything" },
        "responsible",
        "Rosa Diaz"
      )
    ).toBe('Rosa Diaz commented on "Ask Me Anything"');
  });

  // A profile has no title, so it is said from the reader's side instead.
  it("says whose profile it was, from the reader's side", () => {
    const subject = { kind: "profile", ownerName: "Anna Kowalska" } as const;
    expect(commentNoticeText(subject, "responsible", "Rosa Diaz")).toBe(
      "Rosa Diaz commented on your profile"
    );
    expect(commentNoticeText(subject, "commenter", "Rosa Diaz")).toBe(
      "Rosa Diaz commented on Anna Kowalska's profile"
    );
  });
});
