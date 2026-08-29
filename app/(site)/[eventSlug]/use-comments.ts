"use client";

import { useCallback, useEffect, useState } from "react";

import type { Comment } from "@/db/repositories/interfaces";

type SerializedComment = Omit<Comment, "createdTime" | "editedTime"> & {
  createdTime: string;
  editedTime: string | null;
};

/**
 * What a comment section knows about its thread: `null` while the first load
 * is still in flight, `"error"` when it failed, the comments otherwise. The
 * three are deliberately distinct — an unreachable server must not render as
 * an empty thread, and an empty thread must not render as a spinner.
 */
export type LoadedComments = Comment[] | "error" | null;

function withDates(comment: SerializedComment): Comment {
  return {
    ...comment,
    createdTime: new Date(comment.createdTime),
    editedTime: comment.editedTime ? new Date(comment.editedTime) : null,
  };
}

/**
 * Loads the comments at `path` and reloads them whenever the returned
 * `changed` is called. Modals that push their URL locally, without an RSC
 * roundtrip, can't get their comments as server props and use this instead.
 *
 * A failed *reload* keeps what is already shown rather than wiping the thread;
 * only a failed first load reports "error".
 */
export function useComments(path: string): {
  comments: LoadedComments;
  changed: () => void;
} {
  // Tagged with the path it came from, so a previous subject's comments never
  // show through while the next ones load.
  const [loaded, setLoaded] = useState<{
    path: string;
    comments: LoadedComments;
  } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`${path}?reload=${reloadKey}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`${res.status} loading ${path}`);
        }
        return (await res.json()) as SerializedComment[];
      })
      .then((data) => setLoaded({ path, comments: data.map(withDates) }))
      .catch((e: unknown) => {
        // Closing the modal or leaving the page aborts the request; there is
        // nothing left to show and nobody to tell. Unhandled, that rejection
        // reaches the window as an uncaught NetworkError.
        if (controller.signal.aborted) {
          return;
        }
        console.warn("Could not load comments", e);
        setLoaded((previous) =>
          previous?.path === path ? previous : { path, comments: "error" }
        );
      });
    return () => controller.abort();
  }, [path, reloadKey]);

  const changed = useCallback(() => setReloadKey((k) => k + 1), []);

  return {
    comments: loaded?.path === path ? loaded.comments : null,
    changed,
  };
}
