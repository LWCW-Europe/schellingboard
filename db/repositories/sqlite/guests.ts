import { and, eq, inArray } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type { Guest, GuestsRepository, CompleteGuest } from "../interfaces";
import { sanitizeGuest } from "@/utils/guests";

type DB = BetterSQLite3Database<typeof schema>;

function rowToGuest(row: typeof schema.guests.$inferSelect): CompleteGuest {
  return { id: row.id, name: row.name, info: { email: row.email } };
}

export class SqliteGuestsRepository implements GuestsRepository {
  constructor(private readonly db: DB) {}

  async list(): Promise<Guest[]> {
    return (await this.listFull()).map(sanitizeGuest);
  }

  async listFull(): Promise<CompleteGuest[]> {
    return this.db.select().from(schema.guests).all().map(rowToGuest);
  }

  async listByEvent(eventId: string): Promise<Guest[]> {
    const rows = this.db
      .select({
        id: schema.guests.id,
        name: schema.guests.name,
      })
      .from(schema.guests)
      .innerJoin(
        schema.eventGuests,
        eq(schema.guests.id, schema.eventGuests.guestId)
      )
      .where(eq(schema.eventGuests.eventId, eventId))
      .all()
      .map((row) => row as Guest);
    return rows;
  }

  async findById(id: string): Promise<CompleteGuest | undefined> {
    const row = this.db
      .select()
      .from(schema.guests)
      .where(eq(schema.guests.id, id))
      .get();
    return row ? rowToGuest(row) : undefined;
  }

  async findByEmail(email: string): Promise<CompleteGuest | undefined> {
    const row = this.db
      .select()
      .from(schema.guests)
      .where(eq(schema.guests.email, email))
      .get();
    return row ? rowToGuest(row) : undefined;
  }

  async create(data: Omit<CompleteGuest, "id">): Promise<CompleteGuest> {
    const id = nanoid();
    const {
      name,
      info: { email },
    } = data;

    this.db.insert(schema.guests).values({ id, name, email }).run();
    return { id, ...data };
  }

  async update(
    id: string,
    data: Omit<CompleteGuest, "id">
  ): Promise<CompleteGuest | undefined> {
    const {
      name,
      info: { email },
    } = data;

    const result = this.db
      .update(schema.guests)
      .set({ name, email })
      .where(eq(schema.guests.id, id))
      .run();
    if (result.changes === 0) return undefined;
    return { id, ...data };
  }

  async assignToEvent(eventId: string, guestIds: string[]): Promise<void> {
    if (guestIds.length === 0) return;
    this.db
      .insert(schema.eventGuests)
      .values(guestIds.map((guestId) => ({ eventId, guestId })))
      .onConflictDoNothing()
      .run();
  }

  async removeFromEvent(eventId: string, guestIds: string[]): Promise<void> {
    if (guestIds.length === 0) return;
    this.db
      .delete(schema.eventGuests)
      .where(
        and(
          eq(schema.eventGuests.eventId, eventId),
          inArray(schema.eventGuests.guestId, guestIds)
        )
      )
      .run();
  }

  async delete(id: string): Promise<void> {
    // votes, rsvps, proposal_hosts, session_hosts and event_guests are removed
    // by ON DELETE CASCADE.
    this.db.delete(schema.guests).where(eq(schema.guests.id, id)).run();
  }
}
