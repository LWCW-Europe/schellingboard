import { and, eq, inArray } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type { Rsvp, RsvpsRepository } from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

function rowToRsvp(row: typeof schema.rsvps.$inferSelect): Rsvp {
  return { id: row.id, sessionId: row.sessionId, guestId: row.guestId };
}

export class SqliteRsvpsRepository implements RsvpsRepository {
  constructor(private readonly db: DB) {}

  async listByGuest(guestId: string): Promise<Rsvp[]> {
    return this.db
      .select()
      .from(schema.rsvps)
      .where(eq(schema.rsvps.guestId, guestId))
      .all()
      .map(rowToRsvp);
  }

  async listBySession(sessionId: string): Promise<Rsvp[]> {
    return this.db
      .select()
      .from(schema.rsvps)
      .where(eq(schema.rsvps.sessionId, sessionId))
      .all()
      .map(rowToRsvp);
  }

  async listBySessions(sessionIds: string[]): Promise<Map<string, Rsvp[]>> {
    const result = new Map<string, Rsvp[]>(sessionIds.map((id) => [id, []]));
    if (sessionIds.length === 0) return result;
    const rows = this.db
      .select()
      .from(schema.rsvps)
      .where(inArray(schema.rsvps.sessionId, sessionIds))
      .all();
    for (const row of rows) result.get(row.sessionId)?.push(rowToRsvp(row));
    return result;
  }

  async create(data: { sessionId: string; guestId: string }): Promise<Rsvp> {
    this.db
      .insert(schema.rsvps)
      .values({ id: nanoid(), ...data })
      .onConflictDoNothing({
        target: [schema.rsvps.sessionId, schema.rsvps.guestId],
      })
      .run();
    const row = this.db
      .select()
      .from(schema.rsvps)
      .where(
        and(
          eq(schema.rsvps.sessionId, data.sessionId),
          eq(schema.rsvps.guestId, data.guestId)
        )
      )
      .get();
    if (!row) throw new Error("Failed to create RSVP");
    return rowToRsvp(row);
  }

  // Runs as a synchronous better-sqlite3 transaction: since Node is
  // single-threaded and none of the calls below await, no other request can
  // interleave between the capacity check and the insert.
  async createIfUnderCapacity(data: {
    sessionId: string;
    guestId: string;
    capacity: number;
  }): Promise<Rsvp | null> {
    return this.db.transaction((tx) => {
      const rows = tx
        .select()
        .from(schema.rsvps)
        .where(eq(schema.rsvps.sessionId, data.sessionId))
        .all();
      const existing = rows.find((row) => row.guestId === data.guestId);
      if (existing) return rowToRsvp(existing);
      if (rows.length >= data.capacity) return null;

      const row = {
        id: nanoid(),
        sessionId: data.sessionId,
        guestId: data.guestId,
      };
      tx.insert(schema.rsvps).values(row).run();
      return rowToRsvp(row);
    });
  }

  async deleteBySessionAndGuest(
    sessionId: string,
    guestId: string
  ): Promise<void> {
    this.db
      .delete(schema.rsvps)
      .where(
        and(
          eq(schema.rsvps.sessionId, sessionId),
          eq(schema.rsvps.guestId, guestId)
        )
      )
      .run();
  }

  async deleteBySessionAndGuests(
    sessionId: string,
    guestIds: string[]
  ): Promise<void> {
    if (guestIds.length === 0) return;
    this.db
      .delete(schema.rsvps)
      .where(
        and(
          eq(schema.rsvps.sessionId, sessionId),
          inArray(schema.rsvps.guestId, guestIds)
        )
      )
      .run();
  }
}
