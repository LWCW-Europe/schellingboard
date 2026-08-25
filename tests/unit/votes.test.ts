import { describe, it, expect } from "vitest";
import {
  voteChoiceToEmoji,
  voteChoiceToLabel,
  voteChoiceRank,
  voteCount,
  VOTE_CHOICES,
  VoteChoice,
} from "@/app/(site)/votes";

describe("voteChoiceToEmoji", () => {
  it("interested → ❤️", () =>
    expect(voteChoiceToEmoji(VoteChoice.interested)).toBe("❤️"));

  it("maybe → ⭐", () =>
    expect(voteChoiceToEmoji(VoteChoice.maybe)).toBe("⭐"));

  it("skip → 👋🏽", () => expect(voteChoiceToEmoji(VoteChoice.skip)).toBe("👋🏽"));
});

describe("voteChoiceToLabel", () => {
  it("interested → Interested", () =>
    expect(voteChoiceToLabel(VoteChoice.interested)).toBe("Interested"));

  it("maybe → Maybe", () =>
    expect(voteChoiceToLabel(VoteChoice.maybe)).toBe("Maybe"));

  it("skip → Skip", () =>
    expect(voteChoiceToLabel(VoteChoice.skip)).toBe("Skip"));
});

describe("VOTE_CHOICES", () => {
  // A choice missing here would silently lose its vote button and its place in
  // the "Your vote" sort order.
  it("covers every VoteChoice", () =>
    expect([...VOTE_CHOICES].sort()).toEqual(Object.values(VoteChoice).sort()));
});

describe("voteCount", () => {
  const counts = {
    interestedVotesCount: 3,
    maybeVotesCount: 2,
    skipVotesCount: 1,
  };

  // Reading the wrong field would show a plausible number, so nothing else
  // would notice.
  it("reads each choice's own count", () =>
    expect(VOTE_CHOICES.map((choice) => voteCount(counts, choice))).toEqual([
      3, 2, 1,
    ]));
});

describe("voteChoiceRank", () => {
  it("ranks the choices in VOTE_CHOICES order", () =>
    expect(VOTE_CHOICES.map(voteChoiceRank)).toEqual([0, 1, 2]));

  it("ranks no vote after every choice", () =>
    expect(voteChoiceRank(undefined)).toBe(VOTE_CHOICES.length));
});
