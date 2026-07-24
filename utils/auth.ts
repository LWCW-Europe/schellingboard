import { NextRequest, NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "site-auth";
export const ADMIN_COOKIE_NAME = "admin-auth";
// The single cookie that names the current guest AND, when applicable, proves
// it. Its value carries a level (issue #370):
//   - "open"     — a mere name selection. Unsigned and forgeable, exactly like
//                  the old plain `user` cookie: unprotected guests are freely
//                  impersonable by design, so an open cookie needs no secret
//                  and grants nothing a protected guest's identity relies on.
//   - "verified" — a signed proof that the guest's password/code was checked.
// Reads go only through readGuestCookie (here) and the acting-guest helpers,
// so no caller ever trusts a raw guest id: a protected guest is honoured only
// with a "verified" cookie (see isVerifiedAsGuest).
export const GUEST_COOKIE_NAME = "guest";
export type GuestAuthLevel = "open" | "verified";
export const ADMIN_DISABLED_MESSAGE =
  "Admin UI is disabled: set the ADMIN_PASSWORD environment variable on the server to enable it. See the project documentation.";
// Set by the proxy on requests it has verified carry a valid admin cookie,
// and only then — route handlers trust its presence instead of
// re-validating the cookie themselves. Safe because the proxy always runs
// ahead of the route for real traffic and strips any client-supplied copy of
// this header from every forwarded request before checking auth.
export const ADMIN_VERIFIED_HEADER = "x-admin-verified";
// Without an explicit no-store, browsers heuristically cache admin API
// responses; some carry sensitive data (e.g. user emails) and must never be
// served stale or from cache.
export const NO_STORE = { headers: { "cache-control": "no-store" } };
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
      "AUTH_SECRET environment variable must be set when SITE_PASSWORD or ADMIN_PASSWORD is set or guests protect their name"
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

// Guest ids are nanoids (no dots), so the dot-delimited value stays parseable.
// A "verified" value is `verified.<guestId>.<issuedAt>.<sig>`, signed via the
// scoped signCookieValue so it can't be forged; an "open" value is just
// `open.<guestId>` and isn't. Folding the guest id into the signed scope means
// a proof issued for one guest can never validate for another.
function verifiedScope(guestId: string): string {
  return `verified.${guestId}`;
}

/**
 * Parses and validates the guest cookie into its guest id and level, or null
 * if absent/malformed. A "verified" value must carry a valid, unexpired
 * signature; an "open" value is accepted as-is (it is only ever honoured for
 * an unprotected guest — see isVerifiedAsGuest). Never trust the returned id
 * for a protected guest without also checking the level is "verified".
 */
export async function readGuestCookie(
  value: string | undefined
): Promise<{ guestId: string; level: GuestAuthLevel } | null> {
  if (!value) return null;
  const firstDot = value.indexOf(".");
  if (firstDot < 0) return null;
  const level = value.slice(0, firstDot);

  if (level === "open") {
    const guestId = value.slice(firstDot + 1);
    if (!guestId || guestId.includes(".")) return null;
    return { guestId, level: "open" };
  }

  if (level === "verified") {
    // `verified.<guestId>.<issuedAt>.<sig>`: exactly four parts, so the guest
    // id can't smuggle an extra dot. Signature and expiry are delegated to the
    // shared scoped verifier.
    const parts = value.split(".");
    if (parts.length !== 4) return null;
    const guestId = parts[1];
    if (!guestId) return null;
    try {
      return (await isSignedCookieValid(value, verifiedScope(guestId)))
        ? { guestId, level: "verified" }
        : null;
    } catch {
      // No AUTH_SECRET configured (or another crypto error): this can't be a
      // genuine proof, so treat it as an invalid cookie rather than throwing.
      // A passwordless site with no protected guests has no secret and must
      // still survive a client that sends a forged `verified` value.
      return null;
    }
  }

  return null;
}

// Signing (the "verified" path) needs AUTH_SECRET; the "open" path never does,
// so a passwordless site with no protected guests still runs without a secret.
export async function createGuestCookie(
  guestId: string,
  level: GuestAuthLevel
) {
  return {
    name: GUEST_COOKIE_NAME,
    value:
      level === "verified"
        ? await signCookieValue(verifiedScope(guestId))
        : `open.${guestId}`,
    ...cookieOptions(COOKIE_MAX_AGE_SEC),
  };
}

export function createGuestLogoutCookie() {
  return {
    name: GUEST_COOKIE_NAME,
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

// CSRF defense for the cookie-authenticated admin API: `SameSite=Lax` alone
// doesn't cover cross-site top-level GET navigations (e.g. a link or
// auto-submitting <form method=get>), which still carry the cookie without an
// `Origin` header. `Sec-Fetch-Site` is sent by all modern browsers for those
// requests too, so checking both closes the gap Origin alone leaves open.
// Non-browser clients (curl, scripts) send neither header, so they fall
// through to "trusted" — matching this API's intended audience.
//
// `request.nextUrl.origin` is derived from the Host/X-Forwarded-* headers
// Next.js sees, so this comparison is only correct if a fronting reverse
// proxy forwards `X-Forwarded-Proto`/`Host` accurately; a misconfigured proxy
// that drops `X-Forwarded-Proto` could make this reject legitimate
// same-origin browser requests (e.g. nextUrl resolves to http:// while the
// browser's real Origin is https://).
function isTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return false;
  }
  const site = request.headers.get("sec-fetch-site");
  if (site === "cross-site") {
    return false;
  }
  return true;
}

/**
 * Admin-API counterpart of {@link requireAdminAuth}: same admin-cookie check,
 * plus a CSRF check the UI branch doesn't need (see {@link isTrustedOrigin}
 * — the UI relies on Next's built-in server-action Origin check instead). On
 * failure this returns JSON (matching the API's contract) instead of a
 * redirect to the admin login page; on success it forwards the request with
 * {@link ADMIN_VERIFIED_HEADER} set so the route handler doesn't need to
 * re-check the cookie.
 *
 * Deliberate contract change from the routes' previous per-route checks:
 * those always returned 401 regardless of why auth failed, whereas this
 * returns 404 when the admin API is disabled (mirroring the /admin UI
 * branch), 403 for a cross-site request, and 401 only for a missing/invalid
 * admin cookie. External clients that only branched on 401 need to handle
 * 404 and 403 too.
 */
export async function requireAdminAuthApi(
  request: NextRequest
): Promise<NextResponse> {
  if (!isAdminEnabled()) {
    return NextResponse.json(
      { error: "Admin API is disabled" },
      { ...NO_STORE, status: 404 }
    );
  }
  if (!isTrustedOrigin(request)) {
    return NextResponse.json(
      { error: "Cross-site request rejected" },
      { ...NO_STORE, status: 403 }
    );
  }
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { ...NO_STORE, status: 401 }
    );
  }

  const headers = new Headers(request.headers);
  headers.set(ADMIN_VERIFIED_HEADER, "1");
  return NextResponse.next({ request: { headers } });
}
