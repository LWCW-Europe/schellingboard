PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_days` (
	`id` text PRIMARY KEY NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`start_bookings` text NOT NULL,
	`end_bookings` text NOT NULL,
	`event_id` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_days`("id", "start", "end", "start_bookings", "end_bookings", "event_id") SELECT "id", "start", "end", "start_bookings", "end_bookings", "event_id" FROM `days`;--> statement-breakpoint
DROP TABLE `days`;--> statement-breakpoint
ALTER TABLE `__new_days` RENAME TO `days`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_event_guests` (
	`event_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `guest_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_event_guests`("event_id", "guest_id") SELECT "event_id", "guest_id" FROM `event_guests`;--> statement-breakpoint
DROP TABLE `event_guests`;--> statement-breakpoint
ALTER TABLE `__new_event_guests` RENAME TO `event_guests`;--> statement-breakpoint
CREATE TABLE `__new_event_locations` (
	`event_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `location_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_event_locations`("event_id", "location_id") SELECT "event_id", "location_id" FROM `event_locations`;--> statement-breakpoint
DROP TABLE `event_locations`;--> statement-breakpoint
ALTER TABLE `__new_event_locations` RENAME TO `event_locations`;--> statement-breakpoint
CREATE TABLE `__new_proposal_hosts` (
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`proposal_id`, `guest_id`),
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_proposal_hosts`("proposal_id", "guest_id") SELECT "proposal_id", "guest_id" FROM `proposal_hosts`;--> statement-breakpoint
DROP TABLE `proposal_hosts`;--> statement-breakpoint
ALTER TABLE `__new_proposal_hosts` RENAME TO `proposal_hosts`;--> statement-breakpoint
CREATE TABLE `__new_rsvps` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_rsvps`("id", "session_id", "guest_id") SELECT "id", "session_id", "guest_id" FROM `rsvps`;--> statement-breakpoint
DROP TABLE `rsvps`;--> statement-breakpoint
ALTER TABLE `__new_rsvps` RENAME TO `rsvps`;--> statement-breakpoint
CREATE TABLE `__new_session_hosts` (
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `guest_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session_hosts`("session_id", "guest_id") SELECT "session_id", "guest_id" FROM `session_hosts`;--> statement-breakpoint
DROP TABLE `session_hosts`;--> statement-breakpoint
ALTER TABLE `__new_session_hosts` RENAME TO `session_hosts`;--> statement-breakpoint
CREATE TABLE `__new_session_locations` (
	`session_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `location_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session_locations`("session_id", "location_id") SELECT "session_id", "location_id" FROM `session_locations`;--> statement-breakpoint
DROP TABLE `session_locations`;--> statement-breakpoint
ALTER TABLE `__new_session_locations` RENAME TO `session_locations`;--> statement-breakpoint
CREATE TABLE `__new_session_proposals` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration_minutes` integer,
	`created_time` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session_proposals`("id", "event_id", "title", "description", "duration_minutes", "created_time") SELECT "id", "event_id", "title", "description", "duration_minutes", "created_time" FROM `session_proposals`;--> statement-breakpoint
DROP TABLE `session_proposals`;--> statement-breakpoint
ALTER TABLE `__new_session_proposals` RENAME TO `session_proposals`;--> statement-breakpoint
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
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "title", "description", "start_time", "end_time", "capacity", "attendee_scheduled", "blocker", "closed", "proposal_id", "event_id") SELECT "id", "title", "description", "start_time", "end_time", "capacity", "attendee_scheduled", "blocker", "closed", "proposal_id", "event_id" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE TABLE `__new_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`choice` text NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_votes`("id", "proposal_id", "guest_id", "choice") SELECT "id", "proposal_id", "guest_id", "choice" FROM `votes`;--> statement-breakpoint
DROP TABLE `votes`;--> statement-breakpoint
ALTER TABLE `__new_votes` RENAME TO `votes`;