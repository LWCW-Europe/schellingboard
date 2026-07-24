"use client";
import { useState } from "react";
import {
  loginAsGuestAction,
  requestLoginCodeAction,
  requestPasswordLinkAction,
} from "@/app/actions/user-auth";

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
        setInfo("A recently emailed code is still valid — check your inbox");
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
        setInfo(
          "A recently emailed reset link is still valid — check your inbox"
        );
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
      <p className="text-sm text-gray-600">
        {guestName} has protected their account. Enter their password, or use a
        single-use code emailed to them. Forgot the password? Reset it instead.
      </p>
      {/* Hints the browser's password manager which guest this credential
          belongs to, so switching between guests on a shared device saves
          distinct entries instead of overwriting one another. */}
      <input
        type="text"
        autoComplete="username"
        value={guestName}
        readOnly
        aria-hidden="true"
        tabIndex={-1}
        className="hidden"
      />
      <label
        htmlFor="guest-credential"
        className="text-sm font-medium text-gray-700"
      >
        Password or emailed code
      </label>
      <input
        id="guest-credential"
        type="password"
        autoComplete="current-password"
        value={credential}
        onChange={(e) => setCredential(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {info && <p className="text-sm text-green-700">{info}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={busy || credential.length === 0}
          className="bg-rose-400 text-white font-semibold px-4 py-2 rounded shadow text-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:bg-rose-500 active:bg-rose-500"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => void requestCode()}
          disabled={busy}
          className="text-sm text-rose-500 hover:text-rose-600 underline disabled:text-gray-400"
        >
          Email me a code
        </button>
        <button
          type="button"
          onClick={() => void forgotPassword()}
          disabled={busy}
          className="text-sm text-gray-500 hover:text-gray-700 underline disabled:text-gray-400"
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
}
