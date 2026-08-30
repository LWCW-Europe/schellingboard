CREATE TABLE `meeting_availability` (
	`event_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`slot_start` text NOT NULL,
	PRIMARY KEY(`event_id`, `guest_id`, `slot_start`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `meeting_availability_slot_idx` ON `meeting_availability` (`event_id`,`slot_start`);--> statement-breakpoint
CREATE TABLE `meeting_points` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`sort_index` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `meeting_points_event_idx` ON `meeting_points` (`event_id`);--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`requester_id` text NOT NULL,
	`recipient_id` text NOT NULL,
	`slot_start` text NOT NULL,
	`slot_end` text NOT NULL,
	`meeting_point` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`responded_at` text,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`requester_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipient_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `meetings_event_requester_idx` ON `meetings` (`event_id`,`requester_id`);--> statement-breakpoint
CREATE INDEX `meetings_event_recipient_idx` ON `meetings` (`event_id`,`recipient_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `meetings_no_duplicate_request` ON `meetings` (`event_id`,`requester_id`,`recipient_id`,`slot_start`);--> statement-breakpoint
ALTER TABLE `events` ADD `meetings_enabled` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `meeting_slot_minutes` integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `meeting_day_start` text;--> statement-breakpoint
ALTER TABLE `events` ADD `meeting_day_end` text;--> statement-breakpoint
ALTER TABLE `events` ADD `max_open_meeting_requests` integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE `guests` ADD `email_on_meeting_request` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `guests` ADD `email_on_meeting_response` integer DEFAULT true NOT NULL;