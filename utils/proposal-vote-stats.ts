/**
 * Attendance prediction from voting results, per the model fitted in
 * `docs/dev/attendance-model/` on a 2025 unconference (259 attendees, 13
 * sessions with reported attendance). Read the write-up there before touching
 * the constants — the correlation is not statistically significant at that
 * sample size, which is why this predicts a range and never a number.
 *
 *     midpoint = K × (attendees / parallel sessions) × (s / s̄)
 *     range    = midpoint / g … midpoint × g,  g = exp(Z_50 · σ)
 *     σ        = sqrt(INTRINSIC_LOG_VARIANCE + (1 − s) / (s · votes))
 *
 * `s` is the Interested share of a proposal's votes and `s̄` the event-wide
 * share, so the midpoint is invariant to turnout; turnout only widens the
 * range. Maybe votes are deliberately ignored: every non-zero weight on them
 * made predictions worse.
 */

/** Share of attendees sitting in *any* session at a given moment. */
const IN_SESSION_SHARE = 0.66;

/** Log-variance of attendance the vote cannot explain. The error floor. */
const INTRINSIC_LOG_VARIANCE = 0.3134;

/**
 * Sessions running at the same time. Fixed at the 2025 event's figure until
 * organizers can set it themselves: the event's locations would be the obvious
 * source, but they include places nobody holds a session in — a park bench, a
 * room booked for volunteer shifts — which would split the crowd too many ways.
 */
const PARALLEL_SESSIONS = 9;

/**
 * Half of sessions land inside the range this widens the midpoint to. The
 * model's write-up also offers a wider range to size rooms by, but pointing
 * every host at a bigger room just moves the shortage to the room list.
 */
const Z_50 = 0.674;

export type EventInterestSummary = {
  /** s̄ — Interested share across all of the event's votes; 0 if none drew any. */
  meanInterestShare: number;
  proposalCount: number;
};

export type ProposalVoteStatsInput = {
  attendees: number;
  eventInterest: EventInterestSummary;
  interested: number;
  maybe: number;
  skip: number;
};

/** The 50% range: half of sessions land inside it. */
export type AttendanceRange = {
  low: number;
  high: number;
};

export type NoEstimateReason = "low-turnout" | "no-interest" | "unknown-event";

export type ProposalVoteStats = {
  attendees: number;
  interested: number;
  maybe: number;
  skip: number;
  votes: number;
  votesPctOfAttendees: number | null;
  nonVoters: number;
  nonVotersPctOfAttendees: number | null;
  interestedPctOfVotes: number | null;
  maybePctOfVotes: number | null;
  skipPctOfVotes: number | null;
  estimatedAttendance: AttendanceRange | null;
  /** Why there is no estimate; null when there is one. */
  noEstimateReason: NoEstimateReason | null;
};

/**
 * Below this share of attendees having voted, a handful of votes would decide
 * the guess. The model widens the range on its own as turnout falls, but it
 * assumes voters are a fair sample of attendees, and a handful of them are not.
 */
export const MIN_TURNOUT_PCT_FOR_ESTIMATE = 10;

/** What the model needs from the event as a whole, not from one proposal. */
export function eventInterestSummary(
  proposals: { interestedVotesCount: number; votesCount: number }[]
): EventInterestSummary {
  const votes = proposals.reduce((sum, p) => sum + p.votesCount, 0);
  const interested = proposals.reduce(
    (sum, p) => sum + p.interestedVotesCount,
    0
  );

  return {
    // Pooled over the event's votes rather than averaged over its proposals.
    // The two agree on the data the model was fitted to, where every session
    // drew ~100 votes, but here a proposal with a single Interested vote is a
    // 100% share: unweighted it would drag s̄ up and deflate every other
    // proposal's estimate.
    meanInterestShare: votes > 0 ? interested / votes : 0,
    proposalCount: proposals.length,
  };
}

export function estimateAttendanceRange(input: {
  attendees: number;
  eventInterest: EventInterestSummary;
  interested: number;
  votes: number;
}): AttendanceRange {
  const { attendees, eventInterest, interested, votes } = input;
  // An event with fewer ideas than PARALLEL_SESSIONS cannot fill that many
  // rooms, so its crowd splits fewer ways than the 2025 event's did.
  const parallel = Math.max(
    1,
    Math.min(
      PARALLEL_SESSIONS,
      eventInterest.proposalCount || PARALLEL_SESSIONS
    )
  );
  const share = interested / votes;
  const midpoint =
    IN_SESSION_SHARE *
    (attendees / parallel) *
    (share / eventInterest.meanInterestShare);
  const sigma = Math.sqrt(
    INTRINSIC_LOG_VARIANCE + (1 - share) / (share * votes)
  );
  // Nobody can turn up who isn't at the event, however wide the range. One
  // person is the floor rather than zero: somebody voted Interested, and
  // "expect 0 people" reads as a verdict on the proposal rather than as the
  // rounding of a number below a half.
  const cap = (n: number) => Math.min(attendees, Math.max(1, Math.round(n)));

  return {
    low: cap(midpoint / Math.exp(Z_50 * sigma)),
    high: cap(midpoint * Math.exp(Z_50 * sigma)),
  };
}

function percentage(part: number, whole: number): number | null {
  if (whole <= 0) return null;
  return Math.round((part / whole) * 100);
}

function noEstimateReason(
  input: ProposalVoteStatsInput,
  votes: number
): NoEstimateReason | null {
  const { attendees, eventInterest, interested } = input;
  if (attendees <= 0 || eventInterest.meanInterestShare <= 0) {
    return "unknown-event";
  }
  // Against the exact turnout, not the rounded percentage shown, so a
  // displayed "10%" that is really 9.5% doesn't sneak past the threshold.
  if ((votes / attendees) * 100 < MIN_TURNOUT_PCT_FOR_ESTIMATE) {
    return "low-turnout";
  }
  // The model runs off the Interested share; at zero it predicts nobody, with
  // an infinitely wide range around it.
  if (interested <= 0) return "no-interest";
  return null;
}

export function proposalVoteStats(
  input: ProposalVoteStatsInput
): ProposalVoteStats {
  const { attendees, interested, maybe, skip } = input;
  const votes = interested + maybe + skip;
  // Votes can outnumber attendees when a guest voted and was later removed
  // from the event.
  const nonVoters = Math.max(0, attendees - votes);
  const votesPct = percentage(votes, attendees);
  const reason = noEstimateReason(input, votes);

  return {
    attendees,
    interested,
    maybe,
    skip,
    votes,
    votesPctOfAttendees: votesPct,
    nonVoters,
    // Derived from the turnout rather than rounded on its own, so the two
    // shares always add up to 100% on screen.
    nonVotersPctOfAttendees:
      votesPct === null ? null : Math.max(0, 100 - votesPct),
    interestedPctOfVotes: percentage(interested, votes),
    maybePctOfVotes: percentage(maybe, votes),
    skipPctOfVotes: percentage(skip, votes),
    estimatedAttendance:
      reason === null ? estimateAttendanceRange({ ...input, votes }) : null,
    noEstimateReason: reason,
  };
}
