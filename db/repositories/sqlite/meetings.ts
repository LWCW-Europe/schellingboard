import { and, asc, count, eq, gt, inArray, or } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type {
  Meeting,
  MeetingCreateInput,
  MeetingRequestOutcome,
  MeetingStatus,
  MeetingsRepository,
} from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

function rowToMeeting(row: typeof schema.meetings.$inferSelect): Meeting {
  return {
    id: row.id,
    eventId: row.eventId,
    requesterId: row.requesterId,
    recipientId: row.recipientId,
    slotStart: new Date(row.slotStart),
    slotEnd: new Date(row.slotEnd),
    meetingPoint: row.meetingPoint,
    message: row.message,
    cancelNote: row.cancelNote,
    status: row.status,
    createdAt: new Date(row.createdAt),
    respondedAt: row.respondedAt ? new Date(row.respondedAt) : undefined,
  };
}

// Instants are stored as ISO-8601 in UTC and nowhere else formatted, which is
// what makes ordering by the text column chronological and what lets a
// meeting's slot be compared with an availability row's.
function toRow(data: MeetingCreateInput) {
  return {
    id: nanoid(),
    eventId: data.eventId,
    requesterId: data.requesterId,
    recipientId: data.recipientId,
    slotStart: data.slotStart.toISOString(),
    slotEnd: data.slotEnd.toISOString(),
    meetingPoint: data.meetingPoint,
    message: data.message,
    cancelNote: "",
    status: "pending" as const,
    createdAt: data.createdAt.toISOString(),
    respondedAt: null,
  };
}

export class SqliteMeetingsRepository implements MeetingsRepository {
  constructor(private readonly db: DB) {}

  async findById(id: string): Promise<Meeting | undefined> {
    const row = this.db
      .select()
      .from(schema.meetings)
      .where(eq(schema.meetings.id, id))
      .get();
    return row ? rowToMeeting(row) : undefined;
  }

  async listByGuestAndEvent(
    guestId: string,
    eventId: string
  ): Promise<Meeting[]> {
    return this.db
      .select()
      .from(schema.meetings)
      .where(
        and(
          eq(schema.meetings.eventId, eventId),
          or(
            eq(schema.meetings.requesterId, guestId),
            eq(schema.meetings.recipientId, guestId)
          )
        )
      )
      .orderBy(asc(schema.meetings.slotStart), asc(schema.meetings.id))
      .all()
      .map(rowToMeeting);
  }

  async listLiveBySlot(eventId: string, slotStart: Date): Promise<Meeting[]> {
    return this.db
      .select()
      .from(schema.meetings)
      .where(
        and(
          eq(schema.meetings.eventId, eventId),
          eq(schema.meetings.slotStart, slotStart.toISOString()),
          inArray(schema.meetings.status, ["pending", "accepted"])
        )
      )
      .all()
      .map(rowToMeeting);
  }

  async countOpenByRequester(
    requesterId: string,
    eventId: string,
    now: Date
  ): Promise<number> {
    return this.countOpen(this.db, requesterId, eventId, now);
  }

  async create(data: MeetingCreateInput): Promise<Meeting> {
    const row = toRow(data);
    this.db.insert(schema.meetings).values(row).run();
    return rowToMeeting(row);
  }

  async createIfAllowed(
    data: MeetingCreateInput,
    cap: number,
    now: Date
  ): Promise<MeetingRequestOutcome> {
    return this.db.transaction((tx) => {
      if (this.hasLiveRequest(tx, data)) return { refused: "duplicate" };
      if (this.countOpen(tx, data.requesterId, data.eventId, now) >= cap) {
        return { refused: "cap" };
      }
      const row = toRow(data);
      tx.insert(schema.meetings).values(row).run();
      return { meeting: rowToMeeting(row) };
    });
  }

  async updateStatus(
    id: string,
    status: MeetingStatus,
    respondedAt: Date,
    from: MeetingStatus[],
    cancelNote?: string
  ): Promise<Meeting | undefined> {
    const result = this.db
      .update(schema.meetings)
      .set({
        status,
        respondedAt: respondedAt.toISOString(),
        ...(cancelNote === undefined ? {} : { cancelNote }),
      })
      .where(
        and(eq(schema.meetings.id, id), inArray(schema.meetings.status, from))
      )
      .run();
    return result.changes === 0 ? undefined : this.findById(id);
  }

  // The same pair and slot, still awaiting or holding an answer. Mirrors the
  // partial unique index, which stays as the backstop: this is what turns the
  // clash into a sentence the requester can act on.
  private hasLiveRequest(
    db: DB,
    data: Pick<Meeting, "eventId" | "requesterId" | "recipientId" | "slotStart">
  ): boolean {
    return (
      db
        .select({ id: schema.meetings.id })
        .from(schema.meetings)
        .where(
          and(
            eq(schema.meetings.eventId, data.eventId),
            eq(schema.meetings.requesterId, data.requesterId),
            eq(schema.meetings.recipientId, data.recipientId),
            eq(schema.meetings.slotStart, data.slotStart.toISOString()),
            inArray(schema.meetings.status, ["pending", "accepted"])
          )
        )
        .get() !== undefined
    );
  }

  // Shared by the plain count and the transactional create, so "outstanding"
  // means one thing: pending, and not yet in the past.
  private countOpen(
    db: DB,
    requesterId: string,
    eventId: string,
    now: Date
  ): number {
    const row = db
      .select({ open: count() })
      .from(schema.meetings)
      .where(
        and(
          eq(schema.meetings.eventId, eventId),
          eq(schema.meetings.requesterId, requesterId),
          eq(schema.meetings.status, "pending"),
          gt(schema.meetings.slotStart, now.toISOString())
        )
      )
      .get();
    return row?.open ?? 0;
  }
}
