import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type { Notification, NotificationsRepository } from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

function rowToNotification(
  row: typeof schema.notifications.$inferSelect
): Notification {
  return {
    id: row.id,
    guestId: row.guestId,
    type: row.type,
    text: row.text,
    url: row.url,
    createdAt: new Date(row.createdAt),
    readAt: row.readAt ? new Date(row.readAt) : undefined,
  };
}

// Enforced here rather than trusted from producers: openNotificationAction
// hands the stored link straight to redirect(), where anything a browser
// resolves to another origin sends the guest off the site.
//
// Asking the URL parser rather than pattern-matching is what makes this hold:
// "//host/x", "/\\host/x" and "/<tab>/host/x" all start with a slash and all
// resolve elsewhere, because the parser strips control characters exactly as
// browsers do. The leading slash is still required separately — "foo" resolves
// to this origin but is not a link from the site root.
const LINK_BASE = "https://notification-link.invalid";

function isSiteRelative(url: string): boolean {
  if (!url.startsWith("/")) return false;
  try {
    return new URL(url, LINK_BASE).origin === LINK_BASE;
  } catch {
    return false;
  }
}

export class SqliteNotificationsRepository implements NotificationsRepository {
  constructor(private readonly db: DB) {}

  async findForGuest(
    guestId: string,
    id: string
  ): Promise<Notification | undefined> {
    const row = this.db
      .select()
      .from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.id, id),
          eq(schema.notifications.guestId, guestId)
        )
      )
      .get();
    return row ? rowToNotification(row) : undefined;
  }

  async listByGuest(
    guestId: string,
    opts?: { limit?: number; offset?: number }
  ): Promise<Notification[]> {
    let query = this.db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.guestId, guestId))
      // Two notifications can share a timestamp, so the id breaks the tie and
      // keeps paging from repeating or skipping a row.
      .orderBy(
        desc(schema.notifications.createdAt),
        desc(schema.notifications.id)
      )
      .$dynamic();
    if (opts?.limit !== undefined) query = query.limit(opts.limit);
    if (opts?.offset !== undefined) query = query.offset(opts.offset);
    return query.all().map(rowToNotification);
  }

  async countUnread(guestId: string): Promise<number> {
    const row = this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.guestId, guestId),
          isNull(schema.notifications.readAt)
        )
      )
      .get();
    return row?.count ?? 0;
  }

  async countByGuest(guestId: string): Promise<number> {
    const row = this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.notifications)
      .where(eq(schema.notifications.guestId, guestId))
      .get();
    return row?.count ?? 0;
  }

  async create(
    data: Omit<Notification, "id" | "readAt">
  ): Promise<Notification> {
    if (!isSiteRelative(data.url)) {
      throw new Error(
        `Notification link must be site-relative, got "${data.url}"`
      );
    }
    const row = {
      id: nanoid(),
      ...data,
      createdAt: data.createdAt.toISOString(),
      readAt: null,
    };
    this.db.insert(schema.notifications).values(row).run();
    return rowToNotification(row);
  }

  async markRead(guestId: string, id: string, readAt: Date): Promise<boolean> {
    const result = this.db
      .update(schema.notifications)
      .set({ readAt: readAt.toISOString() })
      .where(
        and(
          eq(schema.notifications.id, id),
          eq(schema.notifications.guestId, guestId),
          isNull(schema.notifications.readAt)
        )
      )
      .run();
    if (result.changes > 0) return true;
    // Marking an already-read notification again is a no-op, not a failure:
    // the row is only missing or someone else's when nothing matches at all.
    const existing = this.db
      .select({ id: schema.notifications.id })
      .from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.id, id),
          eq(schema.notifications.guestId, guestId)
        )
      )
      .get();
    return existing !== undefined;
  }

  async markManyRead(
    guestId: string,
    ids: string[],
    readAt: Date
  ): Promise<void> {
    if (ids.length === 0) return;
    this.db
      .update(schema.notifications)
      .set({ readAt: readAt.toISOString() })
      .where(
        and(
          inArray(schema.notifications.id, ids),
          eq(schema.notifications.guestId, guestId),
          isNull(schema.notifications.readAt)
        )
      )
      .run();
  }

  async deleteMany(guestId: string, ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    this.db
      .delete(schema.notifications)
      .where(
        and(
          inArray(schema.notifications.id, ids),
          eq(schema.notifications.guestId, guestId)
        )
      )
      .run();
  }
}
