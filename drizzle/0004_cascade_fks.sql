-- Recreate all tables that need ON DELETE CASCADE / SET NULL on their FKs.
-- SQLite does not support ALTER TABLE ... ADD FOREIGN KEY, so each table
-- must be recreated.  FK enforcement is disabled until after migrations run
-- (see container.ts — PRAGMA foreign_keys=ON is set after migrate()).

-- days: event_id → cascade
CREATE TABLE `days_new` (
	`id` text PRIMARY KEY NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`start_bookings` text NOT NULL,
	`end_bookings` text NOT NULL,
	`event_id` text REFERENCES `events`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `days_new` SELECT * FROM `days`;
--> statement-breakpoint
DROP TABLE `days`;
--> statement-breakpoint
ALTER TABLE `days_new` RENAME TO `days`;
--> statement-breakpoint

-- event_guests: both FKs → cascade
CREATE TABLE `event_guests_new` (
	`event_id` text NOT NULL REFERENCES `events`(`id`) ON DELETE CASCADE,
	`guest_id` text NOT NULL REFERENCES `guests`(`id`) ON DELETE CASCADE,
	PRIMARY KEY(`event_id`, `guest_id`)
);
--> statement-breakpoint
INSERT INTO `event_guests_new` SELECT * FROM `event_guests`;
--> statement-breakpoint
DROP TABLE `event_guests`;
--> statement-breakpoint
ALTER TABLE `event_guests_new` RENAME TO `event_guests`;
--> statement-breakpoint

-- event_locations: both FKs → cascade
CREATE TABLE `event_locations_new` (
	`event_id` text NOT NULL REFERENCES `events`(`id`) ON DELETE CASCADE,
	`location_id` text NOT NULL REFERENCES `locations`(`id`) ON DELETE CASCADE,
	PRIMARY KEY(`event_id`, `location_id`)
);
--> statement-breakpoint
INSERT INTO `event_locations_new` SELECT * FROM `event_locations`;
--> statement-breakpoint
DROP TABLE `event_locations`;
--> statement-breakpoint
ALTER TABLE `event_locations_new` RENAME TO `event_locations`;
--> statement-breakpoint

-- session_proposals: event_id → cascade
CREATE TABLE `session_proposals_new` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL REFERENCES `events`(`id`) ON DELETE CASCADE,
	`title` text NOT NULL,
	`description` text,
	`duration_minutes` integer,
	`created_time` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `session_proposals_new` SELECT * FROM `session_proposals`;
--> statement-breakpoint
DROP TABLE `session_proposals`;
--> statement-breakpoint
ALTER TABLE `session_proposals_new` RENAME TO `session_proposals`;
--> statement-breakpoint

-- proposal_hosts: both FKs → cascade
CREATE TABLE `proposal_hosts_new` (
	`proposal_id` text NOT NULL REFERENCES `session_proposals`(`id`) ON DELETE CASCADE,
	`guest_id` text NOT NULL REFERENCES `guests`(`id`) ON DELETE CASCADE,
	PRIMARY KEY(`proposal_id`, `guest_id`)
);
--> statement-breakpoint
INSERT INTO `proposal_hosts_new` SELECT * FROM `proposal_hosts`;
--> statement-breakpoint
DROP TABLE `proposal_hosts`;
--> statement-breakpoint
ALTER TABLE `proposal_hosts_new` RENAME TO `proposal_hosts`;
--> statement-breakpoint

-- sessions: proposal_id → set null, event_id → cascade
CREATE TABLE `sessions_new` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`start_time` text,
	`end_time` text,
	`capacity` integer DEFAULT 0 NOT NULL,
	`attendee_scheduled` integer DEFAULT false NOT NULL,
	`blocker` integer DEFAULT false NOT NULL,
	`closed` integer DEFAULT false NOT NULL,
	`proposal_id` text REFERENCES `session_proposals`(`id`) ON DELETE SET NULL,
	`event_id` text REFERENCES `events`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `sessions_new` SELECT * FROM `sessions`;
--> statement-breakpoint
DROP TABLE `sessions`;
--> statement-breakpoint
ALTER TABLE `sessions_new` RENAME TO `sessions`;
--> statement-breakpoint

-- session_hosts: both FKs → cascade
CREATE TABLE `session_hosts_new` (
	`session_id` text NOT NULL REFERENCES `sessions`(`id`) ON DELETE CASCADE,
	`guest_id` text NOT NULL REFERENCES `guests`(`id`) ON DELETE CASCADE,
	PRIMARY KEY(`session_id`, `guest_id`)
);
--> statement-breakpoint
INSERT INTO `session_hosts_new` SELECT * FROM `session_hosts`;
--> statement-breakpoint
DROP TABLE `session_hosts`;
--> statement-breakpoint
ALTER TABLE `session_hosts_new` RENAME TO `session_hosts`;
--> statement-breakpoint

-- session_locations: both FKs → cascade
CREATE TABLE `session_locations_new` (
	`session_id` text NOT NULL REFERENCES `sessions`(`id`) ON DELETE CASCADE,
	`location_id` text NOT NULL REFERENCES `locations`(`id`) ON DELETE CASCADE,
	PRIMARY KEY(`session_id`, `location_id`)
);
--> statement-breakpoint
INSERT INTO `session_locations_new` SELECT * FROM `session_locations`;
--> statement-breakpoint
DROP TABLE `session_locations`;
--> statement-breakpoint
ALTER TABLE `session_locations_new` RENAME TO `session_locations`;
--> statement-breakpoint

-- rsvps: both FKs → cascade
CREATE TABLE `rsvps_new` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL REFERENCES `sessions`(`id`) ON DELETE CASCADE,
	`guest_id` text NOT NULL REFERENCES `guests`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `rsvps_new` SELECT * FROM `rsvps`;
--> statement-breakpoint
DROP TABLE `rsvps`;
--> statement-breakpoint
ALTER TABLE `rsvps_new` RENAME TO `rsvps`;
--> statement-breakpoint

-- votes: both FKs → cascade
CREATE TABLE `votes_new` (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL REFERENCES `session_proposals`(`id`) ON DELETE CASCADE,
	`guest_id` text NOT NULL REFERENCES `guests`(`id`) ON DELETE CASCADE,
	`choice` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `votes_new` SELECT * FROM `votes`;
--> statement-breakpoint
DROP TABLE `votes`;
--> statement-breakpoint
ALTER TABLE `votes_new` RENAME TO `votes`;
