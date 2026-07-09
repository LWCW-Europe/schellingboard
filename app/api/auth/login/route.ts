import { NextResponse } from "next/server";
import {
  verifyPassword,
  verifyAdminPassword,
  isPasswordProtectionEnabled,
  isAdminEnabled,
  createAuthCookie,
  createAdminAuthCookie,
} from "@/utils/auth";

export const dynamic = "force-dynamic";

type LoginBody = { password?: string; scope?: "site" | "admin" };

// Exchanges a password for an auth cookie. Mirrors the browser login server
// actions (loginAction / adminLoginAction) but over plain HTTP, so scripts can
// authenticate without replaying Next's server-action wire protocol. Lives
// under /api/auth/, which the middleware allows through without a prior cookie.
export async function POST(req: Request) {
  let parsed: unknown;
  try {
    parsed = await req.json();
  } catch {
    parsed = undefined;
  }
  if (typeof parsed !== "object" || parsed === null) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { password = "", scope = "site" } = parsed as LoginBody;

  // Strict, so a script's typo'd scope fails loudly instead of silently
  // falling back to site auth.
  if (scope !== "site" && scope !== "admin") {
    return NextResponse.json({ error: "Unknown scope" }, { status: 400 });
  }

  if (scope === "admin") {
    if (!isAdminEnabled()) {
      return NextResponse.json(
        { error: "Admin access is disabled" },
        { status: 403 }
      );
    }
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(await createAdminAuthCookie());
    return res;
  }

  // scope === "site": when protection is disabled every request is already
  // authorized, so there is nothing to hand out.
  if (!isPasswordProtectionEnabled()) {
    return NextResponse.json({ ok: true });
  }
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(await createAuthCookie());
  return res;
}
