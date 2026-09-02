import { and, asc, eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../../schema";
import type { MeetingAvailabilityRepository } from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

export class SqliteMeetingAvailabilityRepository implements MeetingAvailabilityRepository {
  constructor(private readonly db: DB) {}

  async listByGuestAndEvent(guestId: string, eventId: string): Promise<Date[]> {
    return this.db
      .select({ slotStart: schema.meetingAvailability.slotStart })
      .from(schema.meetingAvailability)
      .where(
        and(
          eq(schema.meetingAvailability.eventId, eventId),
          eq(schema.meetingAvailability.guestId, guestId)
        )
      )
      .orderBy(asc(schema.meetingAvailability.slotStart))
      .all()
      .map((row) => new Date(row.slotStart));
  }

  // Delete-then-insert in one transaction: the form submits the whole set, so
  // a partial write would leave a guest bookable at slots they just cleared.
  async replaceForGuest(
    guestId: string,
    eventId: string,
    slotStarts: Date[]
  ): Promise<void> {
    this.db.transaction((tx) => {
      tx.delete(schema.meetingAvailability)
        .where(
          and(
            eq(schema.meetingAvailability.eventId, eventId),
            eq(schema.meetingAvailability.guestId, guestId)
          )
        )
        .run();
      // Serialised here rather than by callers: booking compares a meeting's
      // slot with these rows as text, so one format has to win.
      const unique = [...new Set(slotStarts.map((slot) => slot.toISOString()))];
      if (unique.length === 0) return;
      tx.insert(schema.meetingAvailability)
        .values(unique.map((slotStart) => ({ eventId, guestId, slotStart })))
        .run();
    });
  }

  async deleteByEvent(eventId: string): Promise<void> {
    this.db
      .delete(schema.meetingAvailability)
      .where(eq(schema.meetingAvailability.eventId, eventId))
      .run();
  }
}
