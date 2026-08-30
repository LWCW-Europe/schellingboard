import fs from "fs";
import os from "os";
import path from "path";

import Database from "better-sqlite3";

import { getRepositories, resetRepositories } from "@/db/container";
import { runMigrations } from "@/db/migrate";
import { dumpPath, listDumpVersions } from "@/scripts/release-dumps";

const MIGRATIONS_DIR = path.join(process.cwd(), "drizzle");

export type ReleaseDump = { version: string; file: string };

/** The stored release dumps, oldest release first. */
export function listReleaseDumps(): ReleaseDump[] {
  return listDumpVersions().map((version) => ({
    version,
    file: dumpPath(version),
  }));
}

let tempDir: string | null = null;
let previousDatabaseUrl: string | undefined;

/**
 * Restores the dump into a database of its own and points the repositories at
 * it, which applies every pending migration — what a self-hoster's data goes
 * through when they start a new release against it.
 *
 * On disk rather than in memory because that is where migrations are exercised
 * for real: a table rebuild against a file has to survive the connection's
 * journal and foreign-key handling.
 */
export function upgradeFromDump(dump: ReleaseDump): void {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sb-upgrade-"));
  const dbPath = path.join(tempDir, "data.db");
  const restored = new Database(dbPath);
  try {
    restored.exec(fs.readFileSync(dump.file, "utf8"));
  } finally {
    restored.close();
  }
  previousDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = `file:${dbPath}`;
  resetRepositories();
  getRepositories();
}

export function disposeUpgradedDb(): void {
  resetRepositories();
  if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = previousDatabaseUrl;
  if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  tempDir = null;
}

function openUpgradedDb(): Database.Database {
  if (!tempDir) throw new Error("Call upgradeFromDump() first");
  return new Database(path.join(tempDir, "data.db"), { readonly: true });
}

export function migrationFileCount(): number {
  return fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"))
    .length;
}

export function appliedMigrationCount(): number {
  const db = openUpgradedDb();
  try {
    const row = db
      .prepare("SELECT count(*) AS n FROM __drizzle_migrations")
      .get() as { n: number };
    return row.n;
  } finally {
    db.close();
  }
}

type TableShape = {
  columns: string[];
  foreignKeys: string[];
  indexes: string[];
};
export type SchemaShape = Record<string, TableShape>;

/**
 * The shape of every table, described by column, foreign key and index rather
 * than by the `CREATE TABLE` text: an incrementally migrated database reaches
 * the same shape through table rebuilds, so its DDL differs in wording from a
 * freshly created one while meaning the same thing.
 *
 * Index names are left out for the same reason — SQLite names the implicit
 * indexes of UNIQUE constraints by position.
 */
function schemaShape(db: Database.Database): SchemaShape {
  const tables = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' " +
        "AND name NOT LIKE 'sqlite_%' AND name != '__drizzle_migrations' " +
        "ORDER BY name"
    )
    .all() as { name: string }[];

  const shape: SchemaShape = {};
  for (const { name } of tables) {
    const columns = (
      db.pragma(`table_info(${JSON.stringify(name)})`) as {
        name: string;
        type: string;
        notnull: number;
        dflt_value: string | null;
        pk: number;
      }[]
    ).map(
      (c) =>
        `${c.name} ${c.type}${c.notnull ? " NOT NULL" : ""}` +
        `${c.dflt_value === null ? "" : ` DEFAULT ${c.dflt_value}`}` +
        `${c.pk ? ` PK${c.pk}` : ""}`
    );

    const foreignKeys = (
      db.pragma(`foreign_key_list(${JSON.stringify(name)})`) as {
        table: string;
        from: string;
        to: string | null;
        on_update: string;
        on_delete: string;
      }[]
    )
      .map(
        (f) =>
          `${f.from} -> ${f.table}.${f.to} ` +
          `ON UPDATE ${f.on_update} ON DELETE ${f.on_delete}`
      )
      .sort();

    const indexes = (
      db.pragma(`index_list(${JSON.stringify(name)})`) as {
        name: string;
        unique: number;
      }[]
    )
      .map((i) => {
        const cols = (
          db.pragma(`index_info(${JSON.stringify(i.name)})`) as {
            name: string | null;
          }[]
        ).map((c) => c.name ?? "<expr>");
        return `${i.unique ? "UNIQUE" : "INDEX"}(${cols.join(", ")})`;
      })
      .sort();

    shape[name] = { columns, foreignKeys, indexes };
  }
  return shape;
}

export function schemaOfUpgradedDb(): SchemaShape {
  const db = openUpgradedDb();
  try {
    return schemaShape(db);
  } finally {
    db.close();
  }
}

/** The shape the migrations produce on an empty database. */
export function schemaOfFreshDb(): SchemaShape {
  const db = new Database(":memory:");
  try {
    runMigrations(db, MIGRATIONS_DIR);
    return schemaShape(db);
  } finally {
    db.close();
  }
}
