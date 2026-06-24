PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_days` (
	`id` text PRIMARY KEY NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`start_bookings` text NOT NULL,
	`end_bookings` text NOT NULL,
	`event_id` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_days`("id", "start", "end", "start_bookings", "end_bookings", "event_id") SELECT "id", "start", "end", "start_bookings", "end_bookings", "event_id" FROM `days`;--> statement-breakpoint
DROP TABLE `days`;--> statement-breakpoint
ALTER TABLE `__new_days` RENAME TO `days`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`start_time` text,
	`end_time` text,
	`capacity` integer DEFAULT 0 NOT NULL,
	`attendee_scheduled` integer DEFAULT false NOT NULL,
	`blocker` integer DEFAULT false NOT NULL,
	`closed` integer DEFAULT false NOT NULL,
	`proposal_id` text,
	`event_id` text NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "title", "description", "start_time", "end_time", "capacity", "attendee_scheduled", "blocker", "closed", "proposal_id", "event_id") SELECT "id", "title", "description", "start_time", "end_time", "capacity", "attendee_scheduled", "blocker", "closed", "proposal_id", "event_id" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;