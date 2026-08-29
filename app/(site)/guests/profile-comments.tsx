"use client";

import { useCallback, useEffect, useState } from "react";

import type { Comment } from "@/db/repositories/interfaces";
import { createProfileComment } from "@/app/(site)/[eventSlug]/comment-actions";
import {
  type CommentCreateInput,
  CommentsSection,
} from "@/app/(site)/[eventSlug]/comments-section";

type SerializedComment = Omit<Comment, "createdTime" | "editedTime"> & {
  createdTime: string;
  editedTime: string | null;
};

function withDates(comment: SerializedComment): Comment {
  return {
    ...comment,
    createdTime: new Date(comment.createdTime),
    editedTime: comment.editedTime ? new Date(comment.editedTime) : null,
  };
}

const ERROR = Symbol("loading error");

// The profile modal opens by pushing the URL locally, without an RSC
// roundtrip, so its comments can't arrive as server props: they load through
// /api/profile/[profileId]/comments instead, and every mutation reloads them.
export function ProfileComments({ profileId }: { profileId: string }) {
  // Tagged with the profile it came from, so a previous profile's comments
  // never show through while the next ones load.
  const [loaded, setLoaded] = useState<
    | {
        profileId: string;
        comments: Comment[];
      }
    | null
    | typeof ERROR
  >(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/profile/${profileId}/comments?reload=${reloadKey}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`comments request failed: ${res.status}`);
        }
        return res.json() as Promise<SerializedComment[]>;
      })
      .then((data) => {
        if (!cancelled) {
          setLoaded({ profileId, comments: data.map(withDates) });
        }
      })
      .catch(() => {
        // A failed reload keeps the thread already on screen; only a load
        // with nothing to fall back on turns into the message below.
        if (!cancelled) {
          setLoaded((prev) =>
            prev && prev !== ERROR && prev.profileId === profileId
              ? prev
              : ERROR
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [profileId, reloadKey]);

  const changed = useCallback(() => setReloadKey((k) => k + 1), []);

  const create = useCallback(
    (input: CommentCreateInput) =>
      createProfileComment({ profileId, ...input }),
    [profileId]
  );
  const permalinkFor = useCallback(
    (commentId: string) => `/guests/${profileId}#comment-${commentId}`,
    [profileId]
  );

  if (loaded === ERROR) {
    return (
      <section className="mt-8 border-t border-line-subtle pt-6">
        <p
          role="alert"
          className="bg-danger-tint border border-danger-border text-danger-fg px-4 py-3 rounded-md"
        >
          Couldn&apos;t load comments.
        </p>
      </section>
    );
  }

  const comments =
    loaded && loaded.profileId === profileId ? loaded.comments : null;

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
