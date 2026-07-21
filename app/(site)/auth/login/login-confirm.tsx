"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../../context";
import { GuestLoginForm } from "../../guest-login-form";
import { SetPasswordForm } from "./set-password-form";

export function LoginConfirm({
  guestId,
  guestName,
  code,
  hasPassword,
}: {
  guestId: string;
  guestName: string;
  code: string;
  hasPassword: boolean;
}) {
  const router = useRouter();
  const { applyUser } = useContext(UserContext);
  // Set once login succeeds for a guest with no password yet, so the same
  // code can be reused inline to set one instead of a second trip to
  // Settings.
  const [loggedInCredential, setLoggedInCredential] = useState<string | null>(
    null
  );

  const goHome = () => {
    router.push("/");
    router.refresh();
  };

  if (loggedInCredential !== null) {
    return <SetPasswordForm credential={loggedInCredential} onDone={goHome} />;
  }

  return (
    <GuestLoginForm
      guestId={guestId}
      guestName={guestName}
      initialCredential={code}
      onSuccess={(credential) => {
        applyUser?.(guestId);
        if (hasPassword) {
          goHome();
        } else {
          setLoggedInCredential(credential);
        }
      }}
    />
  );
}
