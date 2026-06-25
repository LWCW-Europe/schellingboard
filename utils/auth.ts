import { NextRequest, NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "site-auth";
export const ADMIN_COOKIE_NAME = "admin-auth";
export const ADMIN_DISABLED_MESSAGE =
  "Admin UI is disabled: set the ADMIN_PASSWORD environment variable on the server to enable it. See the project documentation.";
const ADMIN_SCOPE = "admin";
const COOKIE_MAX_AGE_SEC = 7 * 24 * 60 * 60;
const COOKIE_MAX_AGE_MS = COOKIE_MAX_AGE_SEC * 1000;

/**
 * Returns a safe same-origin redirect path, or `fallback` if `value` could
 * navigate off-site.
 *
 * Attack vector: the post-login redirect target is attacker-controllable via a
 * crafted link (e.g. `/login?redirect=//evil.com`). Without validation a user
 * who logs in is then bounced to an external site — a phishing aid. Browsers
 * also treat `\` and stripped tabs/newlines as `/`, so `/%5Cevil.com` becomes
 * `//evil.com`, etc.
 *
 * We parse the value with the WHATWG URL parser (the `URL` constructor) against
 * a dummy origin, and accept it only if it stays on that origin and the
 * normalized path is not itself protocol-relative.
 *
 * Best effort only: the browser re-parses the eventual `Location` header with
 * its own WHATWG implementation, which may differ from ours on edge cases, so
 * we cannot guarantee every case is covered.
 */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback: string
): string {
  if (!value) {
    return fallback;
  }
  try {
    const url = new URL(value, "http://x");
    if (url.origin !== "http://x" || url.pathname.startsWith("//")) {
      return fallback;
    }
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}

export function isPasswordProtectionEnabled(): boolean {
  return !!process.env.SITE_PASSWORD;
}

export function isPasswordProtectionEnabledServer(): boolean {
  return !!process.env.SITE_PASSWORD;
}

export function verifyPassword(inputPassword: string): boolean {
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) {
    return true; // No protection if password not set
  }
  return inputPassword === sitePassword;
}

export function isAdminEnabled(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

export function verifyAdminPassword(inputPassword: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return false; // Admin access disabled entirely when no password is set
  }
  return inputPassword === adminPassword;
}

const MIN_AUTH_SECRET_LENGTH = 32;

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET environment variable must be set when SITE_PASSWORD or ADMIN_PASSWORD is set"
    );
  }
  if (secret.length < MIN_AUTH_SECRET_LENGTH) {
    throw new Error(
      `AUTH_SECRET must be at least ${MIN_AUTH_SECRET_LENGTH} characters; generate one with \`openssl rand -base64 32\``
    );
  }
  return secret;
}

const encoder = new TextEncoder();

async function importHmacKey(usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToBytes(s: string): Uint8Array<ArrayBuffer> {
  const padded =
    s.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (s.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// The scope is part of the signed payload so a cookie signed for one scope
// (e.g. site auth) can never validate for another (e.g. admin auth).
async function signCookieValue(scope = ""): Promise<string> {
  const issuedAt = Date.now().toString();
  const payload = scope ? `${scope}.${issuedAt}` : issuedAt;
  const key = await importHmacKey("sign");
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${bytesToBase64Url(new Uint8Array(sig))}`;
}

async function isSignedCookieValid(
  value: string | undefined,
  scope: string
): Promise<boolean> {
  if (!value) return false;

  let rest = value;
  if (scope) {
    if (!rest.startsWith(`${scope}.`)) return false;
    rest = rest.slice(scope.length + 1);
  }

  const dot = rest.indexOf(".");
  if (dot < 0) return false;
  const timestamp = rest.slice(0, dot);
  const sig = rest.slice(dot + 1);

  if (!/^\d+$/.test(timestamp)) return false;
  const issuedAt = Number(timestamp);
  if (!Number.isSafeInteger(issuedAt)) return false;
  const age = Date.now() - issuedAt;
  if (age < 0 || age > COOKIE_MAX_AGE_MS) return false;

  let sigBytes: Uint8Array<ArrayBuffer>;
  try {
    sigBytes = base64UrlToBytes(sig);
  } catch {
    return false;
  }

  const payload = scope ? `${scope}.${timestamp}` : timestamp;
  const key = await importHmacKey("verify");
  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payload));
}

export async function isAuthCookieValid(
  value: string | undefined
): Promise<boolean> {
  if (!isPasswordProtectionEnabled()) return true;
  return isSignedCookieValid(value, "");
}

export async function isAdminCookieValid(
  value: string | undefined
): Promise<boolean> {
  if (!isAdminEnabled()) return false;
  return isSignedCookieValid(value, ADMIN_SCOPE);
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return isAuthCookieValid(cookie);
}

function cookieOptions(maxAge: number) {
  return {
    maxAge,
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

// Cookie attributes are spread flat onto the returned object — NOT nested under
// an `options` key. Next's `cookies().set(obj)` reads cookie attributes
// (maxAge, httpOnly, secure, sameSite, path) from the top level of `obj`; a
// nested `options` key is silently ignored, which downgrades the cookie to a
// session cookie with no HttpOnly/Secure. See tests/unit/auth.test.ts
// ("emitted Set-Cookie header").
export async function createAuthCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: await signCookieValue(),
    ...cookieOptions(COOKIE_MAX_AGE_SEC),
  };
}

export function createLogoutCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: "",
    ...cookieOptions(0),
  };
}

export async function createAdminAuthCookie() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: await signCookieValue(ADMIN_SCOPE),
    ...cookieOptions(COOKIE_MAX_AGE_SEC),
  };
}

export function createAdminLogoutCookie() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: "",
    ...cookieOptions(0),
  };
}

export async function requireAuth(
  request: NextRequest
): Promise<NextResponse | null> {
  if (!isPasswordProtectionEnabled()) {
    return null;
  }
  if (await isAuthenticated(request)) {
    return null;
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "redirect",
    request.nextUrl.pathname + request.nextUrl.search
  );
  return NextResponse.redirect(loginUrl);
}

export async function isAdminAuthenticated(
  request: NextRequest
): Promise<boolean> {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isAdminCookieValid(cookie);
}

export async function requireAdminAuth(
  request: NextRequest
): Promise<NextResponse | null> {
  if (!isAdminEnabled()) {
    return new NextResponse(ADMIN_DISABLED_MESSAGE, { status: 404 });
  }
  if (await isAdminAuthenticated(request)) {
    return null;
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set(
    "redirect",
    request.nextUrl.pathname + request.nextUrl.search
  );
  return NextResponse.redirect(loginUrl);
}
