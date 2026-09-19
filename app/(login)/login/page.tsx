"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/app/input";
import { PasswordManagerHint } from "@/app/password-manager-hint";
import clsx from "clsx";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/";
  const [state, formAction] = useActionState(loginAction, null);

  // Hard reload rather than a client-side transition: a soft navigation can
  // render the destination from router-cached pre-login state (see
  // logoutAction's comment for the same issue on the way out).
  useEffect(() => {
    if (state?.redirectTo) {
      window.location.href = state.redirectTo;
    }
  }, [state]);

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-fg">Access Required</h2>
        <p className="mt-2 text-sm text-fg-muted">
          Please enter the password to access this site
        </p>
      </div>

      <form className="space-y-6" action={formAction}>
        <input type="hidden" name="redirect" value={redirectTo} />
        <PasswordManagerHint username="Site Password" />

        <div>
          <label htmlFor="site-password" className="sr-only">
            Password
          </label>
          <Input
            id="site-password"
            name="site-password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter password"
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
              "group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-on-brand transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent",
              "bg-brand hover:bg-brand-hover"
            )}
          >
            Access Site
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
