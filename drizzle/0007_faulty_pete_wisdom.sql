DELETE FROM `votes` WHERE rowid NOT IN (
  SELECT MAX(rowid) FROM `votes` GROUP BY `proposal_id`, `guest_id`
);--> statement-breakpoint
CREATE UNIQUE INDEX `votes_proposal_guest_unique` ON `votes` (`proposal_id`,`guest_id`);