import { z } from "zod";

export const COMMENT_MAX_LENGTH = 20000;

const body = z
  .string()
  .trim()
  .min(1, { message: "Comment cannot be empty" })
  .max(COMMENT_MAX_LENGTH, {
    message: `Comment must be at most ${COMMENT_MAX_LENGTH} characters`,
  });

export const proposalCommentSchema = z.object({
  proposalId: z.string().min(1),
  eventSlug: z.string().min(1),
  parentId: z.string().min(1).optional(),
  body,
});

export const commentUpdateSchema = z.object({
  commentId: z.string().min(1),
  eventSlug: z.string().min(1),
  body,
});

export const commentDeleteSchema = z.object({
  commentId: z.string().min(1),
  eventSlug: z.string().min(1),
});

export const commentLikeSchema = z.object({
  commentId: z.string().min(1),
  eventSlug: z.string().min(1),
});
