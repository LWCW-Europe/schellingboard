CREATE TABLE `session_reminders` (
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`kind` text NOT NULL,
	`due_time` text NOT NULL,
	`claimed_at` text,
	`sent_at` text,
	`first_failed_at` text,
	`notified_at` text,
	PRIMARY KEY(`session_id`, `guest_id`, `kind`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `session_reminders_session_idx` ON `session_reminders` (`session_id`);--> statement-breakpoint
ALTER TABLE `guests` ADD `email_on_session_heads_up` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `guests` ADD `email_on_attendee_count_reminder` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD `attendee_count` integer;--> statement-breakpoint
-- Hand-written backfill (see docs/dev/migrations.md): settle the follow-up for
-- every session whose reminder was already due before this feature existed. A
-- follow-up is deliberately never dropped for being late, so without this the
-- first dispatch tick after an upgrade would notify and mail every host of
-- every uncounted session in the event history. The due time must match
-- followUpDueTime() to the millisecond or the row reads as a reschedule.
INSERT INTO `session_reminders` (`session_id`, `guest_id`, `kind`, `due_time`, `claimed_at`, `notified_at`)
SELECT
	h.`session_id`,
	h.`guest_id`,
	'followUp',
	strftime('%Y-%m-%dT%H:%M:%fZ', s.`end_time`, '+15 minutes'),
	strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
	strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
FROM `session_hosts` h
JOIN `sessions` s ON s.`id` = h.`session_id`
WHERE s.`end_time` IS NOT NULL
	AND strftime('%Y-%m-%dT%H:%M:%fZ', s.`end_time`, '+15 minutes') <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now');