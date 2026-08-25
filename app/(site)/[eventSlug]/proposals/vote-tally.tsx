import clsx from "clsx";

import {
  VoteChoice,
  voteChoiceToEmoji,
  voteChoiceToLabel,
  voteCount,
  type ProposalVoteCounts,
} from "@/app/(site)/votes";

// Skip votes are left out on purpose: this is the public tally, and it reads as
// interest in a proposal rather than as a scoreboard for it. The full split is
// the host's to see, in the vote breakdown.
const TALLIED = [VoteChoice.interested, VoteChoice.maybe] as const;

export function VoteTally({
  proposal,
  className,
}: {
  proposal: ProposalVoteCounts;
  className?: string;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      {TALLIED.map((choice) => {
        const count = voteCount(proposal, choice);
        const label = voteChoiceToLabel(choice).toLowerCase();
        return (
          <span
            key={choice}
            title={`${count} ${label} vote${count !== 1 ? "s" : ""}`}
            className="inline-flex items-center gap-1 text-sm text-fg-subtle"
          >
            {voteChoiceToEmoji(choice)}&nbsp;{count}
          </span>
        );
      })}
    </span>
  );
}
