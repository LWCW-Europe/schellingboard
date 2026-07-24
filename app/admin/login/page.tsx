"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/app/input";
import clsx from "clsx";
import { useActionState } from "react";
import { adminLoginAction } from "../../actions/admin-auth";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/admin";
  const [state, formAction] = useActionState(adminLoginAction, null);

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Access</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please enter the admin password
        </p>
      </div>

      <form className="mt-8 space-y-6" action={formAction}>
        <input type="hidden" name="redirect" value={redirectTo} />
        {/* Hints the browser's password manager to save this under a
            distinct entry rather than confusing it with the site login,
            which is a separate credential on the same origin. */}
        <input
          type="text"
          name="username"
          autoComplete="username"
          value="admin-password"
          readOnly
          aria-hidden="true"
          tabIndex={-1}
          className="hidden"
        />

        <div>
          <label htmlFor="admin-password" className="sr-only">
            Password
          </label>
          <Input
            id="admin-password"
            name="admin-password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter admin password"
            error={!!state?.error}
            errorMessage={state?.error}
            className="w-full"
            autoFocus
          />
        </div>

        <div>
          <button
            type="submit"
            className={clsx(
              "group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500",
              "bg-rose-600 hover:bg-rose-700"
            )}
          >
            Access Admin
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
