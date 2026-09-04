"use client";

import { useContext, useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";

import { UserContext } from "@/app/(site)/context";
import { Markdown, MarkdownHint } from "@/app/(site)/markdown";
import { ConfirmationModal } from "@/app/(site)/modals";
import { COMMENT_MAX_LENGTH } from "@/model/comment";
import type { Comment } from "@/db/repositories/interfaces";
import type { CommentActionResult } from "./comment-actions";
import { deleteComment, updateComment } from "./comment-actions";
import { useLocalZone } from "@/utils/hooks";
import { CommentLikes } from "./comment-likes";
import type { LoadedComments } from "./use-comments";
import { formatInLocalZone } from "@/utils/utils";

export type CommentCreateInput = { parentId?: string; body: string };

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

export function CommentsSection({
  eventSlug,
  timezone,
  comments,
  create,
  permalinkFor,
  changed,
}: {
  // Only the cache invalidation target for pages that server-render their
  // comments — proposals. Sessions and profiles omit it.
  eventSlug?: string;
  timezone: string;
  comments?: LoadedComments;
  // Scope-specific: proposals, sessions and profiles differ in the action
  // called and in where a permalink points. Everything else about commenting
  // is shared.
  create: (input: CommentCreateInput) => Promise<CommentActionResult>;
  permalinkFor: (commentId: string) => string;
  changed: () => void;
}) {
  const { user: currentUserId } = useContext(UserContext);
  const loaded = Array.isArray(comments) ? comments : null;
  const roots = useMemo(() => (loaded ? buildTree(loaded) : []), [loaded]);
  const total = useMemo(
    () => loaded?.filter((c) => !c.deleted)?.length,
    [loaded]
  );
  const localZone = useLocalZone();
  const [highlightedId, highlight] = useHighlightedComment();

  // Scroll to a comment if the URL has a hash for it
  useEffect(() => {
    if (!highlightedId) {
      return;
    }
    const target = document.querySelector<HTMLElement>(
      `[data-comment="${CSS.escape(highlightedId)}"]`
    );
    target?.scrollIntoView({ block: "center" });
  }, [highlightedId, loaded]);

  if (comments === "error") {
    return (
      <section className="mt-8 border-t border-line-subtle pt-6">
        <h2 className="text-lg font-semibold mb-4">
          Comments could not be loaded
        </h2>
        <p className="text-sm text-fg-subtle">
          Reload the page to try again — the comments are still there.
        </p>
      </section>
    );
  }

  if (!loaded) {
    return (
      <section className="mt-8 border-t border-line-subtle pt-6">
        <h2 className="text-lg font-semibold mb-4">Loading comments...</h2>
        <div aria-hidden="true" className="flex flex-col gap-2 animate-pulse">
          <div className="h-4 w-28 rounded bg-surface-muted" />
          <div className="h-4 w-56 rounded bg-surface-muted" />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 border-t border-line-subtle pt-6">
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
              eventSlug={eventSlug}
              timezone={timezone}
              localZone={localZone}
              create={create}
              permalinkFor={permalinkFor}
              changed={changed}
              highlightedId={highlightedId}
              highlight={highlight}
            />
          ))}
        </div>
      )}

      {currentUserId ? (
        <CommentForm
          onSubmit={(body) => create({ body })}
          clearOnSuccess
          placeholder="Add a comment"
          submitLabel="Comment"
          onChanged={changed}
        />
      ) : (
        <p className="text-sm text-fg-subtle">
          Select your name to leave a comment.
        </p>
      )}
    </section>
  );
}

