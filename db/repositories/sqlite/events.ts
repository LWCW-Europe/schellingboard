import { eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type { Event, EventsRepository } from "../interfaces";

type EventRow = typeof schema.events.$inferInsert;

type DB = BetterSQLite3Database<typeof schema>;

function rowToEvent(row: typeof schema.events.$inferSelect): Event {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    website: row.website,
    start: new Date(row.start),
    end: new Date(row.end),
    proposalPhaseStart: row.proposalPhaseStart
      ? new Date(row.proposalPhaseStart)
      : undefined,
    proposalPhaseEnd: row.proposalPhaseEnd
      ? new Date(row.proposalPhaseEnd)
      : undefined,
    votingPhaseStart: row.votingPhaseStart
      ? new Date(row.votingPhaseStart)
      : undefined,
    votingPhaseEnd: row.votingPhaseEnd
      ? new Date(row.votingPhaseEnd)
      : undefined,
    schedulingPhaseStart: row.schedulingPhaseStart
      ? new Date(row.schedulingPhaseStart)
      : undefined,
    schedulingPhaseEnd: row.schedulingPhaseEnd
      ? new Date(row.schedulingPhaseEnd)
      : undefined,
    maxSessionDuration: row.maxSessionDuration,
    timezone: row.timezone,
    icon: row.icon ?? undefined,
  };
}

export class SqliteEventsRepository implements EventsRepository {
  constructor(private readonly db: DB) {}

  async list(): Promise<Event[]> {
    return this.db.select().from(schema.events).all().map(rowToEvent);
  }

  async findById(id: string): Promise<Event | undefined> {
    const row = this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, id))
      .get();
    return row ? rowToEvent(row) : undefined;
  }

  async findByName(name: string): Promise<Event | undefined> {
    const row = this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.name, name))
      .get();
    return row ? rowToEvent(row) : undefined;
  }

  async create(data: Omit<Event, "id">): Promise<Event> {
    const id = nanoid();
    this.db
      .insert(schema.events)
      .values({
        id,
        name: data.name,
        description: data.description,
        website: data.website,
        start: data.start.toISOString(),
        end: data.end.toISOString(),
        proposalPhaseStart: data.proposalPhaseStart?.toISOString() ?? null,
        proposalPhaseEnd: data.proposalPhaseEnd?.toISOString() ?? null,
        votingPhaseStart: data.votingPhaseStart?.toISOString() ?? null,
        votingPhaseEnd: data.votingPhaseEnd?.toISOString() ?? null,
        schedulingPhaseStart: data.schedulingPhaseStart?.toISOString() ?? null,
        schedulingPhaseEnd: data.schedulingPhaseEnd?.toISOString() ?? null,
        maxSessionDuration: data.maxSessionDuration,
        timezone: data.timezone,
        icon: data.icon ?? null,
      })
      .run();
    return { id, ...data };
  }

  async update(
    id: string,
    patch: Partial<Omit<Event, "id">>
  ): Promise<Event | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const set: Partial<EventRow> = {};
    if (patch.name !== undefined) set.name = patch.name;
    if (patch.description !== undefined) set.description = patch.description;
    if (patch.website !== undefined) set.website = patch.website;
    if (patch.start !== undefined) set.start = patch.start.toISOString();
    if (patch.end !== undefined) set.end = patch.end.toISOString();
    if ("proposalPhaseStart" in patch)
      set.proposalPhaseStart = patch.proposalPhaseStart?.toISOString() ?? null;
    if ("proposalPhaseEnd" in patch)
      set.proposalPhaseEnd = patch.proposalPhaseEnd?.toISOString() ?? null;
    if ("votingPhaseStart" in patch)
      set.votingPhaseStart = patch.votingPhaseStart?.toISOString() ?? null;
    if ("votingPhaseEnd" in patch)
      set.votingPhaseEnd = patch.votingPhaseEnd?.toISOString() ?? null;
    if ("schedulingPhaseStart" in patch)
      set.schedulingPhaseStart =
        patch.schedulingPhaseStart?.toISOString() ?? null;
    if ("schedulingPhaseEnd" in patch)
      set.schedulingPhaseEnd = patch.schedulingPhaseEnd?.toISOString() ?? null;
    if (patch.maxSessionDuration !== undefined)
      set.maxSessionDuration = patch.maxSessionDuration;
    if (patch.timezone !== undefined) set.timezone = patch.timezone;
    if ("icon" in patch) set.icon = patch.icon ?? null;

    this.db
      .update(schema.events)
      .set(set)
      .where(eq(schema.events.id, id))
      .run();

    return { ...existing, ...patch };
  }

  async delete(id: string): Promise<void> {
    this.db.delete(schema.events).where(eq(schema.events.id, id)).run();
  }
}
