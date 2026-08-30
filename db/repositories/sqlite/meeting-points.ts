import { asc, eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type { MeetingPoint, MeetingPointsRepository } from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

function rowToPoint(
  row: typeof schema.meetingPoints.$inferSelect
): MeetingPoint {
  return {
    id: row.id,
    eventId: row.eventId,
    name: row.name,
    description: row.description,
    sortIndex: row.sortIndex,
  };
}

export class SqliteMeetingPointsRepository implements MeetingPointsRepository {
  constructor(private readonly db: DB) {}

  async listByEvent(eventId: string): Promise<MeetingPoint[]> {
    return this.db
      .select()
      .from(schema.meetingPoints)
      .where(eq(schema.meetingPoints.eventId, eventId))
      .orderBy(
        asc(schema.meetingPoints.sortIndex),
        asc(schema.meetingPoints.id)
      )
      .all()
      .map(rowToPoint);
  }

  async create(data: Omit<MeetingPoint, "id">): Promise<MeetingPoint> {
    const row = { id: nanoid(), ...data };
    this.db.insert(schema.meetingPoints).values(row).run();
    return rowToPoint(row);
  }

  async update(
    id: string,
    patch: Partial<Omit<MeetingPoint, "id" | "eventId">>
  ): Promise<MeetingPoint | undefined> {
    const values: Partial<typeof schema.meetingPoints.$inferInsert> = {};
    if (patch.name !== undefined) values.name = patch.name;
    if (patch.description !== undefined) values.description = patch.description;
    if (patch.sortIndex !== undefined) values.sortIndex = patch.sortIndex;
    if (Object.keys(values).length > 0) {
      this.db
        .update(schema.meetingPoints)
        .set(values)
        .where(eq(schema.meetingPoints.id, id))
        .run();
    }
    const row = this.db
      .select()
      .from(schema.meetingPoints)
      .where(eq(schema.meetingPoints.id, id))
      .get();
    return row ? rowToPoint(row) : undefined;
  }

  async delete(id: string): Promise<void> {
    this.db
      .delete(schema.meetingPoints)
      .where(eq(schema.meetingPoints.id, id))
      .run();
  }
}
