import {
  and,
  count,
  eq,
  exists,
  inArray,
  isNotNull,
  or,
  sql,
} from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type {
  Session,
  SessionCreateInput,
  SessionHost,
  SessionLocation,
  SessionPage,
  SessionsRepository,
  SessionUpdateInput,
} from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;
type SessionRow = typeof schema.sessions.$inferSelect;

// Escape LIKE meta-characters so user input is matched literally. Pairs with an
// explicit `ESCAPE '\'` clause in the query below.
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

function buildSessions(
  rows: SessionRow[],
  hostsBySession: Map<string, SessionHost[]>,
  locationsBySession: Map<string, SessionLocation[]>,
  rsvpCountBySession: Map<string, number>
): Session[] {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    startTime: row.startTime ? new Date(row.startTime) : undefined,
    endTime: row.endTime ? new Date(row.endTime) : undefined,
    capacity: row.capacity,
    adminManaged: row.adminManaged,
    blocker: row.blocker,
    closed: row.closed,
    proposalId: row.proposalId ?? undefined,
    eventId: row.eventId,
    hosts: hostsBySession.get(row.id) ?? [],
    locations: locationsBySession.get(row.id) ?? [],
    numRsvps: rsvpCountBySession.get(row.id) ?? 0,
  }));
}

export class SqliteSessionsRepository implements SessionsRepository {
  constructor(private readonly db: DB) {}

  private enrichSessions(rows: SessionRow[]): Session[] {
    if (rows.length === 0) return [];

    const ids = rows.map((r) => r.id);

    const hostRows = this.db
      .select({
        sessionId: schema.sessionHosts.sessionId,
        id: schema.guests.id,
        name: schema.guests.name,
      })
      .from(schema.sessionHosts)
      .innerJoin(
        schema.guests,
        eq(schema.sessionHosts.guestId, schema.guests.id)
      )
      .where(inArray(schema.sessionHosts.sessionId, ids))
      .all();

    const locationRows = this.db
      .select({
        sessionId: schema.sessionLocations.sessionId,
        id: schema.locations.id,
        name: schema.locations.name,
        color: schema.locations.color,
      })
      .from(schema.sessionLocations)
      .innerJoin(
        schema.locations,
        eq(schema.sessionLocations.locationId, schema.locations.id)
      )
      .where(inArray(schema.sessionLocations.sessionId, ids))
      .all();

    const rsvpRows = this.db
      .select({ sessionId: schema.rsvps.sessionId, cnt: count() })
      .from(schema.rsvps)
      .where(inArray(schema.rsvps.sessionId, ids))
      .groupBy(schema.rsvps.sessionId)
      .all();

    const hostsBySession = new Map<string, SessionHost[]>();
    for (const r of hostRows) {
      const list = hostsBySession.get(r.sessionId) ?? [];
      list.push({ id: r.id, name: r.name });
      hostsBySession.set(r.sessionId, list);
    }

    const locationsBySession = new Map<string, SessionLocation[]>();
    for (const r of locationRows) {
      const list = locationsBySession.get(r.sessionId) ?? [];
      list.push({ id: r.id, name: r.name, color: r.color });
      locationsBySession.set(r.sessionId, list);
    }

    const rsvpCountBySession = new Map<string, number>();
    for (const r of rsvpRows) {
      rsvpCountBySession.set(r.sessionId, r.cnt);
    }

    return buildSessions(
      rows,
      hostsBySession,
      locationsBySession,
      rsvpCountBySession
    );
  }

  async list(): Promise<Session[]> {
    const rows = this.db.select().from(schema.sessions).all();
    return this.enrichSessions(rows);
  }

  async listScheduled(): Promise<Session[]> {
    const rows = this.db
      .select()
      .from(schema.sessions)
      .where(
        and(
          isNotNull(schema.sessions.startTime),
          isNotNull(schema.sessions.endTime)
        )
      )
      .all();
    return this.enrichSessions(rows);
  }

