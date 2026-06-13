import { and, eq, sql } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type { Location, LocationsRepository } from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

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
    this.db.transaction((tx) => {
      tx.delete(schema.sessionLocations)
        .where(eq(schema.sessionLocations.locationId, id))
        .run();
      tx.delete(schema.eventLocations)
        .where(eq(schema.eventLocations.locationId, id))
        .run();
      tx.delete(schema.locations).where(eq(schema.locations.id, id)).run();
    });
  }

  async countSessionLinks(id: string): Promise<number> {
    const row = this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.sessionLocations)
      .where(eq(schema.sessionLocations.locationId, id))
      .get();
    return row?.count ?? 0;
  }

  async listEventIds(id: string): Promise<string[]> {
    return this.db
      .select({ eventId: schema.eventLocations.eventId })
      .from(schema.eventLocations)
      .where(eq(schema.eventLocations.locationId, id))
      .all()
      .map((r) => r.eventId);
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
