import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import fs from "fs";
import os from "os";
import path from "path";
import { runMigrations } from "@/db/migrate";

// Writes a minimal Drizzle migrations folder. Each entry is one migration's
// statements, separated by the Drizzle statement-breakpoint marker.
function writeMigrations(dir: string, migrations: string[][]): void {
  fs.mkdirSync(path.join(dir, "meta"), { recursive: true });
  const journal = {
    version: "7",
    dialect: "sqlite",
    entries: migrations.map((_, idx) => ({
      idx,
      version: "6",
      when: idx + 1,
      tag: `000${idx}_test`,
      breakpoints: true,
    })),
  };
  fs.writeFileSync(
    path.join(dir, "meta", "_journal.json"),
    JSON.stringify(journal)
  );
  migrations.forEach((statements, idx) => {
    fs.writeFileSync(
      path.join(dir, `000${idx}_test.sql`),
      statements.join("--> statement-breakpoint\n")
    );
  });
}

function writeMigration(dir: string, statements: string[]): void {
  writeMigrations(dir, [statements]);
}

describe("runMigrations", () => {
  let tmpDir: string;
  let sqlite: Database.Database;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "migrate-test-"));
    sqlite = new Database(":memory:");
  });

  afterEach(() => {
    sqlite.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("rebuilds a table referenced by a foreign key", () => {
    // Seed a parent/child pair, then a second migration drops & recreates the
    // parent. With FK enforcement on this fails; the helper disables it.
    writeMigration(tmpDir, [
      "CREATE TABLE parent (id text PRIMARY KEY);",
      "CREATE TABLE child (id text PRIMARY KEY, parent_id text REFERENCES parent(id));",
      "INSERT INTO parent (id) VALUES ('p1');",
      "INSERT INTO child (id, parent_id) VALUES ('c1', 'p1');",
      "CREATE TABLE __new_parent (id text PRIMARY KEY, label text);",
      "INSERT INTO __new_parent (id) SELECT id FROM parent;",
      "DROP TABLE parent;",
      "ALTER TABLE __new_parent RENAME TO parent;",
    ]);

    expect(() => runMigrations(sqlite, tmpDir)).not.toThrow();
    expect(sqlite.prepare("SELECT count(*) AS n FROM child").get()).toEqual({
      n: 1,
    });
  });

  it("throws when a migration leaves a foreign key violation", () => {
    // A dangling reference only slips in because enforcement is off during
    // migration; the post-migration integrity check must catch it.
    writeMigration(tmpDir, [
      "CREATE TABLE parent (id text PRIMARY KEY);",
      "CREATE TABLE child (id text PRIMARY KEY, parent_id text REFERENCES parent(id));",
      "INSERT INTO child (id, parent_id) VALUES ('c1', 'missing');",
    ]);

    expect(() => runMigrations(sqlite, tmpDir)).toThrow(/foreign key/i);
  });

  // The events table as it exists just before the slug migration, so the real
  // migration runs against realistic data.
  const preSlugEventsTable = `CREATE TABLE \`events\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`name\` text NOT NULL,
      \`description\` text DEFAULT '' NOT NULL,
      \`website\` text DEFAULT '' NOT NULL,
      \`start\` text NOT NULL,
      \`end\` text NOT NULL,
      \`proposal_phase_start\` text,
      \`proposal_phase_end\` text,
      \`voting_phase_start\` text,
      \`voting_phase_end\` text,
      \`scheduling_phase_start\` text,
      \`scheduling_phase_end\` text,
      \`max_session_duration\` integer DEFAULT 120 NOT NULL,
      \`timezone\` text DEFAULT 'UTC' NOT NULL,
      \`icon\` text,
      \`break_minutes\` integer DEFAULT 10 NOT NULL
    );`;

  function readSlugMigration(): string[] {
    const drizzleDir = path.join(process.cwd(), "drizzle");
    const file = fs
      .readdirSync(drizzleDir)
      .filter((f) => /^\d+_.*\.sql$/.test(f))
      .find((f) =>
        fs
          .readFileSync(path.join(drizzleDir, f), "utf8")
          .includes("events_slug_unique")
      );
    expect(file, "event slug migration not found").toBeDefined();
    return fs
      .readFileSync(path.join(drizzleDir, file!), "utf8")
      .split("--> statement-breakpoint\n");
  }

  it("the slug migration backfills event slugs on an existing database", () => {
    writeMigrations(tmpDir, [
      [
        preSlugEventsTable,
        `INSERT INTO events (id, name, start, end) VALUES
           ('e1', 'My-Event 2026', '2026-01-01', '2026-01-02'),
           ('e2', 'Other Event', '2026-02-01', '2026-02-02');`,
      ],
      readSlugMigration(),
    ]);

    runMigrations(sqlite, tmpDir);

    const rows = sqlite
      .prepare("SELECT id, name, slug FROM events ORDER BY id")
      .all();
    expect(rows).toEqual([
      { id: "e1", name: "My-Event 2026", slug: "My-Event-2026" },
      { id: "e2", name: "Other Event", slug: "Other-Event" },
    ]);
    // The unique index must survive the rebuild.
    expect(() =>
      sqlite
        .prepare(
          "INSERT INTO events (id, name, slug, start, end) VALUES ('e3', 'x', 'Other-Event', 's', 'e')"
        )
        .run()
    ).toThrow(/unique/i);
  });

  it("the slug migration disambiguates events whose names collide as slugs", () => {
    // Pre-slug, "My Event" and "My-Event" both resolved to the same URL, so
    // such pairs can exist. The migration must not die on CREATE UNIQUE INDEX;
    // it keeps one clean slug and suffixes the others with their id.
    writeMigrations(tmpDir, [
      [
        preSlugEventsTable,
        `INSERT INTO events (id, name, start, end) VALUES
           ('e1', 'My Event', '2026-01-01', '2026-01-02'),
           ('e2', 'My-Event', '2026-02-01', '2026-02-02'),
           ('e3', 'My Event', '2026-03-01', '2026-03-02');`,
      ],
      readSlugMigration(),
    ]);

    expect(() => runMigrations(sqlite, tmpDir)).not.toThrow();

    const rows = sqlite
      .prepare("SELECT id, name, slug FROM events ORDER BY id")
      .all();
    expect(rows).toEqual([
      { id: "e1", name: "My Event", slug: "My-Event" },
      { id: "e2", name: "My-Event", slug: "My-Event-e2" },
      { id: "e3", name: "My Event", slug: "My-Event-e3" },
    ]);
  });

  it("leaves foreign key enforcement enabled afterwards", () => {
    writeMigration(tmpDir, ["CREATE TABLE t (id text PRIMARY KEY);"]);

    runMigrations(sqlite, tmpDir);

    expect(sqlite.pragma("foreign_keys", { simple: true })).toBe(1);
  });
});
