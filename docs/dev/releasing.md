# Releasing a New Version

Pushing the tag is the whole release: it triggers
[`.github/workflows/release.yml`](../../.github/workflows/release.yml), which
builds the image, runs the E2E suite against it, publishes it to Docker Hub and
opens the GitHub release — and [`docs.yml`](../../.github/workflows/docs.yml),
which rebuilds the docs site and serves `docs/public/` as of that tag at its
root. Docs are versioned per minor release, so `v3.2.1` republishes the `3.2`
documentation.

1. **Finalize the changelog** — in `CHANGELOG.md`, rename `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD` (no `v` prefix in the header), and replace the `[Unreleased]` compare link at the bottom of the file with the new version's, pointing from the previous release's endpoint to the new tag (`vX.Y.Z`). Do _not_ add a fresh `## [Unreleased]` section here — the released tag should carry no empty section, since that is what the documentation site publishes. Step 4 reopens it afterwards.

   **Release the in-app notes in the same commit** — in `app/release-notes.ts`, the first entry of `releaseNotes` is the one being prepared: replace its `version: "Unreleased"` with this version and add the `date`. Nothing else moves. Verify the highlights in fact describe this release; that entry is what the footer's version button has been showing all along, so it is worth re-reading rather than assuming. `make test` fails until the newest release the changelog names has an entry.

   **Record the release's database in the same commit**, so future releases are tested against an upgrade from it:

   ```bash
   make dump-release-db VERSION=vX.Y.Z
   ```

   It writes no dump when the release ships no migration, only the `tests/fixtures/upgrade/releases.json` entry pointing at the dump that already covers the upgrade. `make test` fails until the version the changelog now names appears there, so the fixture cannot be forgotten — and being in the release commit, it is inside the tag, where a patch release branched off that tag needs it. See [Release-upgrade tests](testing.md#release-upgrade-tests).

   Commit and merge this like any other change.

2. **Tag the resulting commit on `main` and push the tag** — the point of no
   return, since it publishes the documentation:

   ```bash
   jj git fetch
   jj tag set v3.0.0 -r main@origin
   jj git push --tag v3.0.0
   # git: git fetch origin main
   #      git tag v3.0.0 origin/main
   #      git push origin v3.0.0
   ```

   Optionally run `make test-e2e-docker` on the release commit first. The
   release workflow runs it too, and refuses to publish anything if it fails —
   running it locally only buys you the chance to fix a failure before the tag
   is public.

3. **Watch the release workflow.** It takes around fifteen minutes, most of it
   the E2E suite against the image.

4. **Reopen the changelog** — in a follow-up commit on `main`, add an empty
   `## [Unreleased]` section above `## [X.Y.Z]` and an `[Unreleased]` compare
   link from `vX.Y.Z` to `HEAD`. **Reopen the in-app notes too** — in
   `app/release-notes.ts`, add a new first entry with `version: "Unreleased"`
   and no `date`, above the one just released.

## What the release workflow does

Triggered by a `v*.*.*` tag, in one job, so nothing is published until
everything before it has passed:

- **Builds the image** through `scripts/docker-build.sh` — the same script
  `make docker-build` runs — with `APP_VERSION` taken from the tag rather than
  from `scripts/app-version.js`, which asks `jj` or `git describe` and can't be
  trusted on a CI checkout.
- **Runs the E2E suite against that image** (`make test-e2e-docker`, with
  `IMAGE` naming the image just built, so it is not rebuilt). This is the only
  tier that runs the artifact we ship, and the last chance to catch a fault that
  exists only in it — a file the standalone build didn't copy, a path that
  resolves differently under `/data`, a date rendered in the server's timezone
  rather than the event's. See
  [Testing the Docker image](testing.md#testing-the-docker-image). The report
  and the traces of failed attempts are uploaded as an artifact.
- **Pushes four tags** to `schellingboard/schellingboard`: the full version,
  `major.minor`, `major`, and `latest`. `scripts/release-tags.ts` decides the
  last one from the repository's tags — `:latest` has to keep meaning the newest
  published release, so a patch cut from an older line (`v3.3.2` released after
  `v3.4.0`) publishes its own three tags and leaves `:latest` alone.
- **Creates the GitHub release**, last, so a release exists only once its images
  do. It is marked as GitHub's "latest" on the same condition as the `:latest`
  tag.

Images are `linux/amd64` only, which is what has always been published.

### Repository configuration

The workflow needs two repository secrets:

| Secret               | Value                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DOCKERHUB_USERNAME` | The Docker Hub account that can push to `schellingboard/schellingboard`.                                                                                     |
| `DOCKERHUB_TOKEN`    | A Docker Hub [access token](https://app.docker.com/settings/personal-access-tokens) for that account with **Read & Write** scope — not the account password. |

Nothing else: the GitHub release is created with the automatic `GITHUB_TOKEN`,
which the workflow grants `contents: write`.

### If it fails

Nothing has been published unless the run reached the "Publish the image" step,
so a failing build or E2E gate leaves Docker Hub and the releases page
untouched. The tag and the documentation are out, though, and re-cutting a tag
that people may already have fetched is worse than moving on: fix the problem on
`main` and release the next patch version.

A failure _after_ the gate — a Docker Hub outage, a flake — is different: the
tag is fine and only the publishing didn't happen. Re-run the workflow (or
dispatch it against the tag). Every step in it can be repeated safely.

### Publishing by hand

Only if the workflow itself is unavailable. `scripts/release-tags.ts` prints
exactly what would be pushed:

```bash
VERSION=v3.0.0

docker login
jj new $VERSION      # git: git checkout $VERSION
make clean
IMAGE="$(APP_VERSION=$VERSION bash scripts/docker-build.sh)"
for ref in $(bun scripts/release-tags.ts "$IMAGE"); do
  docker tag "$IMAGE" "$ref"
  docker push "$ref"
done
```

## Patch Releases

A patch release is cut from the release branch of its minor version,
`release/<major.minor>` — `release/3.2` for `v3.2.1`. These branches don't have
to exist: create one from the release tag the first time that version needs a
fix, and a minor release that never needs one never gets a branch.

```bash
jj new v3.2.0
jj bookmark create release/3.2   # git: git switch -c release/3.2 v3.2.0
```

Commit the fix there (cherry-picking it from `main` if it landed there first),
then run the steps above against the branch instead of `main`, and merge the
branch back into `main` so the fix is not lost. Whether the patch takes over
`:latest` is not a decision to make: the workflow works it out from the tags.

Pushing the branch republishes that version's documentation on its own, without
a tag — the docs build prefers `release/<major.minor>` over the tag for that
version, which is also how published docs are corrected between releases. See
[Correcting published documentation](documentation.md#correcting-published-documentation).
