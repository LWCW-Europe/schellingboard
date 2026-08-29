import { and, asc, eq, inArray, sql, type SQL } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { AnySQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type {
  Comment,
  CommentLiker,
  CommentsRepository,
  SubjectCommentsRepository,
} from "../interfaces";

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

const commentColumns = {
  id: schema.comments.id,
  parentId: schema.comments.parentId,
  body: schema.comments.body,
  deleted: schema.comments.deleted,
  createdTime: schema.comments.createdTime,
  editedTime: schema.comments.editedTime,
  authorId: schema.guests.id,
  authorName: schema.guests.name,
};

type CommentCreateData = {
  authorId: string;
  parentId?: string;
  body: string;
  createdTime: Date;
};

// ── Shared helpers ────────────────────────────────────────────────────────────

function selectLikes(
  db: DB,
  commentIds: string[]
): Map<string, CommentLiker[]> {
  const byComment = new Map<string, CommentLiker[]>();
  if (commentIds.length === 0) {
    return byComment;
  }
  const rows = db
    .select({
      commentId: schema.commentLikes.commentId,
      id: schema.guests.id,
      name: schema.guests.name,
      avatarUrl: schema.guests.avatarUrl,
    })
    .from(schema.commentLikes)
    .innerJoin(schema.guests, eq(schema.commentLikes.guestId, schema.guests.id))
    .where(inArray(schema.commentLikes.commentId, commentIds))
    .orderBy(
      asc(schema.commentLikes.createdTime),
      asc(insertionOrder(schema.commentLikes))
    )
    .all();
  for (const { commentId, id, name, avatarUrl } of rows) {
    const likes = byComment.get(commentId) ?? [];
    likes.push({ id, name, avatarUrl });
    byComment.set(commentId, likes);
  }
  return byComment;
}

function listComments(db: DB, rows: CommentRow[]): Comment[] {
  const likes = selectLikes(
    db,
    rows.map((r) => r.id)
  );
  return rows.map((row) => toComment(row, likes.get(row.id)));
}

function createdComment(db: DB, id: string, data: CommentCreateData): Comment {
  const author = db
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

// Ids are random nanoids, so they can't break a tie between two rows written in
// the same millisecond; the implicit rowid is insertion order.
function insertionOrder(table: SQLiteTable): SQL {
  return sql`${table}.rowid`;
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

// ── Scope-agnostic core ───────────────────────────────────────────────────────

export class SqliteCommentsRepository implements CommentsRepository {
  constructor(private readonly db: DB) {}

  async findById(commentId: string): Promise<Comment | undefined> {
    const row = this.db
      .select(commentColumns)
      .from(schema.comments)
      .leftJoin(schema.guests, eq(schema.comments.authorId, schema.guests.id))
      .where(eq(schema.comments.id, commentId))
      .get();
    return (
      row && toComment(row, selectLikes(this.db, [commentId]).get(commentId))
    );
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

// ── Per-subject repositories ─────────────────────────────────────────────────

type Tx = Parameters<Parameters<DB["transaction"]>[0]>[0];

// A subject's join table, reduced to what attaching and looking up need.
// `attach` is a callback rather than the table itself so each insert stays
// typed against its own column names.
type CommentJoin = {
  table: SQLiteTable;
  commentId: AnySQLiteColumn;
  subjectId: AnySQLiteColumn;
  attach: (tx: Tx, commentId: string, subjectId: string) => void;
};

const JOINS: Record<"proposal" | "session", CommentJoin> = {
  proposal: {
    table: schema.proposalComments,
    commentId: schema.proposalComments.commentId,
    subjectId: schema.proposalComments.proposalId,
    attach: (tx, commentId, proposalId) =>
      tx
        .insert(schema.proposalComments)
        .values({ commentId, proposalId })
        .run(),
  },
  session: {
    table: schema.sessionComments,
    commentId: schema.sessionComments.commentId,
    subjectId: schema.sessionComments.sessionId,
    attach: (tx, commentId, sessionId) =>
      tx.insert(schema.sessionComments).values({ commentId, sessionId }).run(),
  },
};

class SqliteSubjectCommentsRepository implements SubjectCommentsRepository {
  constructor(
    private readonly db: DB,
    private readonly join: CommentJoin
  ) {}

  async list(subjectId: string): Promise<Comment[]> {
    const rows = this.db
      .select(commentColumns)
      .from(this.join.table)
      .innerJoin(schema.comments, eq(this.join.commentId, schema.comments.id))
      .leftJoin(schema.guests, eq(schema.comments.authorId, schema.guests.id))
      .where(eq(this.join.subjectId, subjectId))
      .orderBy(
        asc(schema.comments.createdTime),
        asc(insertionOrder(schema.comments))
      )
      .all();
    return listComments(this.db, rows);
  }

  async findSubjectId(commentId: string): Promise<string | undefined> {
    return this.db
      .select({ subjectId: this.join.subjectId })
      .from(this.join.table)
      .where(eq(this.join.commentId, commentId))
      .get()?.subjectId as string | undefined;
  }

  async create(data: {
    subjectId: string;
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
      this.join.attach(tx, id, data.subjectId);
    });
    return createdComment(this.db, id, data);
  }
}

export function sqliteSubjectCommentsRepository(
  db: DB,
  subject: keyof typeof JOINS
): SubjectCommentsRepository {
  return new SqliteSubjectCommentsRepository(db, JOINS[subject]);
}
