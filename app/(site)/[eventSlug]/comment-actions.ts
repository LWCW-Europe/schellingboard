"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { after } from "next/server";
import { z } from "zod";

import { getRepositories } from "@/db/container";
import {
  commentDeleteSchema,
  commentLikeSchema,
  commentUpdateSchema,
  proposalCommentSchema,
  sessionCommentSchema,
} from "@/model/comment";
import { notifyProposalCommented } from "@/utils/notifications";
import { serverNow } from "@/utils/dev-clock-server";
import {
  NAME_PROTECTED_ERROR,
  verifiedCurrentUser,
} from "@/utils/acting-guest";

export type CommentActionResult =
  { error: string | z.core.$ZodIssue[] } | { success: true };

export type CommentLikeResult =
  { error: string | z.core.$ZodIssue[] } | { success: true; liked: boolean };

const NO_NAME_ERROR = `Select your name before commenting — ${NAME_PROTECTED_ERROR.toLowerCase()}`;

class Refusal extends Error {
  constructor(readonly payload: string | z.core.$ZodIssue[]) {
    super(typeof payload === "string" ? payload : JSON.stringify(payload));
  }
}

function toResult(
  error: unknown,
  failure: string
): { error: string | z.core.$ZodIssue[] } {
  if (error instanceof Refusal) {
    return { error: error.payload };
  }
  console.error(failure, error);
  return { error: failure };
}

async function requireGuest(): Promise<string> {
  const guest = await verifiedCurrentUser(await cookies());
  if (!guest) {
    throw new Refusal(NO_NAME_ERROR);
  }
  return guest;
}

async function requireParsed<Schema extends z.ZodType>(
  schema: Schema,
  input: unknown
): Promise<z.output<Schema>> {
  const parsed = await schema.safeParseAsync(input);
  if (!parsed.success) {
    throw new Refusal(parsed.error.issues);
  }
  return parsed.data;
}

async function requireOwnComment(
  commentId: string,
  actor: string
): Promise<void> {
  const comment = await getRepositories().comments.findById(commentId);
  if (!comment || comment.deleted) {
    throw new Refusal("Comment not found");
  } else if (comment.author?.id !== actor) {
    throw new Refusal("Comment owned by another guest");
  }
}

export async function createProposalComment(
  comment: z.input<typeof proposalCommentSchema>
): Promise<CommentActionResult>;
export async function createProposalComment(
  input: unknown
): Promise<CommentActionResult> {
  try {
    const guest = await requireGuest();
    const { proposalId, parentId, body, eventSlug } = await requireParsed(
      proposalCommentSchema,
      input
    );

    // validation
    if (!(await getRepositories().sessionProposals.findById(proposalId))) {
      return { error: "Proposal not found" };
    }
    if (parentId) {
      const parentOf =
        await getRepositories().proposalComments.findProposalId(parentId);
      if (!parentOf || parentOf !== proposalId) {
        return { error: "The comment being replied to is invalid" };
      }
    }

    const comment = await getRepositories().proposalComments.createForProposal({
      proposalId,
      authorId: guest,
      parentId,
      body,
      createdTime: await serverNow(),
    });
    revalidatePath(`/${eventSlug}`, "layout");
    after(() => notifyProposalCommented({ proposalId, comment }));
    return { success: true };
  } catch (error) {
    return toResult(error, "Failed to post comment");
  }
}

export async function createSessionComment(
  comment: z.input<typeof sessionCommentSchema>
): Promise<CommentActionResult>;
export async function createSessionComment(
  input: unknown
): Promise<CommentActionResult> {
  try {
    const guest = await requireGuest();
    const { sessionId, parentId, body } = await requireParsed(
      sessionCommentSchema,
      input
    );

    // validation
    if (!(await getRepositories().sessions.findById(sessionId))) {
      return { error: "Session not found" };
    }
    if (parentId) {
      const parentOf =
        await getRepositories().sessionComments.findSessionId(parentId);
      if (!parentOf || parentOf !== sessionId) {
        return { error: "The comment being replied to is invalid" };
      }
    }

    await getRepositories().sessionComments.createForSession({
      sessionId,
      authorId: guest,
      parentId,
      body,
      createdTime: await serverNow(),
    });
    return { success: true };
  } catch (error) {
    return toResult(error, "Failed to post comment");
  }
}

export async function updateComment(
  comment: z.input<typeof commentUpdateSchema>
): Promise<CommentActionResult>;
export async function updateComment(
  input: unknown
): Promise<CommentActionResult> {
  try {
    const guest = await requireGuest();
    const { commentId, body, eventSlug } = await requireParsed(
      commentUpdateSchema,
      input
    );
    await requireOwnComment(commentId, guest);

    await getRepositories().comments.update(commentId, {
      body,
      editedTime: await serverNow(),
    });
    if (eventSlug) {
      revalidatePath(`/${eventSlug}`, "layout");
    }
    return { success: true };
  } catch (error) {
    return toResult(error, "Failed to update comment");
  }
}

export async function toggleCommentLike(
  like: z.input<typeof commentLikeSchema>
): Promise<CommentLikeResult>;
export async function toggleCommentLike(
  input: unknown
): Promise<CommentLikeResult> {
  try {
    const guest = await requireGuest();
    const { commentId, eventSlug } = await requireParsed(
      commentLikeSchema,
      input
    );
    const comment = await getRepositories().comments.findById(commentId);

    if (!comment || comment.deleted) {
      return { error: "Comment not found" };
    }

    const liked = await getRepositories().comments.toggleLike({
      commentId,
      guestId: guest,
      createdTime: await serverNow(),
    });
    if (eventSlug) {
      revalidatePath(`/${eventSlug}`, "layout");
    }
    return { success: true, liked };
  } catch (error) {
    return toResult(error, "Failed to like comment");
  }
}

export async function deleteComment(
  comment: z.input<typeof commentDeleteSchema>
): Promise<CommentActionResult>;
export async function deleteComment(
  input: unknown
): Promise<CommentActionResult> {
  try {
    const guest = await requireGuest();
    const { commentId, eventSlug } = await requireParsed(
      commentDeleteSchema,
      input
    );
    await requireOwnComment(commentId, guest);

    await getRepositories().comments.delete(commentId);
    if (eventSlug) {
      revalidatePath(`/${eventSlug}`, "layout");
    }
    return { success: true };
  } catch (error) {
    return toResult(error, "Failed to delete comment");
  }
}
