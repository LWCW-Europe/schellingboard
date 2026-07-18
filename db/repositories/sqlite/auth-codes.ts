import { eq, sql } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type { AuthCode, AuthCodesRepository, NewAuthCode } from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

export class SqliteAuthCodesRepository implements AuthCodesRepository {
  constructor(private readonly db: DB) {}

  async replace(code: NewAuthCode): Promise<void> {
    this.db.transaction((tx) => {
      tx.delete(schema.authCodes)
        .where(eq(schema.authCodes.guestId, code.guestId))
        .run();
      tx.insert(schema.authCodes)
        .values({
          id: nanoid(),
          guestId: code.guestId,
          salt: code.salt,
          codeHash: code.codeHash,
          createdAt: code.createdAt.toISOString(),
          expiresAt: code.expiresAt.toISOString(),
        })
        .run();
    });
  }

  async findActive(guestId: string, now: Date): Promise<AuthCode | null> {
    const row = this.db
      .select()
      .from(schema.authCodes)
      .where(eq(schema.authCodes.guestId, guestId))
      .get();
    if (!row || row.expiresAt <= now.toISOString()) return null;
    return {
      id: row.id,
      guestId: row.guestId,
      salt: row.salt,
      codeHash: row.codeHash,
      createdAt: new Date(row.createdAt),
      expiresAt: new Date(row.expiresAt),
      attempts: row.attempts,
    };
  }

  async recordFailedAttempt(id: string): Promise<void> {
    this.db
      .update(schema.authCodes)
      .set({ attempts: sql`${schema.authCodes.attempts} + 1` })
      .where(eq(schema.authCodes.id, id))
      .run();
  }
}
