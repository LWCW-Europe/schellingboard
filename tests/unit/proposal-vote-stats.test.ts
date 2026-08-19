import { describe, it, expect } from "vitest";
import {
  eventInterestSummary,
  estimateAttendanceRange,
  proposalVoteStats,
} from "@/utils/proposal-vote-stats";

// The 2025 event the model was fitted on: 259 attendees, 9 parallel sessions,
// mean interest share 27%. See docs/dev/attendance-model/attendance-2025.md.
const EVENT_2025 = {
  attendees: 259,
  eventInterest: { meanInterestShare: 0.27, proposalCount: 40 },
};

describe("eventInterestSummary", () => {
  it("pools the interest share over the proposals that got votes", () => {
    const summary = eventInterestSummary([
      { interestedVotesCount: 5, votesCount: 10 },
      { interestedVotesCount: 1, votesCount: 10 },
      { interestedVotesCount: 0, votesCount: 0 },
    ]);

    expect(summary.meanInterestShare).toBeCloseTo(0.3, 10);
    expect(summary.proposalCount).toBe(3);
  });

  it("is not swung by a proposal hardly anyone voted on", () => {
    const wellVoted = Array.from({ length: 9 }, () => ({
      interestedVotesCount: 30,
      votesCount: 100,
    }));

    // A lone Interested vote is a 100% share, and unweighted it would drag the
    // event mean up by a fifth -- deflating every other proposal's estimate.
    expect(
      eventInterestSummary([
        ...wellVoted,
        { interestedVotesCount: 1, votesCount: 1 },
      ]).meanInterestShare
    ).toBeCloseTo(eventInterestSummary(wellVoted).meanInterestShare, 2);
  });

  it("reports a zero mean share when nobody voted Interested anywhere", () => {
    const summary = eventInterestSummary([
      { interestedVotesCount: 0, votesCount: 4 },
    ]);

    expect(summary.meanInterestShare).toBe(0);
  });
});

describe("estimateAttendanceRange", () => {
  it("reproduces the published 2025 prediction", () => {
    expect(
      estimateAttendanceRange({ ...EVENT_2025, interested: 28, votes: 103 })
    ).toEqual({ low: 13, high: 28 });
  });

  it("scales with the interest share relative to the event's average", () => {
    expect(
      estimateAttendanceRange({ ...EVENT_2025, interested: 57, votes: 107 })
    ).toEqual({ low: 26, high: 55 });
  });

  it("widens the range when fewer people voted, without shifting it", () => {
    const few = estimateAttendanceRange({
      ...EVENT_2025,
      interested: 7,
      votes: 26,
    });
    const many = estimateAttendanceRange({
      ...EVENT_2025,
      interested: 26,
      votes: 104,
    });

    // Same share, so the same expectation -- only the confidence in it.
    expect(few.low).toBeLessThanOrEqual(many.low);
    expect(few.high).toBeGreaterThan(many.high);
  });

  it("never predicts nobody at all, since somebody was interested", () => {
    const range = estimateAttendanceRange({
      attendees: 25,
      eventInterest: { meanInterestShare: 0.3, proposalCount: 12 },
      interested: 1,
      votes: 10,
    });

    expect(range.low).toBe(1);
  });

  it("never predicts more people than the event has", () => {
    const range = estimateAttendanceRange({
      attendees: 20,
      eventInterest: { meanInterestShare: 0.1, proposalCount: 1 },
      interested: 9,
      votes: 10,
    });

    expect(range).toEqual({ low: 20, high: 20 });
  });

  it("splits the crowd no more ways than the event has proposals", () => {
    const shared = {
      attendees: 60,
      interested: 15,
      votes: 30,
    };
    const few = estimateAttendanceRange({
      ...shared,
      eventInterest: { meanInterestShare: 0.5, proposalCount: 3 },
    });
    const many = estimateAttendanceRange({
      ...shared,
      eventInterest: { meanInterestShare: 0.5, proposalCount: 30 },
    });

    expect(few.low).toBeGreaterThan(many.low);
    expect(few.high).toBeGreaterThan(many.high);
  });
});

describe("proposalVoteStats", () => {
  const input = {
    ...EVENT_2025,
    attendees: 20,
    interested: 6,
    maybe: 3,
    skip: 1,
  };

  it("relates votes to attendees and each choice to the votes cast", () => {
    const stats = proposalVoteStats(input);

    expect(stats.votes).toBe(10);
    expect(stats.votesPctOfAttendees).toBe(50);
    expect(stats.nonVoters).toBe(10);
    expect(stats.nonVotersPctOfAttendees).toBe(50);
    expect(stats.interestedPctOfVotes).toBe(60);
    expect(stats.maybePctOfVotes).toBe(30);
    expect(stats.skipPctOfVotes).toBe(10);
    expect(stats.estimatedAttendance).not.toBeNull();
    expect(stats.noEstimateReason).toBeNull();
  });

  it("makes no guess when too few attendees voted to tell", () => {
    const stats = proposalVoteStats({
      ...input,
      attendees: 100,
      interested: 9,
      maybe: 0,
      skip: 0,
    });

    expect(stats.estimatedAttendance).toBeNull();
    expect(stats.noEstimateReason).toBe("low-turnout");
  });

  it("guesses once turnout reaches the threshold", () => {
    const stats = proposalVoteStats({
      ...input,
      attendees: 100,
      interested: 10,
      maybe: 0,
      skip: 0,
    });

    expect(stats.estimatedAttendance).not.toBeNull();
  });

  it("makes no guess when nobody was interested", () => {
    const stats = proposalVoteStats({ ...input, interested: 0, skip: 7 });

    expect(stats.estimatedAttendance).toBeNull();
    expect(stats.noEstimateReason).toBe("no-interest");
  });

  it("makes no guess without attendees to compare the votes against", () => {
    const stats = proposalVoteStats({ ...input, attendees: 0 });

    expect(stats.estimatedAttendance).toBeNull();
    expect(stats.noEstimateReason).toBe("unknown-event");
  });

  it("makes no guess when no proposal at the event drew interest", () => {
    const stats = proposalVoteStats({
      ...input,
      eventInterest: { meanInterestShare: 0, proposalCount: 3 },
    });

    expect(stats.noEstimateReason).toBe("unknown-event");
  });

  it("has no percentages to report without attendees or votes", () => {
    const stats = proposalVoteStats({
      ...input,
      attendees: 0,
      interested: 0,
      maybe: 0,
      skip: 0,
    });

    expect(stats.votesPctOfAttendees).toBeNull();
    expect(stats.nonVotersPctOfAttendees).toBeNull();
    expect(stats.interestedPctOfVotes).toBeNull();
  });

  it("never reports negative non-voters when more votes than attendees", () => {
    const stats = proposalVoteStats({
      ...input,
      attendees: 2,
      interested: 3,
      maybe: 0,
      skip: 0,
    });

    expect(stats.nonVoters).toBe(0);
    expect(stats.nonVotersPctOfAttendees).toBe(0);
  });
});
