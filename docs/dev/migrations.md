# Database Migrations

`make dev-migrate-create` (`drizzle-kit generate`) diffs `db/schema.ts` against the latest
snapshot in `drizzle/meta/` and writes a new `NNNN_*.sql` file plus an updated
`drizzle/meta/NNNN_snapshot.json` and `drizzle/meta/_journal.json`.

## Resolving migration conflicts

When two branches each add a migration, `drizzle/meta/_journal.json` and the latest
`drizzle/meta/NNNN_snapshot.json` conflict — both branches claim the same index. Don't hand-edit
the conflicted JSON; regenerate it instead:

1. Move your own new `.sql` migration file out of the way (e.g. to `/tmp`) so it doesn't confuse
   `drizzle-kit`. Note its name.
2. Restore `drizzle/meta/` to the stable version (`main`), discarding your branch's snapshot/journal
   changes — `db/schema.ts` is unaffected, only the generated meta files reset:

   ```bash
   # jj
   jj restore --from main -- drizzle/meta

   # Git
   git checkout main -- drizzle/meta
   ```

3. Regenerate against the restored snapshot, in a real terminal (not piped/non-interactive — see
   below):

   ```bash
   make dev-migrate-create NAME=<original-migration-name>
   ```

   `--name` gets you the right filename directly; without it you'd rename the auto-generated file
   afterward (keep drizzle-kit's index, drop the random suffix). If your change looks like a column
   rename to drizzle-kit (e.g. drop one column, add another), it opens an interactive prompt asking
   whether to treat it as a rename or a create+drop — it needs a real TTY, so this step can't run
   from a script or CI.

4. Diff the regenerated `.sql` file against the copy you moved aside in step 1. For a plain
   mechanical schema change they'll match — delete the moved-aside copy. But if your original
   migration had hand-written SQL beyond what `schema.ts` alone implies (a data backfill, a value
   transform, choosing "rename" over "create+drop"), the regenerated file won't reproduce it —
   drizzle-kit only knows what it can infer from the schema diff. In that case keep the _regenerated_
   `drizzle/meta/*_snapshot.json` and journal entry (they carry the correct index), but replace the
   regenerated file's SQL body with your original hand-written SQL.
5. Run `make dev-migrate-up` to confirm the migration applies cleanly, then continue resolving the
   rest of the conflict as usual.
