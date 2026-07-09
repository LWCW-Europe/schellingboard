import { eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../../schema";
import {
  DEFAULT_SITE_SETTINGS,
  type SettingsRepository,
  type SiteSettings,
} from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

// The settings table always holds at most one row, identified by this id.
const SINGLETON_ID = "singleton";

export class SqliteSettingsRepository implements SettingsRepository {
  constructor(private readonly db: DB) {}

  async get(): Promise<SiteSettings> {
    const row = this.db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.id, SINGLETON_ID))
      .get();
    if (!row) return { ...DEFAULT_SITE_SETTINGS };
    return {
      title: row.title,
      description: row.description,
      mapImageUrl: row.mapImageUrl,
    };
  }

  async update(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.get();
    const next: SiteSettings = { ...current, ...patch };
    this.db
      .insert(schema.siteSettings)
      .values({ id: SINGLETON_ID, ...next })
      .onConflictDoUpdate({
        target: schema.siteSettings.id,
        set: next,
      })
      .run();
    return next;
  }
}
