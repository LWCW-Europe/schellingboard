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
  const [loaded, setLoaded] = useState<{
    sessionId: string;
    comments: Comment[];
  } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/session/${sessionId}/comments?reload=${reloadKey}`)
      .then((res) =>
        res.ok ? (res.json() as Promise<SerializedComment[]>) : []
      )
      .then((data) => {
        if (!cancelled) {
          setLoaded({ sessionId, comments: data.map(withDates) });
        }
      })
      .catch((e) => {
        console.error("Error fetching session comments", e);
        if (!cancelled) {
          setLoaded({ sessionId, comments: [] });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId, reloadKey]);

  const changed = useCallback(() => setReloadKey((k) => k + 1), []);

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
