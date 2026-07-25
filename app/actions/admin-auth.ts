"use server";

import {
  verifyAdminPassword,
  createAdminAuthCookie,
  createAdminLogoutCookie,
  isAdminEnabled,
  safeRedirectPath,
} from "@/utils/auth";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import {
  TOO_MANY_ATTEMPTS_ERROR,
  clientKeyFromHeaders,
  isLoginBlocked,
  recordLoginFailure,
} from "@/utils/login-rate-limit";

export async function adminLoginAction(
  prevState: { error: string } | null,
  formData: FormData
) {
  const password = formData.get("admin-password") as string;
  const redirectTo = safeRedirectPath(
    formData.get("redirect") as string,
    "/admin"
  );

  if (!isAdminEnabled()) {
    return { error: "Admin access is disabled" };
  }

  if (!password) {
    return { error: "Password is required" };
  }

  const clientKey = clientKeyFromHeaders(await headers());
  if (isLoginBlocked("admin", clientKey)) {
    return { error: TOO_MANY_ATTEMPTS_ERROR };
  }

  if (verifyAdminPassword(password)) {
    (await cookies()).set(await createAdminAuthCookie());
    redirect(redirectTo);
  }

  recordLoginFailure("admin", clientKey);
  return { error: "Invalid password" };
}

export async function adminLogoutAction() {
  (await cookies()).set(createAdminLogoutCookie());
  redirect("/admin/login");
}
