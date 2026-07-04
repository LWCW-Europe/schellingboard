CREATE TABLE `__new_events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`proposal_phase_start` text,
	`proposal_phase_end` text,
	`voting_phase_start` text,
	`voting_phase_end` text,
	`scheduling_phase_start` text,
	`scheduling_phase_end` text,
	`max_session_duration` integer DEFAULT 120 NOT NULL,
	`break_minutes` integer DEFAULT 10 NOT NULL,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`icon` text
);--> statement-breakpoint
INSERT INTO `__new_events` (`id`, `name`, `slug`, `description`, `website`, `start`, `end`, `proposal_phase_start`, `proposal_phase_end`, `voting_phase_start`, `voting_phase_end`, `scheduling_phase_start`, `scheduling_phase_end`, `max_session_duration`, `break_minutes`, `timezone`, `icon`)
SELECT `id`, `name`, replace(`name`, ' ', '-'), `description`, `website`, `start`, `end`, `proposal_phase_start`, `proposal_phase_end`, `voting_phase_start`, `voting_phase_end`, `scheduling_phase_start`, `scheduling_phase_end`, `max_session_duration`, `break_minutes`, `timezone`, `icon` FROM `events`;--> statement-breakpoint
DROP TABLE `events`;--> statement-breakpoint
ALTER TABLE `__new_events` RENAME TO `events`;--> statement-breakpoint
-- Names that differ only in space-vs-dash backfill to the same slug (they used
-- to resolve to the same URL). Keep one row per slug and suffix the rest with
-- their unique id so the index below cannot fail.
UPDATE `events` SET `slug` = `slug` || '-' || `id`
WHERE `id` NOT IN (SELECT min(`id`) FROM `events` GROUP BY `slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);
