"use server";

import {
  verifyPassword,
  createAuthCookie,
  createLogoutCookie,
  isPasswordProtectionEnabled,
} from "@/utils/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;
  let redirectTo = (formData.get("redirect") as string) || "/";
  // Only allow same-origin paths ("//host" would be a protocol-relative URL)
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    redirectTo = "/";
  }

  if (!isPasswordProtectionEnabled()) {
    redirect(redirectTo);
  }

  if (!password) {
    return { error: "Password is required" };
  }

  if (verifyPassword(password)) {
    (await cookies()).set(await createAuthCookie());
    redirect(redirectTo);
  }

  return { error: "Invalid password" };
}

export async function logoutAction() {
  (await cookies()).set(createLogoutCookie());
  redirect("/");
}
