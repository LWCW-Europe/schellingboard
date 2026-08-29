"use client";

import { useContext } from "react";
import Link from "next/link";
import {
  PlusIcon,
  ChartBarIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import HoverTooltip from "@/app/(site)/hover-tooltip";
import {
  inVotingPhase,
  inSchedPhase,
  dateStartDescription,
  inProposalPhase,
} from "@/app/(site)/utils/events";
import { EventContext, UserContext } from "@/app/(site)/context";
import { useLocalZone } from "@/utils/hooks";
import type { Event } from "@/db/repositories/interfaces";

export function ProposalActionBar({
  eventSlug,
  event,
}: {
  eventSlug: string;
  event: Event;
}) {
  const { user: currentUserId } = useContext(UserContext);
  const { now } = useContext(EventContext);
  const localZone = useLocalZone();
  const votingEnabled = !!currentUserId && inVotingPhase(event, now);

  // A proposal is attributed to its hosts, so it can't be created anonymously.
  const proposingEnabled = !!currentUserId && !inSchedPhase(event, now);
  const proposingDisabledText = inSchedPhase(event, now)
    ? "Proposal and voting phases are over"
    : "Select a user first";

  let votingDisabledText = "";
  if (inSchedPhase(event, now)) {
    votingDisabledText = `The voting phase is over`;
  } else if (inProposalPhase(event, now)) {
    votingDisabledText = `Voting ${dateStartDescription(event.votingPhaseStart, event.timezone, localZone)}`;
  } else if (!currentUserId) {
    votingDisabledText = "Select a user first";
  }

  const schedEnabled = inSchedPhase(event, now);
  const schedDisabledText = `Scheduling ${dateStartDescription(event.schedulingPhaseStart, event.timezone, localZone)}`;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
      <HoverTooltip
        text={proposingDisabledText}
        visible={!proposingEnabled}
        unavailable
      >
        <Link
          href={proposingEnabled ? `/${eventSlug}/proposals/new` : "#"}
          className={`bg-brand hover:bg-brand-hover transition-colors text-on-brand px-4 py-2 rounded-md flex items-center gap-2 ${
            proposingEnabled ? "" : "opacity-50 cursor-not-allowed"
          }`}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Proposal</span>
        </Link>
      </HoverTooltip>
      <HoverTooltip
        text={votingDisabledText}
        visible={!votingEnabled}
        unavailable
      >
        <Link
          href={votingEnabled ? `/${eventSlug}/proposals/quick-voting` : "#"}
          className={`bg-brand hover:bg-brand-hover transition-colors text-on-brand px-4 py-2 rounded-md flex items-center gap-2 ${
            votingEnabled ? "" : "opacity-50 cursor-not-allowed"
          }`}
        >
          <ChartBarIcon className="h-5 w-5" />
          <span>Go to Quick Voting!</span>
        </Link>
      </HoverTooltip>
      <HoverTooltip
        text={schedDisabledText}
        visible={!schedEnabled}
        unavailable
      >
        <Link
          href={schedEnabled ? `/${eventSlug}` : "#"}
          className={`bg-brand hover:bg-brand-hover transition-colors text-on-brand px-4 py-2 rounded-md flex items-center gap-2 ${
            schedEnabled ? "" : "opacity-50 cursor-not-allowed"
          }`}
        >
          <CalendarDaysIcon className="h-5 w-5" />
          <span>View Schedule</span>
        </Link>
      </HoverTooltip>
    </div>
  );
}
