"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  changePasswordAction,
  disableProtectionAction,
  requestPasswordLinkAction,
} from "@/app/actions/user-auth";
import { PasswordManagerHint } from "@/app/password-manager-hint";

type Mode = "password" | "disable";

const inputClass =
  "rounded-md border border-line px-3 py-2 text-sm focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none";

/**
 * Enable/disable account protection and change the password.
 *
 * Enabling protection and recovering a forgotten password both go through a
 * link emailed to the guest (proving control of the address on file — the gate
 * that stops anyone else claiming the name). Changing the password or turning
 * protection off is done here with the current password; no email is sent to
 * start, only a heads-up afterwards.
 */
export function AccountSecurity({
  guestId,
  guestName,
  authProtected,
}: {
  guestId: string;
  guestName: string;
  authProtected: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Emails a link to set (enable) or reset (forgot) the password. A throttled
  // response means a recent link is still valid — information, not an error.
  const sendPasswordLink = async () => {
    setBusy(true);
    setError(null);
    setInfo(null);
    setSuccess(null);
    try {
      const result = await requestPasswordLinkAction(guestId);
      if (result.ok) {
        setInfo("Check your email for a link to set your password");
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

  const startMode = (next: Mode) => {
    setMode(next);
    setCurrentPassword("");
    setNewPassword("");
    setError(null);
    setInfo(null);
    setSuccess(null);
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const result =
        mode === "disable"
          ? await disableProtectionAction(currentPassword)
          : await changePasswordAction(currentPassword, newPassword);
      if (result.ok) {
        setMode(null);
        setSuccess(
          mode === "disable" ? "Protection turned off" : "Password changed"
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
        <p className="text-sm text-fg-subtle">
          Your name is protected: switching to it requires your password or a
          single-use code emailed to you. Forgot your password? Reset it with an
          emailed link.
        </p>
      ) : (
        <p className="text-sm text-fg-subtle">
          Anyone can currently act under your name. Enable protection so
          switching to your name requires your password. We&apos;ll email you a
          link to set it.
        </p>
      )}
      {success && (
        <p role="status" className="text-sm text-success-fg">
          {success}
        </p>
      )}

      {mode === null ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {authProtected ? (
              <>
                <button
                  type="button"
                  onClick={() => startMode("password")}
                  className="bg-brand text-on-brand font-semibold px-4 py-2 rounded shadow text-sm hover:bg-brand-hover active:bg-brand-hover"
                >
                  Change password
                </button>
                <button
                  type="button"
                  onClick={() => void sendPasswordLink()}
                  disabled={busy}
                  className="border border-line text-fg-muted font-semibold px-4 py-2 rounded text-sm hover:bg-surface-sunken disabled:text-fg-subtle"
                >
                  Forgot your password?
                </button>
                <button
                  type="button"
                  onClick={() => startMode("disable")}
                  className="border border-line text-fg-muted font-semibold px-4 py-2 rounded text-sm hover:bg-surface-sunken"
                >
                  Turn off protection
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void sendPasswordLink()}
                disabled={busy}
                className="bg-brand text-on-brand font-semibold px-4 py-2 rounded shadow text-sm hover:bg-brand-hover active:bg-brand-hover disabled:bg-surface-hover disabled:text-fg-subtle"
              >
                Enable protection
              </button>
            )}
          </div>
          {info && (
            <p role="status" className="text-sm text-success-fg">
              {info}
            </p>
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
          <p className="text-sm text-fg-muted">
            {mode === "password"
              ? "Enter your current password and choose a new one."
              : "Enter your current password to turn off protection. This also removes your password."}
          </p>
          <PasswordManagerHint username={guestName} />
          <label
            htmlFor="security-current-password"
            className="text-sm font-medium text-fg-muted"
          >
            Current password
          </label>
          <input
            id="security-current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
          />
          {mode === "password" && (
            <>
              <label
                htmlFor="security-new-password"
                className="text-sm font-medium text-fg-muted"
              >
                New password (at least 8 characters)
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
            <p role="alert" className="text-sm text-danger-fg">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={
                busy ||
                currentPassword.length === 0 ||
                (mode === "password" && newPassword.length === 0)
              }
              className="bg-brand text-on-brand font-semibold px-4 py-2 rounded shadow text-sm disabled:bg-surface-hover disabled:text-fg-subtle disabled:shadow-none hover:bg-brand-hover active:bg-brand-hover"
            >
              {mode === "password" ? "Change password" : "Turn off protection"}
            </button>
            <button
              type="button"
              onClick={() => setMode(null)}
              disabled={busy}
              className="text-sm text-fg-subtle hover:text-fg-muted underline disabled:text-fg-subtle"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
