DELETE FROM `rsvps` WHERE rowid NOT IN (
  SELECT MAX(rowid) FROM `rsvps` GROUP BY `session_id`, `guest_id`
);--> statement-breakpoint
CREATE UNIQUE INDEX `rsvps_session_guest_unique` ON `rsvps` (`session_id`,`guest_id`);
