"use client";

import type { SessionProposal } from "@/db/repositories/interfaces";
import { formatDuration, durationMinusBreak } from "@/utils/utils";
import { useBreakMinutes } from "@/app/(site)/context";

export function Proposal(props: { proposal: SessionProposal }) {
  const { proposal } = props;
  const breakMinutes = useBreakMinutes();
  return (
    <>
      <h1 className="text-xl font-semibold mb-2 mt-5">{proposal.title}</h1>
      <p className="text-lg font-medium text-gray-700 mb-4">
        {proposal.hosts.map((h) => h.name).join(", ")}
      </p>
      <p className="mb-3 whitespace-pre-line">{proposal.description}</p>
      {proposal.durationMinutes && (
        <p className="text-sm text-gray-600 mb-4">
          Duration:{" "}
          {formatDuration(
            durationMinusBreak(proposal.durationMinutes, breakMinutes),
            true
          )}
        </p>
      )}
    </>
  );
}
