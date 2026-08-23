CREATE TABLE `profile_comments`
(
  `comment_id` text PRIMARY KEY NOT NULL,
  `profile_id` text             NOT NULL,
  FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`profile_id`) REFERENCES `guests` (`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `profile_comments_session_idx` ON `profile_comments` (`profile_id`);