import { and, eq, gte, isNotNull, lte } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type { Day, DaysRepository } from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

function rowToDay(row: typeof schema.days.$inferSelect): Day {
  return {
    id: row.id,
    start: new Date(row.start),
    end: new Date(row.end),
    startBookings: new Date(row.startBookings),
    endBookings: new Date(row.endBookings),
    eventId: row.eventId,
  };
}

export class SqliteDaysRepository implements DaysRepository {
  constructor(private readonly db: DB) {}

  async list(): Promise<Day[]> {
    const rows = this.db.select().from(schema.days).all();
    return rows
      .map(rowToDay)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  async listByEvent(eventId: string): Promise<Day[]> {
    const rows = this.db
      .select()
      .from(schema.days)
      .where(eq(schema.days.eventId, eventId))
      .all();
    return rows
      .map(rowToDay)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  async findById(id: string): Promise<Day | undefined> {
    const row = this.db
      .select()
      .from(schema.days)
      .where(eq(schema.days.id, id))
      .get();
    return row ? rowToDay(row) : undefined;
  }

  async create(data: Omit<Day, "id">): Promise<Day> {
    const id = nanoid();
    this.db
      .insert(schema.days)
      .values({
        id,
        start: data.start.toISOString(),
        end: data.end.toISOString(),
        startBookings: data.startBookings.toISOString(),
        endBookings: data.endBookings.toISOString(),
        eventId: data.eventId,
      })
      .run();
    return { id, ...data };
  }

  async update(
    id: string,
    patch: Partial<Omit<Day, "id" | "eventId">>
  ): Promise<Day | undefined> {
    if (!(await this.findById(id))) {
      return undefined;
    }

    const set: Partial<typeof schema.days.$inferInsert> = {};
    if (patch.start !== undefined) {
      set.start = patch.start.toISOString();
    }
    if (patch.end !== undefined) {
      set.end = patch.end.toISOString();
    }
    if (patch.startBookings !== undefined) {
      set.startBookings = patch.startBookings.toISOString();
    }
    if (patch.endBookings !== undefined) {
      set.endBookings = patch.endBookings.toISOString();
    }

    if (Object.keys(set).length > 0) {
      this.db.update(schema.days).set(set).where(eq(schema.days.id, id)).run();
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const day = await this.findById(id);
    if (!day) {
      return;
    }

    this.db.transaction((tx) => {
      // Delete sessions whose start AND end times fall within the day window.
      // Sessions without scheduled times are excluded (null check).
      if (day.eventId) {
        tx.delete(schema.sessions)
          .where(
            and(
              eq(schema.sessions.eventId, day.eventId),
              isNotNull(schema.sessions.startTime),
              isNotNull(schema.sessions.endTime),
              gte(schema.sessions.startTime, day.start.toISOString()),
              lte(schema.sessions.endTime, day.end.toISOString())
            )
          )
          .run();
      }

      tx.delete(schema.days).where(eq(schema.days.id, id)).run();
    });
  }
}
