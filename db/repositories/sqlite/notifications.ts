import { and, desc, eq, isNull, sql } from "drizzle-orm";
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
    // Enforced here rather than trusted from producers: openNotificationAction
    // hands this straight to redirect(), where an absolute URL would send the
    // guest off the site. A single leading slash is not enough — "//host/x" and
    // "/\\host/x" are resolved by browsers as absolute URLs elsewhere.
    if (!/^\/(?![/\\])/.test(data.url)) {
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

  async markAllRead(guestId: string, readAt: Date): Promise<void> {
    this.db
      .update(schema.notifications)
      .set({ readAt: readAt.toISOString() })
      .where(
        and(
          eq(schema.notifications.guestId, guestId),
          isNull(schema.notifications.readAt)
        )
      )
      .run();
  }
}
