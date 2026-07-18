CREATE TABLE `auth_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text NOT NULL,
	`salt` text NOT NULL,
	`code_hash` text NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `guests` ADD `auth_protected` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `guests` ADD `password_hash` text;