CREATE TABLE `comment_likes` (
	`comment_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`created_time` text NOT NULL,
	PRIMARY KEY(`comment_id`, `guest_id`),
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `comment_likes_guest_idx` ON `comment_likes` (`guest_id`);