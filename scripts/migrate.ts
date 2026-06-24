// Adds workaround for https://github.com/drizzle-team/drizzle-orm/issues/4089
// It turns off foreign keys only for the duration of the migration - this is officially recommended

import path from "path";
import { fileURLToPath } from "url";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const dbUrl = process.env.DATABASE_URL ?? "file:./data.db";
const sqlite = new Database(dbUrl.replace(/^file:/, ""));
const db = drizzle(sqlite);

const migrationsFolder = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../drizzle"
);
try {
  console.log(`[migrate] running...`);
  const start = Date.now();

  sqlite.pragma("foreign_keys = OFF");
  migrate(db, { migrationsFolder });

  console.log(`[migrate] done in ${Date.now() - start}ms`);
} catch (err) {
  console.error(`[migrate] failed:`, err);
  process.exitCode = 1;
} finally {
  sqlite.pragma("foreign_keys = ON");
}
sqlite.close();
