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
 *
 * Because enforcement is off, a faulty migration could introduce a dangling
 * reference unnoticed, so afterwards we run `PRAGMA foreign_key_check` and
 * throw if any violation slipped through (it cannot be rolled back at that
 * point, but failing loudly surfaces the bad migration in dev/CI).
 */
export function runMigrations(
  sqlite: Database.Database,
  migrationsFolder: string
): void {
  try {
    sqlite.pragma("foreign_keys = OFF");
    migrate(drizzle(sqlite), { migrationsFolder });
    const violations = sqlite.pragma("foreign_key_check") as unknown[];
    if (violations.length > 0) {
      throw new Error(
        `Migration produced ${violations.length} foreign key violation(s): ` +
          JSON.stringify(violations)
      );
    }
  } finally {
    sqlite.pragma("foreign_keys = ON");
  }
}
