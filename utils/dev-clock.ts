// Development-only fake clock. See docs/adr/0004-dev-fake-clock.md.
//
// The override is a single integer offset (milliseconds) applied to real time:
// effective time is always `Date.now() + offsetMs`. It is stored in the
// `time-override` cookie and only honoured when SB_ENABLE_DEV_TOOLS is set, so
// the cookie is inert on a normal deployment even if a client forges it.
//
// This module is client-safe: it must not import `next/headers`. The
// request-scoped Server Component / Server Action reader lives in
// `dev-clock-server.ts`.

export const TIME_OFFSET_COOKIE = "time-override";

export function isDevToolsEnabled(): boolean {
  const v = process.env.SB_ENABLE_DEV_TOOLS;
  return v === "1" || v === "true";
}

/**
 * The offset carried by the cookie value, or 0 when dev tools are disabled,
 * the cookie is absent, or its value is not a finite number.
 */
export function parseTimeOffset(raw: string | null | undefined): number {
  if (!raw || !isDevToolsEnabled()) return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export function nowWithOffset(offsetMs: number): Date {
  return new Date(Date.now() + offsetMs);
}

/** Reads the raw override cookie value out of a request's Cookie header. */
export function readTimeOffsetCookie(req: Request): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === TIME_OFFSET_COOKIE) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return undefined;
}

/** Effective "now" for a Route Handler, read from the request's cookies. */
export function requestNow(req: Request): Date {
  return nowWithOffset(parseTimeOffset(readTimeOffsetCookie(req)));
}
