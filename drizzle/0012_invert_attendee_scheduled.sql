PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`start_time` text,
	`end_time` text,
	`capacity` integer DEFAULT 0 NOT NULL,
	`admin_managed` integer DEFAULT true NOT NULL,
	`blocker` integer DEFAULT false NOT NULL,
	`closed` integer DEFAULT false NOT NULL,
	`proposal_id` text,
	`event_id` text NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "title", "description", "start_time", "end_time", "capacity", "admin_managed", "blocker", "closed", "proposal_id", "event_id") SELECT "id", "title", "description", "start_time", "end_time", "capacity", NOT "attendee_scheduled", "blocker", "closed", "proposal_id", "event_id" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