  async listByEvent(eventId: string): Promise<Session[]> {
    const rows = this.db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.eventId, eventId))
      .all();
    return this.enrichSessions(rows);
  }

  async listScheduledByEvent(eventId: string): Promise<Session[]> {
    const rows = this.db
      .select()
      .from(schema.sessions)
      .where(
        and(
          eq(schema.sessions.eventId, eventId),
          isNotNull(schema.sessions.startTime),
          isNotNull(schema.sessions.endTime)
        )
      )
      .all();
    return this.enrichSessions(rows);
  }

  async listHostedByGuest(guestId: string): Promise<Session[]> {
    const rows = this.db
      .select({ session: schema.sessions })
      .from(schema.sessions)
      .innerJoin(
        schema.sessionHosts,
        eq(schema.sessionHosts.sessionId, schema.sessions.id)
      )
      .where(eq(schema.sessionHosts.guestId, guestId))
      .all()
      .map((r) => r.session);
    return this.enrichSessions(rows);
  }

  async listRsvpdByGuest(guestId: string): Promise<Session[]> {
    const rows = this.db
      .select({ session: schema.sessions })
      .from(schema.sessions)
      .innerJoin(schema.rsvps, eq(schema.rsvps.sessionId, schema.sessions.id))
      .where(eq(schema.rsvps.guestId, guestId))
      .all()
      .map((r) => r.session);
    return this.enrichSessions(rows);
  }

  async searchByEvent(
    eventId: string,
    opts: { query?: string; limit: number; offset: number }
  ): Promise<SessionPage> {
    const conditions = [eq(schema.sessions.eventId, eventId)];
    if (opts.query) {
      const pattern = `%${escapeLike(opts.query)}%`;
      // Match the title or any host's name.
      const hostMatch = exists(
        this.db
          .select({ one: sql`1` })
          .from(schema.sessionHosts)
          .innerJoin(
            schema.guests,
            eq(schema.sessionHosts.guestId, schema.guests.id)
          )
          .where(
            and(
              eq(schema.sessionHosts.sessionId, schema.sessions.id),
              sql`${schema.guests.name} like ${pattern} escape '\\'`
            )
          )
      );
      conditions.push(
        or(
          sql`${schema.sessions.title} like ${pattern} escape '\\'`,
          hostMatch
        )!
      );
    }
    const where = and(...conditions);

    const totalRow = this.db
      .select({ count: count() })
      .from(schema.sessions)
      .where(where)
      .get();

    const rows = this.db
      .select()
      .from(schema.sessions)
      .where(where)
      // id as tiebreaker: title is not unique, and without a deterministic
      // order LIMIT/OFFSET pagination can duplicate or skip rows.
      .orderBy(schema.sessions.title, schema.sessions.id)
      .limit(opts.limit)
      .offset(opts.offset)
      .all();

    return { rows: this.enrichSessions(rows), total: totalRow?.count ?? 0 };
  }

  async findById(id: string): Promise<Session | undefined> {
    const row = this.db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.id, id))
      .get();
    if (!row) return undefined;
    return this.enrichSessions([row])[0];
  }

  async create(data: SessionCreateInput): Promise<Session> {
    const id = nanoid();
    this.db.transaction((tx) => {
      tx.insert(schema.sessions)
        .values({
          id,
          title: data.title,
          description: data.description,
          startTime: data.startTime?.toISOString() ?? null,
          endTime: data.endTime?.toISOString() ?? null,
          capacity: data.capacity,
          adminManaged: data.adminManaged,
          blocker: data.blocker,
          closed: data.closed,
          proposalId: data.proposalId ?? null,
          eventId: data.eventId,
        })
        .run();

      for (const guestId of data.hostIds) {
        tx.insert(schema.sessionHosts).values({ sessionId: id, guestId }).run();
      }
      for (const locationId of data.locationIds) {
        tx.insert(schema.sessionLocations)
          .values({ sessionId: id, locationId })
          .run();
      }
    });
    return (await this.findById(id))!;
  }

  async update(id: string, patch: SessionUpdateInput): Promise<Session> {
    this.db.transaction((tx) => {
      const values: Partial<typeof schema.sessions.$inferInsert> = {};
      if (patch.title !== undefined) values.title = patch.title;
      if (patch.description !== undefined)
        values.description = patch.description;
      if ("startTime" in patch)
        values.startTime = patch.startTime?.toISOString() ?? null;
      if ("endTime" in patch)
        values.endTime = patch.endTime?.toISOString() ?? null;
      if (patch.capacity !== undefined) values.capacity = patch.capacity;
      if (patch.adminManaged !== undefined)
        values.adminManaged = patch.adminManaged;
      if (patch.blocker !== undefined) values.blocker = patch.blocker;
      if (patch.closed !== undefined) values.closed = patch.closed;
      if ("proposalId" in patch) values.proposalId = patch.proposalId ?? null;
      if (patch.eventId !== undefined) values.eventId = patch.eventId;

      if (Object.keys(values).length > 0) {
        tx.update(schema.sessions)
          .set(values)
          .where(eq(schema.sessions.id, id))
          .run();
      }

      if (patch.hostIds !== undefined) {
        tx.delete(schema.sessionHosts)
          .where(eq(schema.sessionHosts.sessionId, id))
          .run();
        for (const guestId of patch.hostIds) {
          tx.insert(schema.sessionHosts)
            .values({ sessionId: id, guestId })
            .run();
        }
        // Hosts don't RSVP to their own session, so an RSVP'd guest who
        // becomes a host loses their RSVP.
        if (patch.hostIds.length > 0) {
          tx.delete(schema.rsvps)
            .where(
              and(
                eq(schema.rsvps.sessionId, id),
                inArray(schema.rsvps.guestId, patch.hostIds)
              )
            )
            .run();
        }
      }

      if (patch.locationIds !== undefined) {
        tx.delete(schema.sessionLocations)
          .where(eq(schema.sessionLocations.sessionId, id))
          .run();
        for (const locationId of patch.locationIds) {
          tx.insert(schema.sessionLocations)
            .values({ sessionId: id, locationId })
            .run();
        }
      }
    });
    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    // rsvps, session_hosts and session_locations are removed by ON DELETE
    // CASCADE.
    this.db.delete(schema.sessions).where(eq(schema.sessions.id, id)).run();
  }

  async findLocationConflict(
    eventId: string,
    start: Date,
    end: Date,
    locationIds: string[],
    excludeId?: string
  ): Promise<{ id: string; title: string } | undefined> {
    if (locationIds.length === 0) return undefined;

    const conditions = [
      eq(schema.sessions.eventId, eventId),
      isNotNull(schema.sessions.startTime),
      isNotNull(schema.sessions.endTime),
      sql`${schema.sessions.startTime} < ${end.toISOString()}`,
      sql`${schema.sessions.endTime} > ${start.toISOString()}`,
      exists(
        this.db
          .select({ one: sql`1` })
          .from(schema.sessionLocations)
          .where(
            and(
              eq(schema.sessionLocations.sessionId, schema.sessions.id),
              inArray(schema.sessionLocations.locationId, locationIds)
            )
          )
      ),
    ];
    if (excludeId) conditions.push(sql`${schema.sessions.id} != ${excludeId}`);

    const row = this.db
      .select({ id: schema.sessions.id, title: schema.sessions.title })
      .from(schema.sessions)
      .where(and(...conditions))
      .limit(1)
      .get();
    return row ?? undefined;
  }
}
