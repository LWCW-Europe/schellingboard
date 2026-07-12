import { getRepositories } from "@/db/container";
import type { EmailSettings } from "@/db/repositories/interfaces";
import { sendMail, type EmailMessage } from "@/utils/mailer";

// Send `message` to the guest, iff they have opted in to emails for
// `setting` (see EmailSettings).
//
// An unknown guest id is a no-op rather than an error: notifications should be
// sent after the triggering change is committed, by which time the guest may
// have been deleted.
export async function notifyGuest(
  guestId: string,
  setting: keyof EmailSettings,
  message: EmailMessage
): Promise<void> {
  const guest = await getRepositories().guests.findById(guestId);
  if (!guest || !guest.info.emailSettings[setting]) return;
  await sendMail({ to: guest.info.email, ...message });
}
