"use client";

import { useContext, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";

import { UserContext } from "@/app/(site)/context";
import { Avatar } from "@/app/(site)/guests/avatar";
import { Modal } from "@/app/(site)/modals";
import type { Comment } from "@/db/repositories/interfaces";
import { toggleCommentLike } from "./comment-actions";

const TOOLTIP_NAMES = 3;

export function CommentLikes({
  comment,
  eventSlug,
  onChanged,
}: {
  comment: Pick<Comment, "id" | "likes">;
  eventSlug: string;
  // Session comments are fetched client-side rather than arriving as server
  // props, so their section hands in its own reload instead of the default.
  onChanged?: () => void;
}) {
  const { user: currentUserId } = useContext(UserContext);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showingLikers, setShowingLikers] = useState(false);
  // Keep it as state because default hover behavior causes edge case problems
  const [previewing, setPreviewing] = useState(false);

  const likes = comment.likes;
  const liked = !!currentUserId && likes.some((l) => l.id === currentUserId);
  const countLabel = `${likes.length} like${likes.length === 1 ? "" : "s"}`;
  const preview = likes.slice(-TOOLTIP_NAMES).reverse();
  const beyondPreview = likes.length - preview.length;

  const onToggle = async () => {
    setError(null);
    setSaving(true);
    try {
      const result = await toggleCommentLike({
        commentId: comment.id,
        eventSlug,
      });
      if ("error" in result) {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Failed to like comment"
        );
        return;
      }
      startRefresh(() => (onChanged ? onChanged() : router.refresh()));
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {currentUserId && (
        <button
          type="button"
          onClick={() => void onToggle()}
          disabled={saving || refreshing}
          aria-pressed={liked}
          className={`cursor-pointer disabled:opacity-50 ${
            liked
              ? "font-semibold text-brand-fg hover:text-brand-fg-hover"
              : "hover:text-fg hover:underline"
          }`}
        >
          {liked ? "Liked" : "Like"}
        </button>
      )}
      {likes.length > 0 && (
        <span
          className="relative inline-block"
          onMouseEnter={() => setPreviewing(true)}
          onMouseLeave={() => setPreviewing(false)}
          onFocus={(e) => setPreviewing(e.target.matches(":focus-visible"))}
          onBlur={() => setPreviewing(false)}
        >
          <button
            type="button"
            onClick={() => {
              setPreviewing(false);
              setShowingLikers(true);
            }}
            className="cursor-pointer hover:text-fg hover:underline"
          >
            {countLabel}
          </button>
          <span
            className={`pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded bg-surface-inverse px-2 py-1 text-sm whitespace-nowrap text-fg-inverse transition-opacity duration-200 [@media(hover:hover)]:block ${
              previewing && !showingLikers ? "opacity-100" : "opacity-0"
            }`}
            role="tooltip"
          >
            {preview.map((liker) => (
              <span key={liker.id} className="block">
                {liker.name}
              </span>
            ))}
            {beyondPreview > 0 && (
              <span className="block text-fg-inverse-muted">
                and {beyondPreview} more
              </span>
            )}
          </span>
        </span>
      )}

      {error && <span className="text-danger-fg">{error}</span>}

      {showingLikers && (
        <Modal open setOpen={setShowingLikers} zIndex="z-[60]" portal>
          <Dialog.Title className="text-base font-semibold text-fg">
            Liked by
          </Dialog.Title>
          <ul className="mt-3 max-h-72 overflow-y-auto text-sm">
            {likes.map((liker) => (
              <li key={liker.id}>
                <Link
                  href={`/guests/${liker.id}`}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 font-medium text-fg hover:bg-surface-sunken"
                >
                  <Avatar
                    name={liker.name}
                    size="sm"
                    image={liker.avatarUrl ?? undefined}
                  />
                  {liker.name}
                </Link>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  );
}
