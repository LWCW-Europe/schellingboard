ALTER TABLE `guests` ADD `email_on_rsvp_change` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `guests` ADD `email_on_host_change` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `guests` ADD `email_on_cohost_add` integer DEFAULT true NOT NULL;