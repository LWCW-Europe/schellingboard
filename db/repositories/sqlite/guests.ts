import {
  and,
  eq,
  exists,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type {
  CompleteGuest,
  EventGuestPage,
  Guest,
  GuestsRepository,
  GuestPage,
  ParticipantPage,
  Participant,
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
    pronouns: row.pronouns,
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

  async searchForParticipants(opts: {
    query?: string;
    host?: boolean;
    limit: number;
    offset: number;
  }): Promise<ParticipantPage> {
    let where = undefined;
    if (opts.query) {
      const pattern = `%${escapeLike(opts.query)}%`;
      where = sql`${schema.guests.name} like ${pattern} escape '\\'`;
    }

    const isHostExpr = exists(
      this.db
        .select({ one: sql`1` })
        .from(schema.sessionHosts)
        .where(eq(schema.sessionHosts.guestId, schema.guests.id))
    );

    if (opts.host) {
      where = and(where, isHostExpr);
    }

    const totalRow = this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.guests)
      .where(where)
      .get();

    const rows = this.db
      .select({
        id: schema.guests.id,
        name: schema.guests.name,
        aboutMe: schema.guests.aboutMe,
        avatarUrl: schema.guests.avatarUrl,
        pronouns: schema.guests.pronouns,
        // SQLite has no boolean type; this yields 0/1 at runtime despite the
        // sql<boolean> annotation, so coerce explicitly below.
        isHost: opts.host ? sql<boolean>`true` : isHostExpr,
      })
      .from(schema.guests)
      .where(where)
      // id as tiebreaker: name is not unique, and without a deterministic
      // order LIMIT/OFFSET pagination can duplicate or skip rows.
      .orderBy(schema.guests.name, schema.guests.id)
      .limit(opts.limit)
      .offset(opts.offset)
      .all()
      .map((row) => ({ ...row, isHost: Boolean(row.isHost) }) as Participant);

    return { rows, total: totalRow?.count ?? 0 };
  }

  async listEventsByGuests(
    guestIds: string[]
  ): Promise<Map<string, { id: string; name: string }[]>> {
    const result = new Map<string, { id: string; name: string }[]>(
      guestIds.map((id) => [id, []])
    );
    if (guestIds.length === 0) return result;
    const rows = this.db
      .select({
        guestId: schema.eventGuests.guestId,
        eventId: schema.events.id,
        eventName: schema.events.name,
      })
      .from(schema.eventGuests)
      .innerJoin(
        schema.events,
        eq(schema.eventGuests.eventId, schema.events.id)
      )
      .where(inArray(schema.eventGuests.guestId, guestIds))
      .orderBy(schema.events.name, schema.events.id)
      .all();
    for (const row of rows) {
      result.get(row.guestId)?.push({ id: row.eventId, name: row.eventName });
    }
    return result;
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
      .where(sql`lower(${schema.guests.email}) = lower(${email})`)
      .get();
    return row ? rowToGuest(row) : undefined;
  }

  async findByEmails(emails: string[]): Promise<CompleteGuest[]> {
    if (emails.length === 0) return [];
    const lowered = emails.map((e) => e.toLowerCase());
    return this.db
      .select()
      .from(schema.guests)
      .where(inArray(sql`lower(${schema.guests.email})`, lowered))
      .all()
      .map(rowToGuest);
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

  async findOrCreateByEmail(
    data: Omit<CompleteGuest, "id">
  ): Promise<{ guest: CompleteGuest; created: boolean }> {
    const id = nanoid();
    const {
      name,
      info: { email },
    } = data;

    // Atomic under concurrency: the unique index on lower(email) makes the
    // insert the single source of truth, instead of racing a prior read.
    const inserted = this.db
      .insert(schema.guests)
      .values({ id, name, email })
      .onConflictDoNothing()
      .returning()
      .all();
    if (inserted.length > 0) {
      return { guest: rowToGuest(inserted[0]), created: true };
    }

    const existing = await this.findByEmail(email);
    if (!existing) {
      throw new Error(
        `Guest insert conflicted but no existing row for email ${email}`
      );
    }
    return { guest: existing, created: false };
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
    data: Pick<Guest, "name" | "aboutMe" | "avatarUrl" | "pronouns">
  ): Promise<CompleteGuest | undefined> {
    const result = this.db
      .update(schema.guests)
      .set({
        name: data.name,
        aboutMe: data.aboutMe,
        avatarUrl: data.avatarUrl,
        pronouns: data.pronouns,
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

  async importAndAssign(
    rows: { name: string; email: string }[],
    eventIds: string[]
  ): Promise<{ created: number }> {
    let created = 0;
    this.db.transaction((tx) => {
      const existingByEmail = new Map(
        (rows.length === 0
          ? []
          : tx
              .select()
              .from(schema.guests)
              .where(
                inArray(
                  sql`lower(${schema.guests.email})`,
                  rows.map((r) => r.email.toLowerCase())
                )
              )
              .all()
              .map(rowToGuest)
        ).map((g) => [g.info.email.toLowerCase(), g])
      );

      const guestIds: string[] = [];
      for (const row of rows) {
        const existing = existingByEmail.get(row.email.toLowerCase());
        if (existing) {
          guestIds.push(existing.id);
        } else {
          const id = nanoid();
          tx.insert(schema.guests)
            .values({ id, name: row.name, email: row.email })
            .run();
          guestIds.push(id);
          created++;
        }
      }

      if (guestIds.length > 0) {
        for (const eventId of eventIds) {
          tx.insert(schema.eventGuests)
            .values(guestIds.map((guestId) => ({ eventId, guestId })))
            .onConflictDoNothing()
            .run();
        }
      }
    });

    return { created };
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
