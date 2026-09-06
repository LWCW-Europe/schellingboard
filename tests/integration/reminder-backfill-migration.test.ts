import fs from "fs";
import os from "os";
import path from "path";

import Database from "better-sqlite3";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { runMigrations } from "@/db/migrate";
import { followUpDueTime } from "@/utils/reminder-schedule";

// The migration that adds the reminder machinery has to settle the follow-up
// for every session that had already finished when it ran. Without that, the
// first dispatch tick after an upgrade finds an entire event history owed a
// follow-up — a notification and an email per host per past session — because
// a follow-up is deliberately never dropped for being late.
//
// Exercised by migrating a database that already holds those sessions, which
// means running the migrations in two passes: up to the one before, then all
// of them.

const MIGRATIONS = path.join(process.cwd(), "drizzle");
const BACKFILL_IDX = 33;

const HOUR_MS = 60 * 60 * 1000;

/** A copy of drizzle/ whose journal stops before `idx`. */
function migrationsBefore(idx: number, into: string): string {
  const folder = path.join(into, `migrations-before-${idx}`);
  fs.mkdirSync(path.join(folder, "meta"), { recursive: true });
  const journal = JSON.parse(
    fs.readFileSync(path.join(MIGRATIONS, "meta/_journal.json"), "utf8")
  ) as { entries: { idx: number; tag: string }[] };
  journal.entries = journal.entries.filter((entry) => entry.idx < idx);
  fs.writeFileSync(
    path.join(folder, "meta/_journal.json"),
    JSON.stringify(journal)
  );
  for (const entry of journal.entries) {
    fs.copyFileSync(
      path.join(MIGRATIONS, `${entry.tag}.sql`),
      path.join(folder, `${entry.tag}.sql`)
    );
  }
  return folder;
}

type Row = {
  session_id: string;
  guest_id: string;
  kind: string;
  due_time: string;
  claimed_at: string | null;
  notified_at: string | null;
  sent_at: string | null;
};

const now = Date.now();
const ENDED = new Date(now - 3 * HOUR_MS);
const UNDER_WAY_END = new Date(now + HOUR_MS);
const UPCOMING_START = new Date(now + 24 * HOUR_MS);

let tempDir: string;
let db: Database.Database;

function addSession(id: string, startTime: Date, endTime: Date): void {
  db.prepare(
    "INSERT INTO sessions (id, title, event_id, start_time, end_time) VALUES (?, ?, 'e1', ?, ?)"
  ).run(id, id, startTime.toISOString(), endTime.toISOString());
  db.prepare(
    "INSERT INTO session_hosts (session_id, guest_id) VALUES (?, 'g1'), (?, 'g2')"
  ).run(id, id);
}

function rowsFor(sessionId: string): Row[] {
  return db
    .prepare("SELECT * FROM session_reminders WHERE session_id = ?")
    .all(sessionId) as Row[];
}

describe("the attendee-count migration's follow-up backfill", () => {
  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sb-backfill-"));
    db = new Database(path.join(tempDir, "data.db"));
    runMigrations(db, migrationsBefore(BACKFILL_IDX, tempDir));

    db.prepare(
      "INSERT INTO events (id, name, slug, start, end) VALUES ('e1', 'E', 'e', ?, ?)"
    ).run(
      new Date(now - 24 * HOUR_MS).toISOString(),
      UPCOMING_START.toISOString()
    );
    db.prepare(
      "INSERT INTO guests (id, name, email) VALUES ('g1', 'One', 'one@test.example'), ('g2', 'Two', 'two@test.example')"
    ).run();

    addSession("finished", new Date(now - 4 * HOUR_MS), ENDED);
    addSession("under-way", new Date(now - HOUR_MS), UNDER_WAY_END);
    addSession(
      "upcoming",
      UPCOMING_START,
      new Date(UPCOMING_START.getTime() + HOUR_MS)
    );
    db.prepare(
      "INSERT INTO sessions (id, title, event_id) VALUES ('unscheduled', 'U', 'e1')"
    ).run();

    runMigrations(db, MIGRATIONS);
  });

  afterAll(() => {
    db.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("settles the follow-up for every host of a session that had finished", () => {
    const rows = rowsFor("finished");
    expect(rows.map((r) => r.guest_id).sort()).toEqual(["g1", "g2"]);
    for (const row of rows) {
      expect(row.kind).toBe("followUp");
      // The due time dispatch computes, to the millisecond: anything else
      // reads as a reschedule and re-arms the very reminder this suppresses.
      expect(row.due_time).toBe(followUpDueTime(ENDED).toISOString());
      expect(row.claimed_at).not.toBeNull();
      expect(row.notified_at).not.toBeNull();
      // Nothing was ever mailed, and the column may not pretend otherwise.
      expect(row.sent_at).toBeNull();
    }
  });

  it("leaves the heads-up alone, which is dropped once a session has ended", () => {
    expect(rowsFor("finished").filter((r) => r.kind === "headsUp")).toEqual([]);
  });

  it("says nothing about a session that has not finished yet", () => {
    expect(rowsFor("under-way")).toEqual([]);
    expect(rowsFor("upcoming")).toEqual([]);
    expect(rowsFor("unscheduled")).toEqual([]);
  });
});
