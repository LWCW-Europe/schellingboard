import type Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const DEFAULT_DB_URL = "file:./data.db";

/** Resolves the on-disk path for the SQLite database from DATABASE_URL. */
export function resolveDbPath(
  url: string = process.env.DATABASE_URL ?? DEFAULT_DB_URL
): string {
  return url.replace(/^file:/, "");
}

/**
 * Runs Drizzle migrations with foreign-key enforcement disabled.
 *
 * SQLite only allows toggling `foreign_keys` while no transaction is open, and
 * Drizzle wraps each migration in a transaction — so the `PRAGMA foreign_keys`
 * statements emitted inside the migration files are silently ignored. Table
 * rebuilds (DROP + recreate), which Drizzle generates for many column changes,
 * therefore fail against a populated database. Disabling enforcement here,
 * outside any transaction, is SQLite's recommended workaround.
 * See https://github.com/drizzle-team/drizzle-orm/issues/4089
 */
export function runMigrations(
  sqlite: Database.Database,
  migrationsFolder: string
): void {
  try {
    sqlite.pragma("foreign_keys = OFF");
    migrate(drizzle(sqlite), { migrationsFolder });
  } finally {
    sqlite.pragma("foreign_keys = ON");
  }
}
