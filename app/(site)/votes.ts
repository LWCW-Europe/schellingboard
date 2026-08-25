export { VoteChoice } from "@/db/repositories/interfaces";
export type { Vote } from "@/db/repositories/interfaces";

import { VoteChoice } from "@/db/repositories/interfaces";
import type { SessionProposal } from "@/db/repositories/interfaces";

// Strongest interest first: this is both the order the vote buttons appear in
// and the order the proposal list sorts by "Your vote".
export const VOTE_CHOICES = [
  VoteChoice.interested,
  VoteChoice.maybe,
  VoteChoice.skip,
] as const;

export const NO_VOTE_LABEL = "No vote";

export function voteChoiceToEmoji(choice: VoteChoice): string {
  switch (choice) {
    case VoteChoice.interested:
      return "❤️";
    case VoteChoice.maybe:
      return "⭐";
    case VoteChoice.skip:
      return "👋🏽";
  }
}

export function voteChoiceToLabel(choice: VoteChoice): string {
  switch (choice) {
    case VoteChoice.interested:
      return "Interested";
    case VoteChoice.maybe:
      return "Maybe";
    case VoteChoice.skip:
      return "Skip";
  }
}

/** Sort rank following VOTE_CHOICES, with "no vote" ranked after every vote. */
export function voteChoiceRank(choice: VoteChoice | undefined): number {
  const index = choice ? VOTE_CHOICES.indexOf(choice) : -1;
  return index < 0 ? VOTE_CHOICES.length : index;
}

export type ProposalVoteCounts = Pick<
  SessionProposal,
  "interestedVotesCount" | "maybeVotesCount" | "skipVotesCount"
>;

const COUNT_FIELD: Record<VoteChoice, keyof ProposalVoteCounts> = {
  [VoteChoice.interested]: "interestedVotesCount",
  [VoteChoice.maybe]: "maybeVotesCount",
  [VoteChoice.skip]: "skipVotesCount",
};

export function voteCount(
  counts: ProposalVoteCounts,
  choice: VoteChoice
): number {
  return counts[COUNT_FIELD[choice]];
}
