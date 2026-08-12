ALTER TABLE `guests` ADD `profile_updated_at` text;--> statement-breakpoint
-- Backfill: nothing records when these profiles were written, so everyone who
-- has filled anything in shares this migration's instant. That buys the one
-- distinction worth having — profiles with content ahead of untouched ones —
-- without inventing an order among them. Only self-entered fields count: the
-- CSV importer writes name and email, so those say nothing.
UPDATE `guests` SET `profile_updated_at` = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE coalesce(`about_me`, '') <> ''
   OR coalesce(`pronouns`, '') <> ''
   OR coalesce(`based_in`, '') <> ''
   OR coalesce(`avatar_url`, '') <> ''
   OR coalesce(`prompts`, '[]') NOT IN ('[]', 'null', '')
   OR coalesce(`languages`, '[]') NOT IN ('[]', 'null', '')
   OR coalesce(`contacts`, '[]') NOT IN ('[]', 'null', '');
