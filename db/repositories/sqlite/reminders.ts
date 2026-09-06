import { and, eq, inArray, isNotNull, lte } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../../schema";
import { followUpDueTime, headsUpDueTime } from "@/utils/reminder-schedule";
import type {
  DueReminderCandidate,
  ReminderKey,
  ReminderKind,
  RemindersRepository,
} from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

const KINDS: ReminderKind[] = ["headsUp", "followUp"];

const HOUR_MS = 60 * 60 * 1000;

// A raw NUL byte here would make git and jj treat this file as binary, so the
// same character is written as an escape. No id or kind can contain one.
const KEY_SEPARATOR = "\u0000";

function keyOf(key: ReminderKey): string {
  return `${key.sessionId}${KEY_SEPARATOR}${key.guestId}${KEY_SEPARATOR}${key.kind}`;
}

function parse(value: string | null): Date | null {
  return value === null ? null : new Date(value);
}

export class SqliteRemindersRepository implements RemindersRepository {
  constructor(private readonly db: DB) {}

  async listCandidates(now: Date): Promise<DueReminderCandidate[]> {
    // A heads-up is due from `start + break - 60 min`, and break is never
    // negative, so nothing due by `now` can start more than an hour from now.
    // A follow-up is due later still. Narrowing on the start time keeps the
    // scan off the whole schedule without the per-event break arithmetic
    // having to happen in SQL — the pure predicates decide eligibility.
    const horizon = new Date(now.getTime() + HOUR_MS).toISOString();

    const sessionRows = this.db
      .select({
        id: schema.sessions.id,
        title: schema.sessions.title,
        startTime: schema.sessions.startTime,
        endTime: schema.sessions.endTime,
        attendeeCount: schema.sessions.attendeeCount,
        eventSlug: schema.events.slug,
        eventTimezone: schema.events.timezone,
        eventBreakMinutes: schema.events.breakMinutes,
      })
      .from(schema.sessions)
      .innerJoin(schema.events, eq(schema.sessions.eventId, schema.events.id))
      .where(
        and(
          isNotNull(schema.sessions.startTime),
          isNotNull(schema.sessions.endTime),
          lte(schema.sessions.startTime, horizon)
        )
      )
      .all();
    if (sessionRows.length === 0) return [];

    const sessionIds = sessionRows.map((row) => row.id);

    const hostRows = this.db
      .select({
        sessionId: schema.sessionHosts.sessionId,
        guestId: schema.guests.id,
        email: schema.guests.email,
        headsUpOptIn: schema.guests.emailOnSessionHeadsUp,
        followUpOptIn: schema.guests.emailOnAttendeeCountReminder,
      })
      .from(schema.sessionHosts)
      .innerJoin(
        schema.guests,
        eq(schema.sessionHosts.guestId, schema.guests.id)
      )
      .where(inArray(schema.sessionHosts.sessionId, sessionIds))
      .all();
    if (hostRows.length === 0) return [];

    const locationRows = this.db
      .select({
        sessionId: schema.sessionLocations.sessionId,
        name: schema.locations.name,
      })
      .from(schema.sessionLocations)
      .innerJoin(
        schema.locations,
        eq(schema.sessionLocations.locationId, schema.locations.id)
      )
      .where(inArray(schema.sessionLocations.sessionId, sessionIds))
      .all();

    const storedRows = this.db
      .select()
      .from(schema.sessionReminders)
      .where(inArray(schema.sessionReminders.sessionId, sessionIds))
      .all();

    const hostsBySession = new Map<string, typeof hostRows>();
    for (const row of hostRows) {
      const hosts = hostsBySession.get(row.sessionId);
      if (hosts) hosts.push(row);
      else hostsBySession.set(row.sessionId, [row]);
    }

    const locationsBySession = new Map<string, string[]>();
    for (const row of locationRows) {
      const names = locationsBySession.get(row.sessionId);
      if (names) names.push(row.name);
      else locationsBySession.set(row.sessionId, [row.name]);
    }

    const stored = new Map(
      storedRows.map((row) => [
        keyOf({
          sessionId: row.sessionId,
          guestId: row.guestId,
          kind: row.kind as ReminderKind,
        }),
        row,
      ])
    );

    const candidates: DueReminderCandidate[] = [];
    for (const session of sessionRows) {
      const hosts = hostsBySession.get(session.id);
      if (!hosts || session.startTime === null || session.endTime === null) {
        continue;
      }
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);

      for (const host of hosts) {
        for (const kind of KINDS) {
          const row = stored.get(
            keyOf({ sessionId: session.id, guestId: host.guestId, kind })
          );
          candidates.push({
            sessionId: session.id,
            guestId: host.guestId,
            kind,
            dueTime:
              kind === "headsUp"
                ? headsUpDueTime(startTime, session.eventBreakMinutes)
                : followUpDueTime(endTime),
            sessionTitle: session.title,
            sessionStartTime: startTime,
            sessionEndTime: endTime,
            sessionLocationNames: locationsBySession.get(session.id) ?? [],
            hasRecordedCount: session.attendeeCount !== null,
            eventSlug: session.eventSlug,
            eventTimezone: session.eventTimezone,
            eventBreakMinutes: session.eventBreakMinutes,
            guestEmail: host.email === "" ? null : host.email,
            reminderOptIn:
              kind === "headsUp" ? host.headsUpOptIn : host.followUpOptIn,
            storedDueTime: parse(row?.dueTime ?? null),
            storedClaimedAt: parse(row?.claimedAt ?? null),
            storedNotifiedAt: parse(row?.notifiedAt ?? null),
          });
        }
      }
    }
    return candidates;
  }

  // A synchronous better-sqlite3 transaction: nothing awaits between the read
  // and the write, so no other tick in this process can interleave, and
  // SQLite's write lock serialises the ones in other processes.
  async claim(
    key: ReminderKey,
    dueTime: Date,
    now: Date
  ): Promise<{ claimed: boolean; notifyOwed: boolean }> {
    return this.db.transaction((tx) => {
      const existing = tx
        .select()
        .from(schema.sessionReminders)
        .where(this.matches(key))
        .get();
      const sameDueTime =
        existing !== undefined && existing.dueTime === dueTime.toISOString();
      if (sameDueTime && existing.claimedAt !== null) {
        return { claimed: false, notifyOwed: false };
      }

      const values = {
        ...key,
        dueTime: dueTime.toISOString(),
        claimedAt: now.toISOString(),
        // A different due time is a reschedule: the old delivery and failure
        // history belong to the reminder that is being superseded, so the
        // notification is owed again too (FR-024).
        firstFailedAt: sameDueTime ? existing.firstFailedAt : null,
        notifiedAt: sameDueTime ? existing.notifiedAt : null,
        sentAt: sameDueTime ? existing.sentAt : null,
      };
      tx.insert(schema.sessionReminders)
        .values(values)
        .onConflictDoUpdate({
          target: [
            schema.sessionReminders.sessionId,
            schema.sessionReminders.guestId,
            schema.sessionReminders.kind,
          ],
          set: {
            dueTime: values.dueTime,
            claimedAt: values.claimedAt,
            firstFailedAt: values.firstFailedAt,
            notifiedAt: values.notifiedAt,
            sentAt: values.sentAt,
          },
        })
        .run();
      return { claimed: true, notifyOwed: values.notifiedAt === null };
    });
  }

  async markNotified(key: ReminderKey, now: Date): Promise<void> {
    this.db
      .update(schema.sessionReminders)
      .set({ notifiedAt: now.toISOString() })
      .where(this.matches(key))
      .run();
  }

  async markSent(key: ReminderKey, now: Date): Promise<void> {
    this.db
      .update(schema.sessionReminders)
      .set({ sentAt: now.toISOString(), firstFailedAt: null })
      .where(this.matches(key))
      .run();
  }

  async markSkipped(key: ReminderKey): Promise<void> {
    // claimedAt from the winning claim already settles the row; all that is
    // left is to drop a stale failure history, since there is nothing to
    // retry.
    this.db
      .update(schema.sessionReminders)
      .set({ firstFailedAt: null })
      .where(this.matches(key))
      .run();
  }

  async markFailed(
    key: ReminderKey,
    now: Date,
    abandonAfterMs: number
  ): Promise<{ abandoned: boolean }> {
    return this.db.transaction((tx) => {
      const existing = tx
        .select()
        .from(schema.sessionReminders)
        .where(this.matches(key))
        .get();
      if (!existing) return { abandoned: false };

      const firstFailedAt = existing.firstFailedAt ?? now.toISOString();
      const abandoned =
        now.getTime() - new Date(firstFailedAt).getTime() > abandonAfterMs;
      tx.update(schema.sessionReminders)
        // Keeping claimedAt set is what abandons it: the next tick then sees
        // this exact due time as already spoken for and never retries.
        .set({
          firstFailedAt,
          claimedAt: abandoned ? existing.claimedAt : null,
        })
        .where(this.matches(key))
        .run();
      return { abandoned };
    });
  }

  private matches(key: ReminderKey) {
    return and(
      eq(schema.sessionReminders.sessionId, key.sessionId),
      eq(schema.sessionReminders.guestId, key.guestId),
      eq(schema.sessionReminders.kind, key.kind)
    );
  }
}
