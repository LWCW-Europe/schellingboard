"use client";

import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PencilIcon, CalendarIcon } from "@heroicons/react/24/outline";

import {
  inVotingPhase,
  inSchedPhase,
  dateStartDescription,
} from "@/app/(site)/utils/events";
import HoverTooltip from "@/app/(site)/hover-tooltip";
import { EventContext, UserContext, VotesContext } from "@/app/(site)/context";
import { Proposal } from "@/app/(site)/[eventSlug]/proposal";
import type {
  Comment,
  Event,
  SessionProposal,
  Session,
} from "@/db/repositories/interfaces";
import { ProposalComments } from "./proposal-comments";
import { VotingButtons } from "@/app/(site)/[eventSlug]/proposals/voting-buttons";
import { VoteBreakdown } from "./vote-breakdown";
import { VoteTally } from "./vote-tally";
import type { EventInterestSummary } from "@/utils/proposal-vote-stats";
import { useLocalZone } from "@/utils/hooks";
import { formatOptionalTime, TIME_FORMAT } from "@/utils/utils";
import { viewSessionLinkFromElsewhere } from "../modal-nav";

export function ViewProposal(props: {
  proposal: SessionProposal;
  sessions: Session[];
  comments: Comment[];
  eventSlug: string;
  event: Event;
  eventInterest: EventInterestSummary;
  isInModal?: boolean;
}) {
  const {
    proposal,
    eventSlug,
    event,
    eventInterest,
    sessions: allSessions,
    comments,
    isInModal = false,
  } = props;
  const { user: currentUserId } = useContext(UserContext);
  const { proposalVoteEmoji, proposalVoteLabel } = useContext(VotesContext);
  const { now } = useContext(EventContext);
  const localZone = useLocalZone();
  const router = useRouter();

  const canEdit = () => {
    if (proposal.hosts.length === 0) {
      return true;
    } else {
      return (
        currentUserId && proposal.hosts.some((h) => h.id === currentUserId)
      );
    }
  };

  const isHost = () => {
    return currentUserId && proposal.hosts.some((h) => h.id === currentUserId);
  };

  // How a proposal fared is the hosts' business; a proposal nobody has taken
  // on is everyone's, since anyone may still pick it up.
  const canSeeVoteBreakdown = canEdit();

  const handleScheduleClick = () => {
    router.push(`/${eventSlug}/add-session?proposalID=${proposal.id}`);
  };

  const votingEnabled = !!currentUserId && inVotingPhase(event, now);
  const schedEnabled = inSchedPhase(event, now);
  let votingDisabledText = "";
  if (!inVotingPhase(event, now)) {
    votingDisabledText = `Voting ${dateStartDescription(event.votingPhaseStart, event.timezone, localZone)}`;
  } else if (!currentUserId) {
    votingDisabledText = "Select a user first";
  }
  const schedDisabledText = `Scheduling ${dateStartDescription(event.schedulingPhaseStart, event.timezone, localZone)}`;

  const sessions = (proposal.sessionIds || [])
    .map((sesId) => allSessions.find((s) => s.id === sesId))
    .filter((s): s is Session => s !== undefined);

  return (
    <div
      className={`${isInModal ? "w-full p-6" : "max-w-2xl mx-auto"} pb-12 break-words overflow-hidden`}
    >
      <Proposal proposal={proposal} />

      {proposal.hosts.length === 0 && (
        <p className="mt-4 rounded-md border border-brand-tint-hover bg-brand-tint px-3 py-2 text-sm text-fg-muted">
          Nobody is offering this session yet. If you could give it, take it on:
          click Edit and add yourself as a host.
        </p>
      )}

      {canEdit() && (
        <div className="mt-6 flex gap-2 flex-wrap">
          <div className="relative inline-block group">
            <Link
              href={`/${eventSlug}/proposals/${proposal.id}/edit`}
              className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md border border-brand-accent text-brand-fg hover:bg-brand-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
            >
              <PencilIcon className="h-3 w-3 mr-1" />
              Edit
            </Link>
          </div>
          <HoverTooltip
            text={schedDisabledText}
            visible={!schedEnabled}
            unavailable
          >
            <button
              onClick={handleScheduleClick}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md border border-brand-accent text-brand-fg hover:bg-brand-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors ${
                schedEnabled ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <CalendarIcon className="h-3 w-3 mr-1" />
              Schedule
            </button>
          </HoverTooltip>
        </div>
      )}

      {/* Voting buttons section */}
      {!isHost() && !schedEnabled && (
        <div className="mt-6 flex gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
          <VotingButtons
            proposalId={proposal.id}
            votingEnabled={votingEnabled}
            votingDisabledText={votingDisabledText}
            large={true}
          />
        </div>
      )}
      {schedEnabled && (
        <div className="mt-6 space-y-3">
          {!isHost() && (
            <div className="text-sm text-fg-muted">
              Your vote:
              <span title={proposalVoteLabel(proposal.id)} className="ml-1">
                {proposalVoteEmoji(proposal.id)}
              </span>
            </div>
          )}
          {canSeeVoteBreakdown ? (
            <VoteBreakdown proposal={proposal} eventInterest={eventInterest} />
          ) : (
            <div className="text-sm text-fg-muted">
              Total votes:
              <VoteTally proposal={proposal} className="ml-2" />
            </div>
          )}
        </div>
      )}
      {schedEnabled && (
        <div className="mt-6 text-sm text-fg-muted">
          {sessions.length === 0 ? (
            <p>This proposal has not been scheduled yet.</p>
          ) : sessions.length === 1 ? (
            <p>
              This proposal was scheduled on{" "}
              <Link
                {...viewSessionLinkFromElsewhere(eventSlug, sessions[0].id)}
                className="text-brand-fg underline hover:text-brand-fg-hover transition-colors"
              >
                {formatOptionalTime(
                  sessions[0].startTime,
                  event.timezone,
                  "EEEE"
                )}{" "}
                at{" "}
                {formatOptionalTime(
                  sessions[0].startTime,
                  event.timezone,
                  TIME_FORMAT
                )}{" "}
                in {sessions[0].locations[0]?.name}
              </Link>
              .
            </p>
          ) : (
            <div>
              <p>This proposal was scheduled several times:</p>
              <ul className="mt-2 space-y-1 ml-4">
                {sessions.map((session) => (
                  <li key={session.id}>
                    <Link
                      {...viewSessionLinkFromElsewhere(eventSlug, session.id)}
                      className="text-brand-fg underline hover:text-brand-fg-hover transition-colors"
                    >
                      {formatOptionalTime(
                        session.startTime,
                        event.timezone,
                        `EEEE ${TIME_FORMAT}`
                      )}{" "}
                      in {session.locations[0]?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ProposalComments
        proposalId={proposal.id}
        eventSlug={eventSlug}
        timezone={event.timezone}
        comments={comments}
      />
    </div>
  );
}
