"use client";

import { useCallback, useEffect, useState } from "react";

import type { Comment } from "@/db/repositories/interfaces";
import { createSessionComment } from "./comment-actions";
import { CommentsSection } from "./comments-section";

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

// The session modal opens by pushing the URL locally, without an RSC
// roundtrip, so its comments can't arrive as server props: they load through
// /api/comments instead, and every mutation reloads them.
export function SessionComments({
  sessionId,
  eventSlug,
  timezone,
}: {
  sessionId: string;
  eventSlug: string;
  timezone: string;
}) {
  // Tagged with the session it came from, so a previous modal's comments
  // never show through while the next ones load.
  const [loaded, setLoaded] = useState<
    | {
        sessionId: string;
        comments: Comment[];
      }
    | null
    | typeof ERROR
  >(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/session/${sessionId}/comments?reload=${reloadKey}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`comments request failed: ${res.status}`);
        }
        return res.json() as Promise<SerializedComment[]>;
      })
      .then((data) => {
        if (!cancelled) {
          setLoaded({ sessionId, comments: data.map(withDates) });
        }
      })
      .catch(() => {
        // A failed reload keeps the thread already on screen; only a load
        // with nothing to fall back on turns into the message below.
        if (!cancelled) {
          setLoaded((prev) =>
            prev && prev !== ERROR && prev.sessionId === sessionId
              ? prev
              : ERROR
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId, reloadKey]);

  const changed = useCallback(() => setReloadKey((k) => k + 1), []);

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
    loaded && loaded.sessionId === sessionId ? loaded.comments : null;

  return (
    <CommentsSection
      eventSlug={eventSlug}
      timezone={timezone}
      comments={comments}
      create={(input) =>
        createSessionComment({ sessionId, eventSlug, ...input })
      }
      permalinkFor={(commentId) =>
        `/${eventSlug}?viewSession=${sessionId}#comment-${commentId}`
      }
      changed={changed}
    />
  );
}
