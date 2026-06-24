// Runs DB migrations with foreign keys disabled, working around
// https://github.com/drizzle-team/drizzle-orm/issues/4089 — see db/migrate.ts.

import path from "path";
import { fileURLToPath } from "url";

import Database from "better-sqlite3";

import { resolveDbPath, runMigrations } from "../db/migrate.js";

const sqlite = new Database(resolveDbPath());
// Enforce foreign keys on every connection; runMigrations toggles it off and
// back on internally.
sqlite.pragma("foreign_keys = ON");

const migrationsFolder = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../drizzle"
);
try {
  console.log(`[migrate] running...`);
  const start = Date.now();
  runMigrations(sqlite, migrationsFolder);
  console.log(`[migrate] done in ${Date.now() - start}ms`);
} catch (err) {
  console.error(`[migrate] failed:`, err);
  process.exitCode = 1;
} finally {
  sqlite.close();
}
