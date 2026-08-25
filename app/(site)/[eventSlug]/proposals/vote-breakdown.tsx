"use client";

import { useContext, useId } from "react";

import { EventContext } from "@/app/(site)/context";
import {
  VOTE_CHOICES,
  VoteChoice,
  voteChoiceToEmoji,
  voteChoiceToLabel,
} from "@/app/(site)/votes";
import type { SessionProposal } from "@/db/repositories/interfaces";
import {
  MIN_TURNOUT_PCT_FOR_ESTIMATE,
  proposalVoteStats,
  type AttendanceRange,
  type EventInterestSummary,
} from "@/utils/proposal-vote-stats";

function pct(value: number | null): string {
  return value === null ? "" : ` (${value}%)`;
}

function pctOfVotes(value: number | null): string {
  return value === null ? "" : ` (${value}% of votes)`;
}

function people(range: AttendanceRange): string {
  if (range.low === range.high) {
    return `${range.low} ${range.low === 1 ? "person" : "people"}`;
  }
  return `${range.low}–${range.high} people`;
}

function Estimate({ range }: { range: AttendanceRange }) {
  return (
    <p className="mt-2 text-fg-subtle">
      If you decide to host this as a session, expect{" "}
      <span className="font-medium text-fg-muted">{people(range)}</span>. Treat
      that as a very rough guess: it comes from a formula worked out on a single
      event, from what a handful of hosts there remembered about how many people
      turned up. It can be well out in either direction — use it to pick a room,
      nothing more. Future SchellingBoard versions should do better, as we
      incorporate more event feedback.
    </p>
  );
}

export function VoteBreakdown({
  proposal,
  eventInterest,
}: {
  proposal: SessionProposal;
  eventInterest: EventInterestSummary;
}) {
  const { guests } = useContext(EventContext);
  const headingId = useId();

  const stats = proposalVoteStats({
    attendees: guests.length,
    eventInterest,
    interested: proposal.interestedVotesCount,
    maybe: proposal.maybeVotesCount,
    skip: proposal.skipVotesCount,
  });

  const perChoice: Record<
    VoteChoice,
    { count: number; pctOfVotes: number | null }
  > = {
    [VoteChoice.interested]: {
      count: stats.interested,
      pctOfVotes: stats.interestedPctOfVotes,
    },
    [VoteChoice.maybe]: {
      count: stats.maybe,
      pctOfVotes: stats.maybePctOfVotes,
    },
    [VoteChoice.skip]: {
      count: stats.skip,
      pctOfVotes: stats.skipPctOfVotes,
    },
  };

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-md border border-line-subtle bg-surface-sunken px-3 py-2 text-sm text-fg-muted"
    >
      <h3 id={headingId} className="font-medium text-fg">
        Vote breakdown
      </h3>
      <ul className="mt-2 space-y-1">
        <li>
          Votes: {stats.votes} of {stats.attendees} attendees
          {pct(stats.votesPctOfAttendees)}
        </li>
        <li>
          Did not vote: {stats.nonVoters} attendees
          {pct(stats.nonVotersPctOfAttendees)}
        </li>
        {VOTE_CHOICES.map((choice) => (
          <li key={choice}>
            {voteChoiceToEmoji(choice)} {voteChoiceToLabel(choice)}:{" "}
            {perChoice[choice].count}
            {pctOfVotes(perChoice[choice].pctOfVotes)}
          </li>
        ))}
      </ul>
      {stats.estimatedAttendance && (
        <Estimate range={stats.estimatedAttendance} />
      )}
      {stats.noEstimateReason === "low-turnout" && (
        <p className="mt-2 text-fg-subtle">
          Too few attendees voted to guess at attendance — fewer than{" "}
          {MIN_TURNOUT_PCT_FOR_ESTIMATE}% of them did, so a couple of votes
          either way would decide the number.
        </p>
      )}
      {stats.noEstimateReason === "no-interest" && (
        <p className="mt-2 text-fg-subtle">
          Nobody voted {voteChoiceToEmoji(VoteChoice.interested)}{" "}
          {voteChoiceToLabel(VoteChoice.interested)}, and that is the only
          signal there is to guess attendance from.
        </p>
      )}
      {stats.noEstimateReason === "unknown-event" && (
        <p className="mt-2 text-fg-subtle">
          There is nothing to measure this against yet — guessing at attendance
          needs the event&apos;s attendee list and{" "}
          {voteChoiceToEmoji(VoteChoice.interested)} votes on its other
          proposals.
        </p>
      )}
    </section>
  );
}
