import { and, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type {
  EventLocationPage,
  Location,
  LocationsRepository,
} from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

// Escape LIKE meta-characters so user input is matched literally. Pairs with an
// explicit `ESCAPE '\'` clause in the query below.
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

function rowToLocation(row: typeof schema.locations.$inferSelect): Location {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.imageUrl,
    description: row.description,
    capacity: row.capacity,
    color: row.color,
    hidden: row.hidden,
    bookable: row.bookable,
    sortIndex: row.sortIndex,
    areaDescription: row.areaDescription ?? undefined,
  };
}

export class SqliteLocationsRepository implements LocationsRepository {
  constructor(private readonly db: DB) {}

  async list(): Promise<Location[]> {
    return this.db
      .select()
      .from(schema.locations)
      .orderBy(schema.locations.sortIndex, schema.locations.id)
      .all()
      .map(rowToLocation);
  }

  async searchForEventAssignment(
    eventId: string,
    opts: {
      query?: string;
      assigned?: boolean;
      limit: number;
      offset: number;
    }
  ): Promise<EventLocationPage> {
    // A location is "assigned" when the event-scoped left join matches a row.
    const joinCondition = and(
      eq(schema.locations.id, schema.eventLocations.locationId),
      eq(schema.eventLocations.eventId, eventId)
    );

    const conditions = [];
    if (opts.assigned === true) {
      conditions.push(isNotNull(schema.eventLocations.locationId));
    } else if (opts.assigned === false) {
      conditions.push(isNull(schema.eventLocations.locationId));
    }
    if (opts.query) {
      const pattern = `%${escapeLike(opts.query)}%`;
      conditions.push(
        sql`${schema.locations.name} like ${pattern} escape '\\'`
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const totalRow = this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.locations)
      .leftJoin(schema.eventLocations, joinCondition)
      .where(where)
      .get();

    const rows = this.db
      .select({
        id: schema.locations.id,
        name: schema.locations.name,
        capacity: schema.locations.capacity,
        assigned: sql<number>`(${schema.eventLocations.locationId} is not null)`,
      })
      .from(schema.locations)
      .leftJoin(schema.eventLocations, joinCondition)
      .where(where)
      // id as tiebreaker: name is not unique, and without a deterministic
      // order LIMIT/OFFSET pagination can duplicate or skip rows.
      .orderBy(schema.locations.name, schema.locations.id)
      .limit(opts.limit)
      .offset(opts.offset)
      .all()
      .map((r) => ({
        id: r.id,
        name: r.name,
        capacity: r.capacity,
        assigned: Boolean(r.assigned),
      }));

    return { rows, total: totalRow?.count ?? 0 };
  }

  async listVisible(): Promise<Location[]> {
    return this.db
      .select()
      .from(schema.locations)
      .where(eq(schema.locations.hidden, false))
      .orderBy(schema.locations.sortIndex)
      .all()
      .map(rowToLocation);
  }

  async listBookable(): Promise<Location[]> {
    return this.db
      .select()
      .from(schema.locations)
      .where(
        and(
          eq(schema.locations.hidden, false),
          eq(schema.locations.bookable, true)
        )
      )
      .orderBy(schema.locations.sortIndex)
      .all()
      .map(rowToLocation);
  }

  async findById(id: string): Promise<Location | undefined> {
    const row = this.db
      .select()
      .from(schema.locations)
      .where(eq(schema.locations.id, id))
      .get();
    return row ? rowToLocation(row) : undefined;
  }

  async create(data: Omit<Location, "id">): Promise<Location> {
    const id = nanoid();
    this.db
      .insert(schema.locations)
      .values({
        id,
        name: data.name,
        imageUrl: data.imageUrl,
        description: data.description,
        capacity: data.capacity,
        color: data.color,
        hidden: data.hidden,
        bookable: data.bookable,
        sortIndex: data.sortIndex,
        areaDescription: data.areaDescription ?? null,
      })
      .run();
    return { id, ...data };
  }

  async update(
    id: string,
    data: Omit<Location, "id">
  ): Promise<Location | undefined> {
    const result = this.db
      .update(schema.locations)
      .set({ ...data, areaDescription: data.areaDescription ?? null })
      .where(eq(schema.locations.id, id))
      .run();
    if (result.changes === 0) return undefined;
    return { id, ...data };
  }

  async delete(id: string): Promise<void> {
    // session_locations and event_locations are removed by ON DELETE CASCADE.
    this.db.delete(schema.locations).where(eq(schema.locations.id, id)).run();
  }

  async countSessionLinks(id: string): Promise<number> {
    const row = this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.sessionLocations)
      .where(eq(schema.sessionLocations.locationId, id))
      .get();
    return row?.count ?? 0;
  }

