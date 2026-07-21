"use client";
import { useState } from "react";
import { updateAuthSecurityAction } from "@/app/actions/user-auth";

// Offered right after a successful emailed-code login, when the guest has no
// password yet. Reuses that same code (still valid within its window) so it
// never has to be retyped in Settings — this is the same "enable protection
// (+ password)" operation as Account security's inline form, just triggered
// here instead.
export function SetPasswordForm({
  credential,
  onDone,
}: {
  credential: string;
  onDone: () => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await updateAuthSecurityAction({
        credential,
        protect: true,
        newPassword,
      });
      if (result.ok) {
        onDone();
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
        You&apos;re logged in. Set a password now so you don&apos;t need an
        emailed code next time.
      </p>
      <label
        htmlFor="login-new-password"
        className="text-sm font-medium text-gray-700"
      >
        Password (at least 8 characters)
      </label>
      <input
        id="login-new-password"
        type="password"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={busy || newPassword.length === 0}
          className="bg-rose-400 text-white font-semibold px-4 py-2 rounded shadow text-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:bg-rose-500 active:bg-rose-500"
        >
          Set password
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={busy}
          className="text-sm text-gray-500 hover:text-gray-700 underline disabled:text-gray-400"
        >
          Not now
        </button>
      </div>
    </form>
  );
}
