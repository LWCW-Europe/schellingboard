import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import fs from "fs";
import os from "os";
import path from "path";
import { runMigrations } from "@/db/migrate";

// Writes a minimal Drizzle migrations folder containing a single migration.
// Statements are separated by the Drizzle statement-breakpoint marker.
function writeMigration(dir: string, statements: string[]): void {
  fs.mkdirSync(path.join(dir, "meta"), { recursive: true });
  const journal = {
    version: "7",
    dialect: "sqlite",
    entries: [
      { idx: 0, version: "6", when: 1, tag: "0000_test", breakpoints: true },
    ],
  };
  fs.writeFileSync(
    path.join(dir, "meta", "_journal.json"),
    JSON.stringify(journal)
  );
  fs.writeFileSync(
    path.join(dir, "0000_test.sql"),
    statements.join("--> statement-breakpoint\n")
  );
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

  it("leaves foreign key enforcement enabled afterwards", () => {
    writeMigration(tmpDir, ["CREATE TABLE t (id text PRIMARY KEY);"]);

    runMigrations(sqlite, tmpDir);

    expect(sqlite.pragma("foreign_keys", { simple: true })).toBe(1);
  });
});