  async countSessionLinksByLocations(
    ids: string[]
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>(ids.map((id) => [id, 0]));
    if (ids.length === 0) return result;
    const rows = this.db
      .select({
        locationId: schema.sessionLocations.locationId,
        count: sql<number>`count(*)`,
      })
      .from(schema.sessionLocations)
      .where(inArray(schema.sessionLocations.locationId, ids))
      .groupBy(schema.sessionLocations.locationId)
      .all();
    for (const row of rows) result.set(row.locationId, row.count);
    return result;
  }

  async listEventIds(id: string): Promise<string[]> {
    return this.db
      .select({ eventId: schema.eventLocations.eventId })
      .from(schema.eventLocations)
      .where(eq(schema.eventLocations.locationId, id))
      .all()
      .map((r) => r.eventId);
  }

  async listEventIdsByLocations(ids: string[]): Promise<Map<string, string[]>> {
    const result = new Map<string, string[]>(ids.map((id) => [id, []]));
    if (ids.length === 0) return result;
    const rows = this.db
      .select({
        locationId: schema.eventLocations.locationId,
        eventId: schema.eventLocations.eventId,
      })
      .from(schema.eventLocations)
      .where(inArray(schema.eventLocations.locationId, ids))
      .all();
    for (const row of rows) result.get(row.locationId)?.push(row.eventId);
    return result;
  }

  async listLocationIdsByEvent(eventId: string): Promise<string[]> {
    return this.db
      .select({ locationId: schema.eventLocations.locationId })
      .from(schema.eventLocations)
      .where(eq(schema.eventLocations.eventId, eventId))
      .all()
      .map((r) => r.locationId);
  }

  async setEventIds(id: string, eventIds: string[]): Promise<void> {
    this.db.transaction((tx) => {
      tx.delete(schema.eventLocations)
        .where(eq(schema.eventLocations.locationId, id))
        .run();
      for (const eventId of eventIds) {
        tx.insert(schema.eventLocations)
          .values({ eventId, locationId: id })
          .run();
      }
    });
  }

  async findExistingIds(ids: string[]): Promise<string[]> {
    if (ids.length === 0) return [];
    return this.db
      .select({ id: schema.locations.id })
      .from(schema.locations)
      .where(inArray(schema.locations.id, ids))
      .all()
      .map((r) => r.id);
  }

  async assignToEvent(eventId: string, locationIds: string[]): Promise<void> {
    if (locationIds.length === 0) return;
    this.db
      .insert(schema.eventLocations)
      .values(locationIds.map((locationId) => ({ eventId, locationId })))
      .onConflictDoNothing()
      .run();
  }

  async removeFromEvent(eventId: string, locationIds: string[]): Promise<void> {
    if (locationIds.length === 0) return;
    this.db
      .delete(schema.eventLocations)
      .where(
        and(
          eq(schema.eventLocations.eventId, eventId),
          inArray(schema.eventLocations.locationId, locationIds)
        )
      )
      .run();
  }

  async move(id: string, direction: "up" | "down"): Promise<boolean> {
    return this.db.transaction((tx) => {
      const ordered = tx
        .select({ id: schema.locations.id })
        .from(schema.locations)
        .orderBy(schema.locations.sortIndex, schema.locations.id)
        .all();
      const index = ordered.findIndex((l) => l.id === id);
      if (index === -1) return false;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= ordered.length) return false;
      [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
      ordered.forEach((l, sortIndex) => {
        tx.update(schema.locations)
          .set({ sortIndex })
          .where(eq(schema.locations.id, l.id))
          .run();
      });
      return true;
    });
  }
}
