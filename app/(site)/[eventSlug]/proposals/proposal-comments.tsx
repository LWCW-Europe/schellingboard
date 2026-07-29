"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { UserContext } from "@/app/(site)/context";
import { Markdown, MarkdownHint } from "@/app/(site)/markdown";
import { ConfirmationModal } from "@/app/(site)/modals";
import { COMMENT_MAX_LENGTH } from "@/model/comment";
import type { Comment } from "@/db/repositories/interfaces";
import {
  createProposalComment,
  deleteComment,
  updateComment,
} from "../comment-actions";
import { useLocalZone } from "@/utils/hooks";
import { formatInLocalZone } from "@/utils/utils";

type CommentNode = Comment & { replies: CommentNode[] };

function buildTree(comments: Comment[]): CommentNode[] {
  const nodes = new Map<string, CommentNode>(
    comments.map((c) => [c.id, { ...c, replies: [] }])
  );
  const roots: CommentNode[] = [];
  for (const comment of comments) {
    const node = nodes.get(comment.id)!;
    const parent = comment.parentId ? nodes.get(comment.parentId) : undefined;
    if (parent) {
      parent.replies.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// The highlight has to be rendered rather than poked onto the node with
// classList: any re-render rewrites className from the JSX and would drop it.
function useHighlightedComment(): [string | null, (id: string) => void] {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const hash = window.location.hash;
    // Deliberate: the hash can only be read after mount, and reading it during
    // render would make the server and client disagree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setId(hash.startsWith("#comment-") ? hash.slice("#comment-".length) : null);
  }, []);
  // Following a permalink in place changes the hash without remounting, so the
  // link has to say which comment it targets.
  return [id, setId];
}

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
  const { user: currentUserId } = useContext(UserContext);
  const roots = useMemo(() => buildTree(comments), [comments]);
  const total = comments.filter((c) => !c.deleted).length;
  const localZone = useLocalZone();
  const [highlightedId, highlight] = useHighlightedComment();

  // Scroll to a comment if the URL has a hash for it
  useEffect(() => {
    if (!highlightedId) {
      return;
    }
    document
      .getElementById(`comment-${highlightedId}`)
      ?.scrollIntoView({ block: "center" });
  }, [highlightedId, comments]);

  return (
    <section className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-lg font-semibold mb-4">
        {total === 1 ? "1 comment" : `${total} comments`}
      </h2>

      {roots.length > 0 && (
        <div className="mb-6">
          {roots.map((node) => (
            <CommentThread
              key={node.id}
              node={node}
              depth={0}
              proposalId={proposalId}
              eventSlug={eventSlug}
              timezone={timezone}
              localZone={localZone}
              highlightedId={highlightedId}
              highlight={highlight}
            />
          ))}
        </div>
      )}

      {currentUserId ? (
        <CommentForm
          proposalId={proposalId}
          eventSlug={eventSlug}
          placeholder="Add a comment"
          submitLabel="Comment"
        />
      ) : (
        <p className="text-sm text-gray-500">
          Select your name to leave a comment.
        </p>
      )}
    </section>
  );
}

