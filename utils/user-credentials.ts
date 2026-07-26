import {
  createHash,
  randomInt,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";

// Server-only credential helpers for guest account security (issue #370):
// emailed temporary codes and optional permanent passwords. Cookie signing
// lives in utils/auth.ts, which must stay free of node:crypto.

export const AUTH_CODE_LENGTH = 8;
export const AUTH_CODE_VALID_MINUTES = 10;
// Wrong guesses retire an emailed login code, because it is otherwise an
// unmetered online oracle and its ~40 bits don't cover that alone: the server
// will serve thousands of guesses a second, so an uncapped code faces millions
// of tries within its life. The cap is deliberately high (and matches NIST SP
// 800-63B's limit for one-time codes), because retiring a code is also how an
// attacker denies it to its owner — anyone can guess against a name they know,
// so a low cap made shutting the emailed-code path, the path that must survive
// a password lockout, cheap. See matchToken and recentlyIssued in
// app/actions/user-auth.ts for the two halves of that balance. Reset tokens are
// deliberately *not* metered — see matchToken.
export const MAX_CODE_ATTEMPTS = 100;
// Password-reset links live longer than login codes: the recipient may open
// the mail on another device and still needs time to choose a new password.
export const RESET_TOKEN_VALID_MINUTES = 30;
// No I, O, 0, 1: codes are meant to be read from an email on one device and
// typed on another.
const AUTH_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateAuthCode(): string {
  let code = "";
  for (let i = 0; i < AUTH_CODE_LENGTH; i++) {
    code += AUTH_CODE_ALPHABET[randomInt(AUTH_CODE_ALPHABET.length)];
  }
  return code;
}

/** Forgives case and stray whitespace in a hand-typed code. */
export function normalizeAuthCode(input: string): string {
  return input.replace(/\s/g, "").toUpperCase();
}

/**
 * Whether a normalized string could be a login code at all. Lets a caller
 * whose one input field accepts either credential tell a wrong password apart
 * from a wrong code. Never a substitute for comparing against the real code.
 */
export function isAuthCodeShaped(normalized: string): boolean {
  return (
    normalized.length === AUTH_CODE_LENGTH &&
    [...normalized].every((char) => AUTH_CODE_ALPHABET.includes(char))
  );
}

// Password-reset tokens travel only inside a link, never typed by hand, so
// they carry far more entropy than login codes (256 bits). Guessing one is
// infeasible; single use and a short lifetime guard the rest.
export function generateResetToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Per-code random salt, stored alongside the hash (see hashAuthCode). */
export function generateAuthCodeSalt(): string {
  return randomBytes(16).toString("hex");
}

// SHA-256 over salt + code (no stretching): codes live for 10 minutes and
// carry ~40 bits of entropy, so hashing only needs to protect against a
// leaked DB snapshot during that window. The salt isn't secret — it's
// stored alongside the hash — but it stops a precomputed table over the
// code alphabet from being reused across codes or guests.
export function hashAuthCode(code: string, salt: string): string {
  return createHash("sha256")
    .update(salt + code)
    .digest("hex");
}

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };
const SCRYPT_KEYLEN = 32;

function scryptDerive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, SCRYPT_KEYLEN, SCRYPT_PARAMS, (err, key) =>
      err ? reject(err) : resolve(key)
    );
  });
}

/** Format: scrypt$<salt base64>$<key base64>, parameters fixed above. */
export async function hashUserPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptDerive(password, salt);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyUserPassword(
  password: string,
  storedHash: string | null
): Promise<boolean> {
  if (!storedHash) return false;
  const [scheme, saltB64, keyB64] = storedHash.split("$");
  if (scheme !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64");
  const actual = await scryptDerive(password, Buffer.from(saltB64, "base64"));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
