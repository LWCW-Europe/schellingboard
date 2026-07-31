ALTER TABLE `guests` ADD `email_on_proposal_comment` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `guests` ADD `email_on_comment_thread` integer DEFAULT false NOT NULL;