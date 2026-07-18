"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  requestAuthCodeAction,
  updateAuthSecurityAction,
} from "@/app/actions/user-auth";

type Mode = "enable" | "password" | "disable";

const inputClass =
  "rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none";

/**
 * Enable/disable account protection and set a permanent password. Every
 * change requires a code emailed to the guest, so a forgotten password is
 * never a problem: requesting a code and setting a new password is the same
 * flow as setting it the first time.
 */
export function AccountSecurity({
  guestId,
  authProtected,
}: {
  guestId: string;
  authProtected: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode | null>(null);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Emails a code and reflects the outcome. A throttled response means a
  // recent code is still valid — information, not an error from the user's
  // point of view — so both entry points present it the same friendly way.
  const sendCode = async () => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await requestAuthCodeAction(guestId);
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

  const startMode = async (next: Mode) => {
    setMode(next);
    setCode("");
    setNewPassword("");
    setSuccess(null);
    await sendCode();
  };

  const requestCode = sendCode;

  const submit = async () => {
    if (mode === "password" && newPassword.length === 0) {
      setError("Enter a new password");
      return;
    }
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await updateAuthSecurityAction({
        code,
        protect: mode !== "disable",
        newPassword: newPassword.length > 0 ? newPassword : undefined,
      });
      if (result.ok) {
        setMode(null);
        setSuccess(
          mode === "disable"
            ? "Protection turned off"
            : mode === "password"
              ? "Password changed"
              : "Protection enabled"
        );
        router.refresh();
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
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Account security</h2>
      {authProtected ? (
        <p className="text-sm text-gray-500">
          Your name is protected: switching to it requires your password or a
          code emailed to you. Forgot your password? An emailed code is all you
          need to set a new one.
        </p>
      ) : (
        <p className="text-sm text-gray-500">
          Anyone can currently act under your name. Enable protection so
          switching to your name requires your password or a code emailed to
          you.
        </p>
      )}
      {success && (
        <p role="status" className="text-sm text-green-700">
          {success}
        </p>
      )}

      {mode === null ? (
        <div className="flex flex-wrap gap-2">
          {authProtected ? (
            <>
              <button
                type="button"
                onClick={() => void startMode("password")}
                className="bg-rose-400 text-white font-semibold px-4 py-2 rounded shadow text-sm hover:bg-rose-500 active:bg-rose-500"
              >
                Change password
              </button>
              <button
                type="button"
                onClick={() => void startMode("disable")}
                className="border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded text-sm hover:bg-gray-50"
              >
                Turn off protection
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => void startMode("enable")}
              className="bg-rose-400 text-white font-semibold px-4 py-2 rounded shadow text-sm hover:bg-rose-500 active:bg-rose-500"
            >
              Enable protection
            </button>
          )}
        </div>
      ) : (
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <p className="text-sm text-gray-600">
            {mode === "enable" &&
              "To confirm it's you, enter the code emailed to you. You can also set a permanent password now or later."}
            {mode === "password" &&
              "Enter the code emailed to you and your new password."}
            {mode === "disable" &&
              "Enter the code emailed to you to turn off protection. This also removes your password."}
          </p>
          <label
            htmlFor="security-code"
            className="text-sm font-medium text-gray-700"
          >
            Emailed code
          </label>
          <input
            id="security-code"
            type="text"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={inputClass}
          />
          {mode !== "disable" && (
            <>
              <label
                htmlFor="security-new-password"
                className="text-sm font-medium text-gray-700"
              >
                {mode === "enable"
                  ? "Password (optional, at least 8 characters)"
                  : "New password (at least 8 characters)"}
              </label>
              <input
                id="security-new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
            </>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="text-sm text-green-700">
              {info}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={busy || code.trim().length === 0}
              className="bg-rose-400 text-white font-semibold px-4 py-2 rounded shadow text-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:bg-rose-500 active:bg-rose-500"
            >
              {mode === "enable" && "Enable protection"}
              {mode === "password" && "Change password"}
              {mode === "disable" && "Turn off protection"}
            </button>
            <button
              type="button"
              onClick={() => void requestCode()}
              disabled={busy}
              className="text-sm text-rose-500 hover:text-rose-600 underline disabled:text-gray-400"
            >
              Email me a new code
            </button>
            <button
              type="button"
              onClick={() => setMode(null)}
              disabled={busy}
              className="text-sm text-gray-500 hover:text-gray-700 underline disabled:text-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
