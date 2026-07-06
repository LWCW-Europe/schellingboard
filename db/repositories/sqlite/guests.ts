import { and, eq, inArray, isNotNull, isNull, or, sql } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type {
  CompleteGuest,
  EventGuestPage,
  Guest,
  GuestPage,
  GuestsRepository,
} from "../interfaces";
import { sanitizeGuest } from "@/utils/guests";

type DB = BetterSQLite3Database<typeof schema>;

// Escape LIKE meta-characters so user input is matched literally. Pairs with an
// explicit `ESCAPE '\'` clause in the query below.
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

function rowToGuest(row: typeof schema.guests.$inferSelect): CompleteGuest {
  return {
    id: row.id,
    name: row.name,
    aboutMe: row.aboutMe,
    avatarUrl: row.avatarUrl,
    info: { email: row.email },
  };
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
        avatarUrl: schema.guests.avatarUrl,
        aboutMe: schema.guests.aboutMe,
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

  async search(opts: {
    query?: string;
    limit: number;
    offset: number;
  }): Promise<GuestPage> {
    let where = undefined;
    if (opts.query) {
      const pattern = `%${escapeLike(opts.query)}%`;
      where = or(
        sql`${schema.guests.name} like ${pattern} escape '\\'`,
        sql`${schema.guests.email} like ${pattern} escape '\\'`
      );
    }

    const totalRow = this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.guests)
      .where(where)
      .get();

    const rows = this.db
      .select()
      .from(schema.guests)
      .where(where)
      // id as tiebreaker: name is not unique, and without a deterministic
      // order LIMIT/OFFSET pagination can duplicate or skip rows.
      .orderBy(schema.guests.name, schema.guests.id)
      .limit(opts.limit)
      .offset(opts.offset)
      .all()
      .map(rowToGuest);

    return { rows, total: totalRow?.count ?? 0 };
  }

  async searchForEventAssignment(
    eventId: string,
    opts: {
      query?: string;
      assigned?: boolean;
      limit: number;
      offset: number;
    }
  ): Promise<EventGuestPage> {
    // A guest is "assigned" when the event-scoped left join matches a row.
    const joinCondition = and(
      eq(schema.guests.id, schema.eventGuests.guestId),
      eq(schema.eventGuests.eventId, eventId)
    );

    const conditions = [];
    if (opts.assigned === true) {
      conditions.push(isNotNull(schema.eventGuests.guestId));
    } else if (opts.assigned === false) {
      conditions.push(isNull(schema.eventGuests.guestId));
    }
    if (opts.query) {
      const pattern = `%${escapeLike(opts.query)}%`;
      conditions.push(
        sql`((${schema.guests.name} like ${pattern} escape '\\') or (${schema.guests.email} like ${pattern} escape '\\'))`
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const totalRow = this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.guests)
      .leftJoin(schema.eventGuests, joinCondition)
      .where(where)
      .get();

    const rows = this.db
      .select({
        id: schema.guests.id,
        name: schema.guests.name,
        email: schema.guests.email,
        assigned: sql<number>`(${schema.eventGuests.guestId} is not null)`,
      })
      .from(schema.guests)
      .leftJoin(schema.eventGuests, joinCondition)
      .where(where)
      // id as tiebreaker: name is not unique, and without a deterministic
      // order LIMIT/OFFSET pagination can duplicate or skip rows.
      .orderBy(schema.guests.name, schema.guests.id)
      .limit(opts.limit)
      .offset(opts.offset)
      .all()
      .map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        assigned: Boolean(r.assigned),
      }));

    return { rows, total: totalRow?.count ?? 0 };
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
    data: Pick<CompleteGuest, "name" | "info">
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
    return this.findById(id);
  }

  async updateProfile(
    id: string,
    data: { name: string; aboutMe: string | null; avatarUrl: string | null }
  ): Promise<CompleteGuest | undefined> {
    const result = this.db
      .update(schema.guests)
      .set({
        name: data.name,
        aboutMe: data.aboutMe,
        avatarUrl: data.avatarUrl,
      })
      .where(eq(schema.guests.id, id))
      .run();
    if (result.changes === 0) return undefined;
    return this.findById(id);
  }

  async findExistingIds(ids: string[]): Promise<string[]> {
    if (ids.length === 0) return [];
    return this.db
      .select({ id: schema.guests.id })
      .from(schema.guests)
      .where(inArray(schema.guests.id, ids))
      .all()
      .map((r) => r.id);
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
