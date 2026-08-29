"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import type { Comment } from "@/db/repositories/interfaces";
import { createProposalComment } from "../comment-actions";
import { type CommentCreateInput, CommentsSection } from "../comments-section";

export function ProposalComments({
  proposalId,
  eventSlug,
  timezone,
  comments,
}: {
  proposalId: string;
  eventSlug: string;
  timezone: string;
  comments: Comment[];
}) {
  const router = useRouter();
  const changed = useCallback(() => router.refresh(), [router]);
  const create = useCallback(
    (input: CommentCreateInput) =>
      createProposalComment({ proposalId, eventSlug, ...input }),
    [proposalId, eventSlug]
  );
  const permalinkFor = useCallback(
    (commentId: string) =>
      `/${eventSlug}/proposals?viewProposal=${proposalId}#comment-${commentId}`,
    [eventSlug, proposalId]
  );

  return (
    <CommentsSection
      eventSlug={eventSlug}
      timezone={timezone}
      comments={comments}
      create={create}
      permalinkFor={permalinkFor}
      changed={changed}
    />
  );
}
