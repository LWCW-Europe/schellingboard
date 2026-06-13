"use server";

import {
  verifyAdminPassword,
  createAdminAuthCookie,
  createAdminLogoutCookie,
  isAdminEnabled,
} from "@/utils/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function adminLoginAction(
  prevState: { error: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;
  let redirectTo = (formData.get("redirect") as string) || "/admin";
  // Only allow same-origin paths ("//host" would be a protocol-relative URL)
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    redirectTo = "/admin";
  }

  if (!isAdminEnabled()) {
    return { error: "Admin access is disabled" };
  }

  if (!password) {
    return { error: "Password is required" };
  }

  if (verifyAdminPassword(password)) {
    (await cookies()).set(await createAdminAuthCookie());
    redirect(redirectTo);
  }

  return { error: "Invalid password" };
}

export async function adminLogoutAction() {
  (await cookies()).set(createAdminLogoutCookie());
  redirect("/admin/login");
}
