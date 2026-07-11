import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { POST as createDay } from "@/app/api/admin/create-day/route";
import { POST as createEvent } from "@/app/api/admin/create-event/route";
import { POST as createGuest } from "@/app/api/admin/create-guest/route";
import { POST as createLocation } from "@/app/api/admin/create-location/route";
import { POST as createProposal } from "@/app/api/admin/create-proposal/route";
import { POST as createRsvp } from "@/app/api/admin/create-rsvp/route";
import { POST as createSession } from "@/app/api/admin/create-session/route";
import { GET as listUsers } from "@/app/api/admin/users/route";
import { ADMIN_VERIFIED_HEADER } from "@/utils/auth";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

// Auth for /api/admin/* is decided once, in the proxy. These tests pin the
// other half of that contract: a route must fail closed when it is reached
// *without* the proxy's verified header, so that a matcher change or a
// middleware-bypass bug can never leave the seeding API wide open. A valid
// admin cookie on the request must not help — only the proxy may vouch.
const routes: [string, (req: Request) => Promise<Response>][] = [
  ["create-day", createDay],
  ["create-event", createEvent],
  ["create-guest", createGuest],
  ["create-location", createLocation],
  ["create-proposal", createProposal],
  ["create-rsvp", createRsvp],
  ["create-session", createSession],
  ["users", listUsers],
];

describe("/api/admin/* routes reached without the proxy", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  it.each(routes)("%s returns a no-store 401", async (name, handler) => {
    const res = await handler(
      new Request(`http://test/api/admin/${name}`, {
        method: "POST",
        body: "{}",
      })
    );
    expect(res.status).toBe(401);
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it.each(routes)(
    "%s rejects a client-forged verified header value",
    async (name, handler) => {
      const res = await handler(
        new Request(`http://test/api/admin/${name}`, {
          method: "POST",
          body: "{}",
          headers: { [ADMIN_VERIFIED_HEADER]: "true" },
        })
      );
      expect(res.status).toBe(401);
    }
  );
});
