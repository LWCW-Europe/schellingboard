import { asc, eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type { Comment, CommentsRepository } from "../interfaces";

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

  async listByProposal(proposalId: string): Promise<Comment[]> {
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
      .all()
      .map(toComment);
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
    return row && toComment(row);
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
    };
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

function toComment(row: CommentRow): Comment {
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
  };
}
