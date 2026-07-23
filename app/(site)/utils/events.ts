import type { Event } from "@/db/repositories/interfaces";

/**
 * Represents the different phases an event can be in
 */
export enum EventPhase {
  PROPOSAL = "proposal",
  VOTING = "voting",
  SCHEDULING = "scheduling",
  INACTIVE = "inactive",
}

/**
 * Checks if the current time falls within a date period.
 *
 * The interval is half-open `[start, end)`: the end is exclusive so that
 * touching phases (where one phase's implicit end equals the next phase's
 * start) hand over cleanly at the boundary instead of overlapping for one
 * instant.
 *
 * @param now - The effective current time (see docs/adr/0004-dev-fake-clock.md)
 * @param start - The start date of the period
 * @param end - The end date of the period (optional, defaults to no end limit)
 * @returns true if current time is within the period
 */
function inDatePeriod(now: Date, start: Date, end?: Date): boolean {
  const nowMs = now.getTime();
  const afterStart = nowMs >= start.getTime();
  const beforeEnd = !end || nowMs < end.getTime();
  return afterStart && beforeEnd;
}

/**
 * Checks if an event is currently in the proposal phase.
 *
 * A phase without an explicit end is treated as ending when the next
 * configured phase starts, so an open-ended proposal phase does not mask
 * voting/scheduling. An explicit end set before the next phase start creates
 * an intentional inactive gap.
 *
 * @param event - The event to check
 * @param now - The effective current time (see docs/adr/0004-dev-fake-clock.md)
 * @returns true if the event is in the proposal phase
 */
export function inProposalPhase(event: Event, now: Date): boolean {
  const {
    proposalPhaseStart,
    proposalPhaseEnd,
    votingPhaseStart,
    schedulingPhaseStart,
  } = event;
  const effectiveEnd =
    proposalPhaseEnd ?? votingPhaseStart ?? schedulingPhaseStart;
  return !!(
    proposalPhaseStart && inDatePeriod(now, proposalPhaseStart, effectiveEnd)
  );
}

/**
 * Checks if an event is currently in the voting phase.
 *
 * An open-ended voting phase is treated as ending when scheduling starts.
 *
 * @param event - The event to check
 * @param now - The effective current time (see docs/adr/0004-dev-fake-clock.md)
 * @returns true if the event is in the voting phase
 */
export function inVotingPhase(event: Event, now: Date): boolean {
  const { votingPhaseStart, votingPhaseEnd, schedulingPhaseStart } = event;
  const effectiveEnd = votingPhaseEnd ?? schedulingPhaseStart;
  return !!(
    votingPhaseStart && inDatePeriod(now, votingPhaseStart, effectiveEnd)
  );
}

/**
 * Checks if an event is currently in the scheduling phase
 * @param event - The event to check
 * @param now - The effective current time (see docs/adr/0004-dev-fake-clock.md)
 * @returns true if the event is in the scheduling phase
 */
export function inSchedPhase(event: Event, now: Date): boolean {
  const { schedulingPhaseStart, schedulingPhaseEnd } = event;

  // If no phases are configured, assume scheduling is always active
  if (!hasPhases(event)) {
    return true;
  }

  return !!(
    schedulingPhaseStart &&
    inDatePeriod(now, schedulingPhaseStart, schedulingPhaseEnd)
  );
}

/**
 * Gets the current phase of an event
 * @param event - The event to check
 * @param now - The effective current time (see docs/adr/0004-dev-fake-clock.md)
 * @returns The current phase of the event
 */
export function getCurrentPhase(event: Event, now: Date): EventPhase {
  if (inProposalPhase(event, now)) return EventPhase.PROPOSAL;
  if (inVotingPhase(event, now)) return EventPhase.VOTING;
  if (inSchedPhase(event, now)) return EventPhase.SCHEDULING;
  return EventPhase.INACTIVE;
}

/**
 * Checks if an event has any phases configured
 * @param event - The event to check
 * @returns true if the event has at least one phase configured
 */
export function hasPhases(event: Event): boolean {
  const { proposalPhaseStart, votingPhaseStart, schedulingPhaseStart } = event;

  return !!(proposalPhaseStart || votingPhaseStart || schedulingPhaseStart);
}

export function dateStartDescription(date?: Date): string {
  if (date) {
    const dateText = date.toLocaleString("en-GB", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return "will be enabled on " + dateText;
  } else {
    return "is not enabled";
  }
}
