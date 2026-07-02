import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import * as schema from "./schema";
import { resolveDbPath, runMigrations } from "./migrate";
import { SqliteDaysRepository } from "./repositories/sqlite/days";
import { SqliteEventsRepository } from "./repositories/sqlite/events";
import { SqliteGuestsRepository } from "./repositories/sqlite/guests";
import { SqliteLocationsRepository } from "./repositories/sqlite/locations";
import { SqliteRsvpsRepository } from "./repositories/sqlite/rsvps";
import { SqliteSessionProposalsRepository } from "./repositories/sqlite/session-proposals";
import { SqliteSessionsRepository } from "./repositories/sqlite/sessions";
import { SqliteVotesRepository } from "./repositories/sqlite/votes";
import type {
  DaysRepository,
  EventsRepository,
  GuestsRepository,
  LocationsRepository,
  RsvpsRepository,
  SessionProposalsRepository,
  SessionsRepository,
  VotesRepository,
} from "./repositories/interfaces";

export type Repositories = {
  days: DaysRepository;
  events: EventsRepository;
  guests: GuestsRepository;
  locations: LocationsRepository;
  sessions: SessionsRepository;
  rsvps: RsvpsRepository;
  sessionProposals: SessionProposalsRepository;
  votes: VotesRepository;
};

let _sqlite: Database.Database | null = null;
let _repositories: Repositories | null = null;

function buildRepositories(sqlite: Database.Database): Repositories {
  const db = drizzle(sqlite, { schema });
  return {
    days: new SqliteDaysRepository(db),
    events: new SqliteEventsRepository(db),
    guests: new SqliteGuestsRepository(db),
    locations: new SqliteLocationsRepository(db),
    sessions: new SqliteSessionsRepository(db),
    rsvps: new SqliteRsvpsRepository(db),
    sessionProposals: new SqliteSessionProposalsRepository(db),
    votes: new SqliteVotesRepository(db),
  };
}

export function getRepositories(): Repositories {
  if (!_repositories) {
    const conn = new Database(resolveDbPath());
    try {
      // Enforce foreign keys on every connection. better-sqlite3 happens to
      // compile SQLite with SQLITE_DEFAULT_FOREIGN_KEYS=1, but set it explicitly
      // so our ON DELETE CASCADE / SET NULL behaviour never depends on that
      // build default. runMigrations toggles it off and back on internally.
      conn.pragma("foreign_keys = ON");
      runMigrations(conn, path.join(process.cwd(), "drizzle"));
      _sqlite = conn;
      _repositories = buildRepositories(conn);
    } catch (e) {
      conn.close();
      throw e;
    }
  }
  return _repositories;
}

export function resetRepositories(): void {
  _sqlite?.close();
  _sqlite = null;
  _repositories = null;
}

export function serializeDb(): Buffer {
  if (!_sqlite)
    throw new Error("DB not initialized — call getRepositories() first");
  return _sqlite.serialize();
}

export function restoreDb(snapshot: Buffer): void {
  const conn = new Database(snapshot);
  try {
    // Enforce foreign keys on every connection (see getRepositories).
    conn.pragma("foreign_keys = ON");
    // Deserialization is lazy: force a read so a corrupt snapshot fails here,
    // while the current connection is still intact.
    conn.pragma("schema_version");
    const repositories = buildRepositories(conn);
    _sqlite?.close();
    _sqlite = conn;
    _repositories = repositories;
  } catch (e) {
    conn.close();
    throw e;
  }
}
