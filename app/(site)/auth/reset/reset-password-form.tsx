"use client";
import { useState } from "react";
import Link from "next/link";
import { setPasswordWithTokenAction } from "@/app/actions/user-auth";

// Sets a new password from a reset link. Grants no session, so on success it
// points the guest at the home page to log in with the password they just set.
export function ResetPasswordForm({
  guestId,
  token,
}: {
  guestId: string;
  token: string;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await setPasswordWithTokenAction(
        guestId,
        token,
        newPassword
      );
      if (result.ok) {
        setDone(true);
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

  if (done) {
    return (
      <div className="flex flex-col gap-3">
        <p role="status" className="text-sm text-green-700">
          Password set. Your name is now protected — log in with your new
          password.
        </p>
        <Link
          href="/"
          className="bg-rose-400 text-white font-semibold px-4 py-2 rounded shadow text-sm hover:bg-rose-500 self-start"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <p className="text-sm text-gray-600">
        Choose a new password. You&apos;ll use it to switch to your name from
        now on.
      </p>
      <label
        htmlFor="reset-new-password"
        className="text-sm font-medium text-gray-700"
      >
        New password (at least 8 characters)
      </label>
      <input
        id="reset-new-password"
        type="password"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={busy || newPassword.length === 0}
          className="bg-rose-400 text-white font-semibold px-4 py-2 rounded shadow text-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:bg-rose-500 active:bg-rose-500"
        >
          Set password
        </button>
      </div>
    </form>
  );
}
