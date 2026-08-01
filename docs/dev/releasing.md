# Releasing a New Version

1. **Finalize the changelog** — in `CHANGELOG.md`, rename `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD` (no `v` prefix in the header), and replace the `[Unreleased]` compare link at the bottom of the file with the new version's, pointing from the previous release's endpoint to the new tag (`vX.Y.Z`). Do _not_ add a fresh `## [Unreleased]` section here — the released tag should carry no empty section, since that is what the documentation site publishes. Step 6 reopens it afterwards. Commit and merge this like any other change.
2. **Tag the resulting commit on `main`, locally for now**. jj cannot push tags to a Git remote, so use `git` for this step:

   ```bash
   VERSION=v3.0.0
   MINOR=${VERSION%.*}   # v3.0
   MAJOR=${MINOR%.*}     # v3

   git fetch origin main
   git tag $VERSION origin/main
   ```

3. **Sanity-check the image that will be published** — build it from the tag and
   run the E2E suite against a container. This is the last chance to catch a
   fault that exists only in the packaged image (a file the standalone build
   didn't copy, a path that resolves differently under `/data`, a date rendered
   in the server's timezone rather than the event's) — no other test tier runs
   the artifact we actually ship. See
   [Testing the Docker image](testing.md#testing-the-docker-image).

   ```bash
   git checkout $VERSION
   make test-e2e-docker
   ```

   The tag is still local at this point, so a failure costs nothing: fix it on
   `main`, delete the tag (`git tag -d $VERSION`), and start again from step 1.

4. **Push the tag**, which is the point of no return — it publishes the
   documentation:

   ```bash
   git push origin $VERSION
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
git checkout $VERSION
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
