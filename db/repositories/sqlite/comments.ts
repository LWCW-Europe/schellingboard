import { and, asc, eq, inArray } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type { Comment, CommentLiker, CommentsRepository } from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

type CommentRow = {
  id: string;
  parentId: string | null;
  body: string;
  deleted: boolean;
  createdTime: string;
  editedTime: string | null;
  authorId: string | null;
  authorName: string | null;
};

export class SqliteCommentsRepository implements CommentsRepository {
  constructor(private readonly db: DB) {}

  private selectByProposal(proposalId: string): CommentRow[] {
    return this.db
      .select({
        id: schema.comments.id,
        parentId: schema.comments.parentId,
        body: schema.comments.body,
        deleted: schema.comments.deleted,
        createdTime: schema.comments.createdTime,
        editedTime: schema.comments.editedTime,
        authorId: schema.guests.id,
        authorName: schema.guests.name,
      })
      .from(schema.proposalComments)
      .innerJoin(
        schema.comments,
        eq(schema.proposalComments.commentId, schema.comments.id)
      )
      .leftJoin(schema.guests, eq(schema.comments.authorId, schema.guests.id))
      .where(eq(schema.proposalComments.proposalId, proposalId))
      .orderBy(asc(schema.comments.createdTime), asc(schema.comments.id))
      .all();
  }

  private selectLikes(commentIds: string[]): Map<string, CommentLiker[]> {
    const byComment = new Map<string, CommentLiker[]>();
    if (commentIds.length === 0) {
      return byComment;
    }
    const rows = this.db
      .select({
        commentId: schema.commentLikes.commentId,
        id: schema.guests.id,
        name: schema.guests.name,
        avatarUrl: schema.guests.avatarUrl,
      })
      .from(schema.commentLikes)
      .innerJoin(
        schema.guests,
        eq(schema.commentLikes.guestId, schema.guests.id)
      )
      .where(inArray(schema.commentLikes.commentId, commentIds))
      .orderBy(
        asc(schema.commentLikes.createdTime),
        asc(schema.commentLikes.guestId)
      )
      .all();
    for (const { commentId, id, name, avatarUrl } of rows) {
      const likes = byComment.get(commentId) ?? [];
      likes.push({ id, name, avatarUrl });
      byComment.set(commentId, likes);
    }
    return byComment;
  }

  async listByProposal(proposalId: string): Promise<Comment[]> {
    const rows = this.selectByProposal(proposalId);
    const likes = this.selectLikes(rows.map((r) => r.id));
    return rows.map((row) => toComment(row, likes.get(row.id)));
  }

  async findById(id: string): Promise<Comment | undefined> {
    const row = this.db
      .select({
        id: schema.comments.id,
        parentId: schema.comments.parentId,
        body: schema.comments.body,
        deleted: schema.comments.deleted,
        createdTime: schema.comments.createdTime,
        editedTime: schema.comments.editedTime,
        authorId: schema.guests.id,
        authorName: schema.guests.name,
      })
      .from(schema.comments)
      .leftJoin(schema.guests, eq(schema.comments.authorId, schema.guests.id))
      .where(eq(schema.comments.id, id))
      .get();
    return row && toComment(row, this.selectLikes([id]).get(id));
  }

  async findProposalId(commentId: string): Promise<string | undefined> {
    return this.db
      .select({ proposalId: schema.proposalComments.proposalId })
      .from(schema.proposalComments)
      .where(eq(schema.proposalComments.commentId, commentId))
      .get()?.proposalId;
  }

  async createForProposal(data: {
    proposalId: string;
    authorId: string;
    parentId?: string;
    body: string;
    createdTime: Date;
  }): Promise<Comment> {
    const id = nanoid();
    this.db.transaction((tx) => {
      tx.insert(schema.comments)
        .values({
          id,
          authorId: data.authorId,
          parentId: data.parentId ?? null,
          body: data.body,
          createdTime: data.createdTime.toISOString(),
        })
        .run();
      tx.insert(schema.proposalComments)
        .values({ commentId: id, proposalId: data.proposalId })
        .run();
    });
    const author = this.db
      .select({ id: schema.guests.id, name: schema.guests.name })
      .from(schema.guests)
      .where(eq(schema.guests.id, data.authorId))
      .get();
    return {
      id,
      parentId: data.parentId ?? null,
      body: data.body,
      deleted: false,
      createdTime: data.createdTime,
      editedTime: null,
      author: author ?? null,
      likes: [],
    };
  }

  async toggleLike(data: {
    commentId: string;
    guestId: string;
    createdTime: Date;
  }): Promise<boolean> {
    return this.db.transaction((tx) => {
      const match = and(
        eq(schema.commentLikes.commentId, data.commentId),
        eq(schema.commentLikes.guestId, data.guestId)
      );
      const existing = tx
        .select({ commentId: schema.commentLikes.commentId })
        .from(schema.commentLikes)
        .where(match)
        .get();
      if (existing) {
        tx.delete(schema.commentLikes).where(match).run();
        return false;
      }
      tx.insert(schema.commentLikes)
        .values({
          commentId: data.commentId,
          guestId: data.guestId,
          createdTime: data.createdTime.toISOString(),
        })
        .run();
      return true;
    });
  }

  async update(
    id: string,
    data: { body: string; editedTime: Date }
  ): Promise<void> {
    this.db
      .update(schema.comments)
      .set({ body: data.body, editedTime: data.editedTime.toISOString() })
      .where(eq(schema.comments.id, id))
      .run();
  }

  async delete(id: string): Promise<void> {
    this.db.transaction((tx) => {
      const hasReplies = (nodeId: string) =>
        tx
          .select({ id: schema.comments.id })
          .from(schema.comments)
          .where(eq(schema.comments.parentId, nodeId))
          .get() !== undefined;

      if (hasReplies(id)) {
        tx.update(schema.comments)
          .set({
            authorId: null,
            body: "",
            deleted: true,
            editedTime: null,
          })
          .where(eq(schema.comments.id, id))
          .run();
        tx.delete(schema.commentLikes)
          .where(eq(schema.commentLikes.commentId, id))
          .run();
        return;
      }

      let current = tx
        .select({
          id: schema.comments.id,
          parentId: schema.comments.parentId,
          deleted: schema.comments.deleted,
        })
        .from(schema.comments)
        .where(eq(schema.comments.id, id))
        .get();

      while (current) {
        const parentId = current.parentId;
        tx.delete(schema.comments)
          .where(eq(schema.comments.id, current.id))
          .run();
        if (!parentId) break;
        const parent = tx
          .select({
            id: schema.comments.id,
            parentId: schema.comments.parentId,
            deleted: schema.comments.deleted,
          })
          .from(schema.comments)
          .where(eq(schema.comments.id, parentId))
          .get();
        current =
          parent && parent.deleted && !hasReplies(parent.id)
            ? parent
            : undefined;
      }
    });
  }
}

function toComment(row: CommentRow, likes: CommentLiker[] = []): Comment {
  return {
    id: row.id,
    parentId: row.parentId,
    body: row.body,
    deleted: row.deleted,
    createdTime: new Date(row.createdTime),
    editedTime: row.editedTime ? new Date(row.editedTime) : null,
    author:
      row.authorId && row.authorName
        ? { id: row.authorId, name: row.authorName }
        : null,
    likes,
  };
}