function CommentThread({
  node,
  depth,
  eventSlug,
  timezone,
  create,
  permalinkFor,
  changed,
  localZone,
  highlightedId,
  highlight,
}: {
  node: CommentNode;
  depth: number;
  eventSlug?: string;
  timezone: string;
  create: (input: CommentCreateInput) => Promise<CommentActionResult>;
  permalinkFor: (commentId: string) => string;
  changed: () => void;
  localZone: string | null;
  highlightedId: string | null;
  highlight: (id: string) => void;
}) {
  const { user: currentUserId } = useContext(UserContext);
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const permalink = permalinkFor(node.id);
  const isAuthor = !!currentUserId && node.author?.id === currentUserId;
  const background = depth % 2 === 1 ? "bg-surface-muted" : "bg-surface-raised";

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
    changed();
  };

  return (
    <div
      className={`relative rounded ${background} ${
        depth === 0
          ? "mb-[17px] border border-line-subtle"
          : "border-l-2 border-line"
      }`}
    >
      <div
        // data-comment, not id="comment-…": an element the hash names is one
        // the browser scrolls to itself, and its jump moves every box it can —
        // the modal's clipped panels included, which nothing can scroll back.
        // A profile opened at a comment was left stranded partway under its own
        // header (#930). Scrolling to the comment is the effect above's job.
        data-comment={node.id}
        className={`rounded ${depth > 0 ? "pl-3 pr-2 py-2" : "px-3 py-2"} ${
          node.id === highlightedId
            ? "relative z-10 ring-2 ring-brand-accent"
            : ""
        }`}
      >
        <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand comment" : "Collapse comment"}
            className="cursor-pointer font-mono text-xs text-fg-muted hover:text-fg"
          >
            [{collapsed ? "+" : "-"}]
          </button>
          {node.deleted ? (
            <span className="text-sm italic text-fg-muted">
              Comment deleted
            </span>
          ) : (
            <>
              {node.author ? (
                <Link
                  href={`/guests/${node.author.id}`}
                  className="font-medium text-brand-fg hover:text-brand-fg-hover hover:underline"
                >
                  {node.author.name}
                </Link>
              ) : (
                // The author's guest was removed; there is no profile to link.
                <span className="font-medium text-fg-muted">Unknown</span>
              )}
              <Link
                href={permalink}
                // replace, not push: the modal is already open at this URL, and
                // an extra history entry would make dismissing it (which goes
                // back) leave the modal open (anchor: MnpjIo7Y).
                replace
                scroll={false}
                onClick={() => highlight(node.id)}
                className="text-xs text-fg-muted hover:text-fg hover:underline"
              >
                <time dateTime={node.createdTime.toISOString()}>
                  {formatInLocalZone(node.createdTime, timezone, localZone)}
                </time>
              </Link>
              {node.editedTime && (
                <span
                  className="text-xs text-fg-muted"
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
                onSubmit={(body) =>
                  updateComment({ commentId: node.id, eventSlug, body })
                }
                placeholder="Edit your comment"
                submitLabel="Save"
                initialBody={node.body}
                onCancel={() => setEditing(false)}
                onDone={() => setEditing(false)}
                onChanged={changed}
              />
            ) : (
              <div className="mt-1 text-sm text-fg break-words">
                <Markdown>{node.body}</Markdown>
              </div>
            )}

            {!editing && (
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-fg-muted">
                <CommentLikes
                  comment={node}
                  eventSlug={eventSlug}
                  onChanged={changed}
                />
                {currentUserId && (
                  <button
                    type="button"
                    onClick={() => setReplying(!replying)}
                    className="cursor-pointer hover:text-fg hover:underline"
                  >
                    Reply
                  </button>
                )}
                {isAuthor && (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="cursor-pointer hover:text-fg hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(true)}
                      className="cursor-pointer hover:text-danger-fg hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}

            {error && <p className="mt-1 text-sm text-danger-fg">{error}</p>}

            {replying && (
              <CommentForm
                onSubmit={(body) => create({ parentId: node.id, body })}
                clearOnSuccess
                placeholder="Write a reply"
                submitLabel="Reply"
                onCancel={() => setReplying(false)}
                onDone={() => setReplying(false)}
                onChanged={changed}
              />
            )}
          </>
        )}
      </div>

      {!collapsed && node.replies.length > 0 && (
        <div className="flex">
          <span className="w-3 shrink-0 hover:bg-surface-hover" />
          <div className="min-w-0 flex-1">
            {node.replies.map((reply) => (
              <CommentThread
                key={reply.id}
                node={reply}
                depth={depth + 1}
                eventSlug={eventSlug}
                timezone={timezone}
                create={create}
                permalinkFor={permalinkFor}
                changed={changed}
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
  onSubmit,
  clearOnSuccess,
  initialBody = "",
  placeholder,
  submitLabel,
  onCancel,
  onDone,
  onChanged,
}: {
  onSubmit: (body: string) => Promise<CommentActionResult>;
  clearOnSuccess?: boolean;
  initialBody?: string;
  placeholder: string;
  submitLabel: string;
  onCancel?: () => void;
  onDone?: () => void;
  onChanged?: () => void;
}) {
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formId = useId();

  const doSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await onSubmit(body);
      if ("error" in result) {
        setError(
          typeof result.error === "string"
            ? result.error
            : (result.error[0]?.message ?? "Failed to post comment")
        );
        return;
      }
      if (clearOnSuccess) {
        setBody("");
      }
      onDone?.();
      onChanged?.();
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void doSubmit(e)} className="mt-2">
      <label htmlFor={`comment-body-${formId}`} className="sr-only">
        {placeholder}
      </label>
      <textarea
        id={`comment-body-${formId}`}
        rows={3}
        value={body}
        maxLength={COMMENT_MAX_LENGTH}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-line p-2 text-sm focus:border-brand-accent focus:ring-brand-accent"
      />
      <div className="mt-1 flex items-center justify-between gap-2">
        <MarkdownHint />
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-line px-3 py-1 text-sm font-medium text-fg-muted hover:bg-surface-muted"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || body.trim().length === 0}
            className="rounded-md bg-brand px-3 py-1 text-sm font-medium text-on-brand hover:bg-brand-hover disabled:opacity-50"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-danger-fg">{error}</p>}
    </form>
  );
}
