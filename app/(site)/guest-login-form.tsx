"use client";
import { useState } from "react";
import {
  loginAsGuestAction,
  requestAuthCodeAction,
} from "@/app/actions/user-auth";

// Credential prompt for switching to a protected guest: accepts either the
// permanent password or an emailed temporary code in one field, with a
// button to request a fresh code.
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
      const result = await requestAuthCodeAction(guestId);
      if (result.ok) {
        setInfo("Code sent — check your email");
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
        {guestName} has protected their account. Enter their password or a code
        emailed to them. No password, or forgot it? Use an emailed code instead.
      </p>
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
      </div>
    </form>
  );
}
