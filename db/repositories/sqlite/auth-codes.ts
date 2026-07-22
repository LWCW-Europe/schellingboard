import { and, eq, sql } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "../../schema";
import type {
  AuthCode,
  AuthCodePurpose,
  AuthCodesRepository,
  NewAuthCode,
} from "../interfaces";

type DB = BetterSQLite3Database<typeof schema>;

export class SqliteAuthCodesRepository implements AuthCodesRepository {
  constructor(private readonly db: DB) {}

  async replace(code: NewAuthCode): Promise<void> {
    this.db.transaction((tx) => {
      tx.delete(schema.authCodes)
        .where(
          and(
            eq(schema.authCodes.guestId, code.guestId),
            eq(schema.authCodes.purpose, code.purpose)
          )
        )
        .run();
      tx.insert(schema.authCodes)
        .values({
          id: nanoid(),
          guestId: code.guestId,
          purpose: code.purpose,
          salt: code.salt,
          codeHash: code.codeHash,
          createdAt: code.createdAt.toISOString(),
          expiresAt: code.expiresAt.toISOString(),
        })
        .run();
    });
  }

  async findActive(
    guestId: string,
    purpose: AuthCodePurpose,
    now: Date
  ): Promise<AuthCode | null> {
    const row = this.db
      .select()
      .from(schema.authCodes)
      .where(
        and(
          eq(schema.authCodes.guestId, guestId),
          eq(schema.authCodes.purpose, purpose)
        )
      )
      .get();
    if (!row || row.expiresAt <= now.toISOString()) return null;
    return {
      id: row.id,
      guestId: row.guestId,
      purpose: row.purpose as AuthCodePurpose,
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

  async consume(id: string): Promise<void> {
    this.db.delete(schema.authCodes).where(eq(schema.authCodes.id, id)).run();
  }
}
