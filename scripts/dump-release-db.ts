// Records a released version's seeded database as an SQL dump, the fixture the
// release-upgrade tests migrate forward (see docs/dev/testing.md).
//
// The dump has to be produced by the release itself — its schema, its
// migrations, its seed script. At release time that is this working tree: the
// dump is recorded while the changelog is finalized, in the commit that then
// gets tagged, so the tag carries the fixture for upgrading from it (see
// docs/dev/releasing.md). Once a tag exists it wins — a version recorded after
// the fact is seeded in a throwaway worktree of its tag rather than from
// whatever this tree holds today.
//
// A release that ships no migration reaches the same schema as the one before
// it, so its dump would test the same upgrade twice: the script recognizes
// that and records the dump that covers it in releases.json instead.
//
//   bun x tsx scripts/dump-release-db.ts v3.4.2

import { execFileSync, spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

import Database from "better-sqlite3";

import {
  DUMP_DIR as dumpDir,
  dumpPath,
  listDumpVersions,
  recordRelease,
} from "./release-dumps";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const version = process.argv[2];
if (!version || !/^v\d+\.\d+\.\d+$/.test(version)) {
  console.error("Usage: bun x tsx scripts/dump-release-db.ts vX.Y.Z");
  process.exit(1);
}
// A stored dump is the record of what that release actually wrote; rewriting it
// would quietly restate history with today's seed data.
if (fs.existsSync(dumpPath(version))) {
  console.error(
    `${path.relative(process.cwd(), dumpPath(version))} already exists. ` +
      `Dumps are not regenerated — delete it first if you really mean to.`
  );
  process.exit(1);
}

function run(
  command: string,
  args: string[],
  cwd: string,
  env?: Record<string, string>
) {
  execFileSync(command, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

/** The migrations a database has applied, in order. */
function appliedMigrations(db: Database.Database): string {
  // By rowid, not by id: drizzle declares the column `id SERIAL PRIMARY KEY`,
  // which SQLite treats as an ordinary column and leaves NULL in every row.
  return (
    db
      .prepare("SELECT hash FROM __drizzle_migrations ORDER BY rowid")
      .all() as {
      hash: string;
    }[]
  )
    .map((row) => row.hash)
    .join("\n");
}

/** The version whose stored dump applies the same migrations, if any. */
function dumpWithSameSchema(migrations: string): string | undefined {
  for (const stored of listDumpVersions()) {
    const db = new Database(":memory:");
    try {
      db.exec(fs.readFileSync(dumpPath(stored), "utf8"));
      if (appliedMigrations(db) === migrations) return stored;
    } finally {
      db.close();
    }
  }
  return undefined;
}

function quote(value: unknown): string {
  if (value === null) return "NULL";
  if (typeof value === "number" || typeof value === "bigint")
    return String(value);
  if (Buffer.isBuffer(value)) return `X'${value.toString("hex")}'`;
  if (typeof value === "string") return `'${value.replaceAll("'", "''")}'`;
  throw new Error(`Cannot dump a ${typeof value} column value`);
}

function dump(dbPath: string, outPath: string): void {
  const db = new Database(dbPath, { readonly: true });
  try {
    const objects = db
      .prepare(
        "SELECT type, name, sql FROM sqlite_master " +
          "WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY rowid"
      )
      .all() as { type: string; name: string; sql: string }[];

    const out: string[] = [
      `-- Seeded database of schellingboard ${version}, dumped by`,
      `-- scripts/dump-release-db.ts. Fixture for the release-upgrade tests.`,
      "PRAGMA foreign_keys=OFF;",
      "BEGIN TRANSACTION;",
    ];

    for (const obj of objects.filter((o) => o.type === "table")) {
      out.push(`${obj.sql};`);
      const rows = db
        .prepare(`SELECT * FROM ${JSON.stringify(obj.name)}`)
        .all() as Record<string, unknown>[];
      for (const row of rows) {
        const values = Object.values(row).map(quote).join(",");
        out.push(`INSERT INTO ${JSON.stringify(obj.name)} VALUES(${values});`);
      }
    }
    // After the rows: an index is cheaper to build once than to maintain per
    // insert, and a trigger must not fire for the seeded data.
    for (const obj of objects.filter((o) => o.type !== "table")) {
      out.push(`${obj.sql};`);
    }

    out.push("COMMIT;", "");
    fs.writeFileSync(outPath, out.join("\n"));
  } finally {
    db.close();
  }
}

function tagged(version: string): boolean {
  return (
    spawnSync("git", ["rev-parse", "--verify", `refs/tags/${version}`], {
      cwd: repoRoot,
      stdio: "ignore",
    }).status === 0
  );
}

/** Scratch space for the seeded database, and for its uploads when seeding here. */
const scratch = path.join(repoRoot, ".release-dump");
const seededDb = path.join(scratch, "release.db");

let worktree: string | undefined;
fs.rmSync(scratch, { recursive: true, force: true });
fs.mkdirSync(scratch, { recursive: true });
try {
  // Always through the release's own seed target, since the script moved
  // between releases.
  if (tagged(version)) {
    worktree = fs.mkdtempSync(path.join(os.tmpdir(), "sb-release-"));
    fs.rmSync(worktree, { recursive: true, force: true }); // git wants to create it
    console.log(`[dump] checking ${version} out and seeding it...`);
    run("git", ["worktree", "add", "--detach", worktree, version], repoRoot);
    // Uploads land in the worktree's own ./uploads and go with it — the seed
    // script refuses to clear an uploads dir outside the tree it runs in.
    run("make", ["dev-db-seed"], worktree, {
      DATABASE_URL: `file:${seededDb}`,
      SEED_PROFILE: "small",
    });
  } else {
    console.log(`[dump] no ${version} tag yet — seeding the working tree...`);
    run("make", ["dev-db-seed"], repoRoot, {
      DATABASE_URL: `file:${seededDb}`,
      SEED_PROFILE: "small",
      // Seeding clears the uploads dir it is pointed at, which must not be the
      // dev one this checkout is using.
      SB_UPLOADS_DIR: path.join(scratch, "uploads"),
    });
  }

  const seeded = new Database(seededDb, { readonly: true });
  let covered: string | undefined;
  try {
    covered = dumpWithSameSchema(appliedMigrations(seeded));
  } finally {
    seeded.close();
  }
  if (covered) {
    console.log(
      `[dump] ${version} applies the same migrations as ${covered}, whose ` +
        `dump covers upgrading from it`
    );
  } else {
    fs.mkdirSync(dumpDir, { recursive: true });
    dump(seededDb, dumpPath(version));
    console.log(`[dump] wrote ${path.relative(repoRoot, dumpPath(version))}`);
  }
  recordRelease(version, covered ?? version);
} finally {
  if (worktree && fs.existsSync(worktree)) {
    run("git", ["worktree", "remove", "--force", worktree], repoRoot);
  }
  fs.rmSync(scratch, { recursive: true, force: true });
}
