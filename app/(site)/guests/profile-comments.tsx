"use client";

import { useCallback } from "react";

import { createProfileComment } from "@/app/(site)/[eventSlug]/comment-actions";
import {
  type CommentCreateInput,
  CommentsSection,
} from "@/app/(site)/[eventSlug]/comments-section";
import { useComments } from "@/app/(site)/[eventSlug]/use-comments";

// The profile modal opens by pushing the URL locally, without an RSC
// roundtrip, so its comments can't arrive as server props: they load through
// /api/profile/[profileId]/comments instead, and every mutation reloads them.
export function ProfileComments({ profileId }: { profileId: string }) {
  const { comments, changed } = useComments(
    `/api/profile/${profileId}/comments`
  );

  const create = useCallback(
    (input: CommentCreateInput) =>
      createProfileComment({ profileId, ...input }),
    [profileId]
  );
  const permalinkFor = useCallback(
    (commentId: string) => `/guests/${profileId}#comment-${commentId}`,
    [profileId]
  );

  return (
    <CommentsSection
      // A profile spans every event, so there is no event zone to anchor the
      // timestamps to: they fall back to UTC and carry each reader's own zone
      // once that is known.
      timezone="UTC"
      comments={comments}
      create={create}
      permalinkFor={permalinkFor}
      changed={changed}
    />
  );
}
