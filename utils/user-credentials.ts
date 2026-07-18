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
