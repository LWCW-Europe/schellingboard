# Releasing a New Version

1. **Finalize the changelog** — in `CHANGELOG.md`, rename `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD` (no `v` prefix in the header), and replace the `[Unreleased]` compare link at the bottom of the file with the new version's, pointing from the previous release's endpoint to the new tag (`vX.Y.Z`). Do _not_ add a fresh `## [Unreleased]` section here — the released tag should carry no empty section, since that is what the documentation site publishes. Step 6 reopens it afterwards. Commit and merge this like any other change.
2. **Tag the resulting commit on `main`, locally for now**:

   ```bash
   VERSION=v3.0.0
   MINOR=${VERSION%.*}   # v3.0
   MAJOR=${MINOR%.*}     # v3

   jj git fetch
   jj tag set $VERSION -r main@origin
   # git: git fetch origin main
   #      git tag $VERSION origin/main
   ```

3. **Sanity-check the image that will be published** — build it from the tag and
   run the E2E suite against a container. This is the last chance to catch a
   fault that exists only in the packaged image (a file the standalone build
   didn't copy, a path that resolves differently under `/data`, a date rendered
   in the server's timezone rather than the event's) — no other test tier runs
   the artifact we actually ship. See
   [Testing the Docker image](testing.md#testing-the-docker-image).

   ```bash
   jj new $VERSION
   # git: git checkout $VERSION
   make test-e2e-docker
   ```

   The tag is still local at this point, so a failure costs nothing: fix it on
   `main`, delete the tag (`jj tag delete $VERSION`, or `git tag -d $VERSION`),
   and start again from step 1.

4. **Push the tag**, which is the point of no return — it publishes the
   documentation:

   ```bash
   jj git push --tag $VERSION
   # git: git push origin $VERSION
   ```

5. **Publish the Docker images** — see below.

6. **Reopen the changelog** — in a follow-up commit on `main`, add an empty `## [Unreleased]` section above `## [X.Y.Z]` and an `[Unreleased]` compare link from `vX.Y.Z` to `HEAD`. It comes last because the Docker build derives its version from the nearest tag: a commit on top of the release tag would make `make docker-build` tag the image with a hash instead of `$VERSION`.

Pushing the tag publishes the documentation: the docs site rebuilds and
serves `docs/public/` as of that tag at its root. Docs are versioned per minor
release, so `v3.2.1` republishes the `3.2` documentation.

## Publishing Docker Images

Image: `schellingboard/schellingboard` on Docker Hub.

For a release, push four tags: the full version, `major.minor`, `major`, and `latest`. Skip `latest` when publishing a patch for an older major/minor (i.e. when it wouldn't be the newest release).

```bash
docker login
jj new $VERSION      # git: git checkout $VERSION
make clean
make docker-build   # builds and locally tags :$VERSION
docker tag schellingboard/schellingboard:$VERSION schellingboard/schellingboard:$MINOR
docker tag schellingboard/schellingboard:$VERSION schellingboard/schellingboard:$MAJOR
# omit if not the newest release
docker tag schellingboard/schellingboard:$VERSION schellingboard/schellingboard:latest

docker push schellingboard/schellingboard:$VERSION
docker push schellingboard/schellingboard:$MINOR
docker push schellingboard/schellingboard:$MAJOR
# omit if not the newest release
docker push schellingboard/schellingboard:latest
```

All four tags are set here rather than by `make docker-build`, which only ever
tags `:$VERSION`: that target runs on any working tree, and `:latest` has to
keep meaning the newest published release.

`make docker-build` derives `$VERSION` with `scripts/app-version.js` (the nearest tag, via `jj` or `git`), so the release commit must already be tagged with the exact version (e.g. `v3.0.0`) before running it.

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
branch back into `main` so the fix is not lost. Omit the `:latest` Docker tag
when the patch is not the newest release.

Pushing the branch republishes that version's documentation on its own, without
a tag — the docs build prefers `release/<major.minor>` over the tag for that
version, which is also how published docs are corrected between releases. See
[Correcting published documentation](documentation.md#correcting-published-documentation).
