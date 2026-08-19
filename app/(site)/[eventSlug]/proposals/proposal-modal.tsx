"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import type {
  Comment,
  Event,
  Session,
  SessionProposal,
} from "@/db/repositories/interfaces";
import { dismissViewProposal } from "../modal-nav";
import { ViewProposal } from "./view-proposal";
import type { EventInterestSummary } from "@/utils/proposal-vote-stats";

export function ProposalModal({
  proposal,
  sessions,
  comments,
  eventSlug,
  event,
  eventInterest,
}: {
  proposal?: SessionProposal;
  sessions: Session[];
  comments: Comment[];
  eventSlug: string;
  event: Event;
  eventInterest: EventInterestSummary;
}) {
  const router = useRouter();
  const onDismiss = useCallback(() => {
    dismissViewProposal(router);
  }, [router]);

  // Duplication, anchor: waggHhba
  useEffect(() => {
    // Disable page scroll when modal is open.
    document.documentElement.style.overflow = "hidden";
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Proposal details"
    >
      <div className="fixed inset-0 bg-overlay" onClick={onDismiss} />
      <div className="relative bg-surface-raised rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-fg-subtle hover:text-fg-muted"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {!proposal ? (
          <div className="p-6">Proposal not found.</div>
        ) : (
          <ViewProposal
            proposal={proposal}
            sessions={sessions}
            comments={comments}
            eventSlug={eventSlug}
            event={event}
            eventInterest={eventInterest}
            isInModal={true}
          />
        )}
      </div>
    </div>
  );
}
