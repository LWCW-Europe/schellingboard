"use client";
import { useState } from "react";
import {
  loginAsGuestAction,
  requestLoginCodeAction,
  requestPasswordLinkAction,
} from "@/app/actions/user-auth";
import { PasswordManagerHint } from "@/app/password-manager-hint";

// Credential prompt for switching to a protected guest: accepts either the
// permanent password or an emailed single-use login code in one field, with a
// button to email a fresh code and a "forgot password" link that emails a
// reset link instead.
export function GuestLoginForm({
  guestId,
  guestName,
  initialCredential = "",
  onSuccess,
}: {
  guestId: string;
  guestName: string;
  initialCredential?: string;
  onSuccess: () => void;
}) {
  const [credential, setCredential] = useState(initialCredential);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await loginAsGuestAction(guestId, credential);
      if (result.ok) {
        onSuccess();
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong — try again");
    } finally {
      setBusy(false);
    }
  };

  const requestCode = async () => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await requestLoginCodeAction(guestId);
      if (result.ok) {
        setInfo("Code sent — check your email");
      } else if (result.throttled) {
        setInfo(result.error);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong — try again");
    } finally {
      setBusy(false);
    }
  };

  const forgotPassword = async () => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await requestPasswordLinkAction(guestId);
      if (result.ok) {
        setInfo("Reset link sent — check your email to set a new password");
      } else if (result.throttled) {
        setInfo(result.error);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong — try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <p className="text-sm text-fg-muted">
        {guestName} has protected their account. Enter their password, or use a
        single-use code emailed to them. Forgot the password? Reset it instead.
      </p>
      <PasswordManagerHint username={guestName} />
      <label
        htmlFor="guest-credential"
        className="text-sm font-medium text-fg-muted"
      >
        Password or emailed code
      </label>
      <input
        id="guest-credential"
        type="password"
        autoComplete="current-password"
        value={credential}
        onChange={(e) => setCredential(e.target.value)}
        className="rounded-md border border-line px-3 py-2 text-sm focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none"
      />
      {error && <p className="text-sm text-danger-fg">{error}</p>}
      {info && <p className="text-sm text-success-fg">{info}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={busy || credential.length === 0}
          className="bg-brand text-on-brand font-semibold px-4 py-2 rounded shadow text-sm disabled:bg-surface-hover disabled:text-fg-subtle disabled:shadow-none hover:bg-brand-hover active:bg-brand-hover"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => void requestCode()}
          disabled={busy}
          className="text-sm text-brand-fg hover:text-brand-fg-hover underline disabled:text-fg-subtle"
        >
          Email me a code
        </button>
        <button
          type="button"
          onClick={() => void forgotPassword()}
          disabled={busy}
          className="text-sm text-fg-subtle hover:text-fg-muted underline disabled:text-fg-subtle"
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
}
