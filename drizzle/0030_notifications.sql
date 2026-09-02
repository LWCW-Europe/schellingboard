CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text NOT NULL,
	`type` text NOT NULL,
	`text` text NOT NULL,
	`url` text NOT NULL,
	`created_at` text NOT NULL,
	`read_at` text,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `notifications_guest_created_idx` ON `notifications` (`guest_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `notifications_guest_read_idx` ON `notifications` (`guest_id`,`read_at`);