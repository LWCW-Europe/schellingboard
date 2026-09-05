import { eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type {
  PushRepository,
  PushSubscription,
  VapidKeys,
} from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

// One instance has one pair, so the row needs a name rather than an id.
const VAPID_ROW = "vapid";

function rowToSubscription(
  row: typeof schema.pushSubscriptions.$inferSelect
): PushSubscription {
  return {
    id: row.id,
    guestId: row.guestId,
    endpoint: row.endpoint,
    p256dh: row.p256dh,
    auth: row.auth,
    createdAt: new Date(row.createdAt),
  };
}

export class SqlitePushRepository implements PushRepository {
  constructor(private readonly db: DB) {}

  async listSubscriptions(guestId: string): Promise<PushSubscription[]> {
    return this.db
      .select()
      .from(schema.pushSubscriptions)
      .where(eq(schema.pushSubscriptions.guestId, guestId))
      .all()
      .map(rowToSubscription);
  }

  async findSubscription(
    endpoint: string
  ): Promise<PushSubscription | undefined> {
    const row = this.db
      .select()
      .from(schema.pushSubscriptions)
      .where(eq(schema.pushSubscriptions.endpoint, endpoint))
      .get();
    return row ? rowToSubscription(row) : undefined;
  }

  async saveSubscription(data: Omit<PushSubscription, "id">): Promise<void> {
    const row = {
      id: nanoid(),
      ...data,
      createdAt: data.createdAt.toISOString(),
    };
    this.db
      .insert(schema.pushSubscriptions)
      .values(row)
      .onConflictDoUpdate({
        target: schema.pushSubscriptions.endpoint,
        // Not createdAt: a device re-subscribing keeps the date it was first
        // turned on, so the column means what its name says.
        set: { guestId: row.guestId, p256dh: row.p256dh, auth: row.auth },
      })
      .run();
  }

  async deleteSubscription(endpoint: string): Promise<void> {
    this.db
      .delete(schema.pushSubscriptions)
      .where(eq(schema.pushSubscriptions.endpoint, endpoint))
      .run();
  }

  async vapidKeys(generate: () => VapidKeys): Promise<VapidKeys> {
    const existing = this.db
      .select()
      .from(schema.pushKeys)
      .where(eq(schema.pushKeys.id, VAPID_ROW))
      .get();
    if (existing)
      return { publicKey: existing.publicKey, privateKey: existing.privateKey };

    const generated = generate();
    // Two requests can reach an unkeyed instance at once. Whoever inserts
    // first wins and the loser reads that pair back, so the keys a browser
    // was handed always match the ones the server signs with.
    this.db
      .insert(schema.pushKeys)
      .values({
        id: VAPID_ROW,
        ...generated,
        createdAt: new Date().toISOString(),
      })
      .onConflictDoNothing()
      .run();
    const stored = this.db
      .select()
      .from(schema.pushKeys)
      .where(eq(schema.pushKeys.id, VAPID_ROW))
      .get();
    if (!stored) throw new Error("VAPID keys vanished after generating them");
    return { publicKey: stored.publicKey, privateKey: stored.privateKey };
  }
}
