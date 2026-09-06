import { DateTime } from "luxon";
import { getRepositories } from "@/db/container";
import type { DueReminderCandidate } from "@/db/repositories/interfaces";
import { isMailerConfigured, sendMail } from "@/utils/mailer";
import { sessionPath } from "@/utils/notifications";
import { siteUrl } from "@/utils/site-url";
import { attendeeCountHeadsUpEmail } from "@/emails/attendee-count-headsup";
import { attendeeCountFollowUpEmail } from "@/emails/attendee-count-followup";
import {
  ABANDON_AFTER_HOURS,
  followUpEligible,
  headsUpEligible,
  reminderNoticeText,
} from "@/utils/reminder-schedule";

export type DispatchSummary = {
  /** In-app notifications created. */
  notified: number;
  /**
   * Reminders *settled* — a confirmed send, or nothing to mail. Not "emails
   * sent": what the caller needs is how many this run finished with, whatever
   * the mail configuration.
   */
  sent: number;
  /** Candidates that never got a claim: ineligible, or the claim was lost. */
  skipped: number;
  failed: number;
  abandoned: number;
};

const ABANDON_AFTER_MS = ABANDON_AFTER_HOURS * 60 * 60 * 1000;

// One dispatch run. Takes `now` as an argument rather than reading the clock,
// so tests drive it without a timer.
//
// A reminder is delivered on two channels: the in-app notification always,
// the email only where there is one to send. An instance with no mail
// configured still reminds its hosts (FR-021).
export async function dispatchDueReminders(
  now: Date
): Promise<DispatchSummary> {
  const summary: DispatchSummary = {
    notified: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    abandoned: 0,
  };

  const { notifications, reminders } = getRepositories();
  const base = siteUrl();
  for (const candidate of await reminders.listCandidates(now)) {
    if (!eligible(candidate, now)) {
      summary.skipped += 1;
      continue;
    }
    const key = {
      sessionId: candidate.sessionId,
      guestId: candidate.guestId,
      kind: candidate.kind,
    };
    const { claimed, notifyOwed } = await reminders.claim(
      key,
      candidate.dueTime,
      now
    );
    if (!claimed) {
      summary.skipped += 1;
      continue;
    }

    if (notifyOwed) {
      await notifications.create({
        guestId: candidate.guestId,
        type:
          candidate.kind === "headsUp"
            ? "sessionHeadsUp"
            : "attendeeCountReminder",
        text: reminderNoticeText(candidate.kind, candidate.sessionTitle),
        url: recordPath(candidate),
        createdAt: now,
      });
      await reminders.markNotified(key, now);
      summary.notified += 1;
    }

    // Nothing to mail is not a failure and has nothing to retry: the claim
    // already settled the reminder, so this only drops a stale failure
    // history. Never markSent — no email went out.
    const email = candidate.guestEmail;
    if (
      email === null ||
      !candidate.reminderOptIn ||
      !isMailerConfigured() ||
      base === null
    ) {
      await reminders.markSkipped(key);
      summary.sent += 1;
      continue;
    }

    try {
      await sendMail({ to: email, ...message(candidate, base) });
      await reminders.markSent(key, now);
      summary.sent += 1;
    } catch (err) {
      // One host's mail server refusing must not cost the others theirs.
      const { abandoned } = await reminders.markFailed(
        key,
        now,
        ABANDON_AFTER_MS
      );
      if (abandoned) {
        summary.abandoned += 1;
        // Names the session and the kind only: a recipient's address is
        // personal data and never belongs in a log (FR-016).
        console.error(
          `Abandoning ${candidate.kind} reminder for session ${candidate.sessionId} after ${ABANDON_AFTER_HOURS}h of failures:`,
          err
        );
      } else {
        summary.failed += 1;
      }
    }
  }
  return summary;
}

function eligible(candidate: DueReminderCandidate, now: Date): boolean {
  return candidate.kind === "headsUp"
    ? headsUpEligible({
        now,
        startTime: candidate.sessionStartTime,
        endTime: candidate.sessionEndTime,
        breakMinutes: candidate.eventBreakMinutes,
        storedDueTime: candidate.storedDueTime,
        alreadyNotifiedHost: candidate.storedNotifiedAt !== null,
      })
    : followUpEligible({
        now,
        endTime: candidate.sessionEndTime,
        hasRecordedCount: candidate.hasRecordedCount,
        storedDueTime: candidate.storedDueTime,
        storedClaimedAt: candidate.storedClaimedAt,
      });
}

// Where the reminder points. The follow-up adds the auto-focus parameter only
// it uses; see research.md §8.
function recordPath(candidate: DueReminderCandidate): string {
  const path = sessionPath(candidate.eventSlug, candidate.sessionId);
  return candidate.kind === "headsUp" ? path : `${path}&record=count`;
}

function message(candidate: DueReminderCandidate, base: string) {
  const url = base + recordPath(candidate);
  if (candidate.kind === "headsUp") {
    return attendeeCountHeadsUpEmail({
      title: candidate.sessionTitle,
      time: formatInEventZone(
        new Date(
          candidate.sessionStartTime.getTime() +
            candidate.eventBreakMinutes * 60 * 1000
        ),
        candidate.eventTimezone
      ),
      location: candidate.sessionLocationNames.join(", ") || "No location",
      sessionUrl: url,
    });
  }
  return attendeeCountFollowUpEmail({
    title: candidate.sessionTitle,
    time: formatInEventZone(candidate.sessionEndTime, candidate.eventTimezone),
    recordUrl: url,
  });
}

// The shipped container runs in UTC, so a time formatted in the ambient zone
// is invisible in development and wrong in production (Constitution IV).
function formatInEventZone(instant: Date, timezone: string): string {
  return DateTime.fromJSDate(instant)
    .setZone(timezone)
    .toFormat("cccc d LLLL, HH:mm");
}