function CommentThread({
  node,
  depth,
  proposalId,
  eventSlug,
  timezone,
  localZone,
  highlightedId,
  highlight,
}: {
  node: CommentNode;
  depth: number;
  proposalId: string;
  eventSlug: string;
  timezone: string;
  localZone: string | null;
  highlightedId: string | null;
  highlight: (id: string) => void;
}) {
  const { user: currentUserId } = useContext(UserContext);
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const permalink = `/${eventSlug}/proposals?viewProposal=${proposalId}#comment-${node.id}`;
  const isAuthor = !!currentUserId && node.author?.id === currentUserId;
  const background = depth % 2 === 1 ? "bg-[#f2f2f2]" : "bg-white";

  const onDelete = async () => {
    setError(null);
    const result = await deleteComment({ commentId: node.id, eventSlug });
    if ("error" in result) {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Failed to delete comment"
      );
      return;
    }
    router.refresh();
  };

  return (
    <div
      className={`relative rounded ${background} ${
        depth === 0
          ? "mb-[17px] border border-gray-200"
          : "border-l-2 border-gray-300"
      }`}
    >
      <div
        id={`comment-${node.id}`}
        className={`rounded ${depth > 0 ? "pl-3 pr-2 py-2" : "px-3 py-2"} ${
          node.id === highlightedId ? "relative z-10 ring-2 ring-rose-400" : ""
        }`}
      >
        <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand comment" : "Collapse comment"}
            className="cursor-pointer font-mono text-xs text-gray-500 hover:text-gray-800"
          >
            [{collapsed ? "+" : "-"}]
          </button>
          {node.deleted ? (
            <span className="text-sm italic text-gray-500">
              Comment deleted
            </span>
          ) : (
            <>
              {node.author ? (
                <Link
                  href={`/guests/${node.author.id}`}
                  className="font-medium text-rose-500 hover:text-rose-600 hover:underline"
                >
                  {node.author.name}
                </Link>
              ) : (
                // The author's guest was removed; there is no profile to link.
                <span className="font-medium text-gray-500">Unknown</span>
              )}
              <Link
                href={permalink}
                // replace, not push: the modal is already open at this URL, and
                // an extra history entry would make dismissing it (which goes
                // back) leave the modal open (anchor: MnpjIo7Y).
                replace
                scroll={false}
                onClick={() => highlight(node.id)}
                className="text-xs text-gray-500 hover:text-gray-800 hover:underline"
              >
                <time dateTime={node.createdTime.toISOString()}>
                  {formatInLocalZone(node.createdTime, timezone, localZone)}
                </time>
              </Link>
              {node.editedTime && (
                <span
                  className="text-xs text-gray-400"
                  title={`Edited ${formatInLocalZone(node.editedTime, timezone, localZone)}`}
                >
                  (edited)
                </span>
              )}
            </>
          )}
        </div>

        {!collapsed && !node.deleted && (
          <>
            {editing ? (
              <CommentForm
                proposalId={proposalId}
                eventSlug={eventSlug}
                commentId={node.id}
                initialBody={node.body}
                placeholder="Edit your comment"
                submitLabel="Save"
                onCancel={() => setEditing(false)}
                onDone={() => setEditing(false)}
              />
            ) : (
              <div className="mt-1 text-sm text-gray-800 break-words">
                <Markdown>{node.body}</Markdown>
              </div>
            )}

            {!editing && (
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                {currentUserId && (
                  <button
                    type="button"
                    onClick={() => setReplying(!replying)}
                    className="cursor-pointer hover:text-gray-800 hover:underline"
                  >
                    Reply
                  </button>
                )}
                {isAuthor && (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="cursor-pointer hover:text-gray-800 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(true)}
                      className="cursor-pointer hover:text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

            {replying && (
              <CommentForm
                proposalId={proposalId}
                eventSlug={eventSlug}
                parentId={node.id}
                placeholder="Write a reply"
                submitLabel="Reply"
                onCancel={() => setReplying(false)}
                onDone={() => setReplying(false)}
              />
            )}
          </>
        )}
      </div>

      {!collapsed && node.replies.length > 0 && (
        <div className="flex">
          <span className="w-3 shrink-0 hover:bg-black/10" />
          <div className="min-w-0 flex-1">
            {node.replies.map((reply) => (
              <CommentThread
                key={reply.id}
                node={reply}
                depth={depth + 1}
                proposalId={proposalId}
                eventSlug={eventSlug}
                timezone={timezone}
                localZone={localZone}
                highlightedId={highlightedId}
                highlight={highlight}
              />
            ))}
          </div>
        </div>
      )}

      {confirmingDelete && (
        <ConfirmationModal
          open
          close={() => setConfirmingDelete(false)}
          confirm={() => void onDelete()}
          message="Delete this comment? This cannot be undone."
          zIndex="z-[60]"
          portal
        />
      )}
    </div>
  );
}

function CommentForm({
  proposalId,
  eventSlug,
  parentId,
  commentId,
  initialBody = "",
  placeholder,
  submitLabel,
  onCancel,
  onDone,
}: {
  proposalId: string;
  eventSlug: string;
  parentId?: string;
  commentId?: string;
  initialBody?: string;
  placeholder: string;
  submitLabel: string;
  onCancel?: () => void;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = commentId
        ? await updateComment({ commentId, eventSlug, body })
        : await createProposalComment({
            proposalId,
            eventSlug,
            parentId,
            body,
          });
      if ("error" in result) {
        setError(
          typeof result.error === "string"
            ? result.error
            : (result.error[0]?.message ?? "Failed to post comment")
        );
        return;
      }
      if (!commentId) {
        setBody("");
      }
      onDone?.();
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="mt-2">
      <label
        htmlFor={`comment-body-${commentId ?? parentId ?? "new"}`}
        className="sr-only"
      >
        {placeholder}
      </label>
      <textarea
        id={`comment-body-${commentId ?? parentId ?? "new"}`}
        rows={3}
        value={body}
        maxLength={COMMENT_MAX_LENGTH}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-rose-400 focus:ring-rose-400"
      />
      <div className="mt-1 flex items-center justify-between gap-2">
        <MarkdownHint />
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || body.trim().length === 0}
            className="rounded-md bg-rose-400 px-3 py-1 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-50"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </form>
  );
}
