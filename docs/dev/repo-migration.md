# Moving to schellingboard/schellingboard

`LWCW-Europe/schellingboard` is a fork of `rachelweinberg12/scheduling-app`. Commits to a
fork don't count on contributors' profiles, forks are hidden from search, and the org name
suggests LWCW-only software. So the project moves to a standalone
`schellingboard/schellingboard`. Leaving the fork network loses issues, PRs and stars, so
the old repo stays as the archived `schellingboard/schellingboard-legacy`.

`scripts/migrate-issues.py` gives every issue/PR number of the legacy repo the same number
in the new repo, so `#123` in commits and the changelog still resolves:

- **Open issues are transferred**: author, comments, reactions, labels, type and Priority
  stay, and old URLs redirect. This needs both repos in the same org.
- **Everything else becomes a closed stub** that links to the original and names its
  author: closed issues, all PRs, and numbers with no issue at all.

The new repo is the script's only state. Each run continues at the first free number and
stops if GitHub ever hands out a different one, so it can be interrupted and re-run at any
time. Writes are paced to stay under GitHub's secondary rate limit (500/hour), so a full run
takes about 5 hours. Re-runs are quick and pick up anything opened in the meantime.

## Before the cutover

1. Dry run against the current repo:
   `scripts/migrate-issues.py --old LWCW-Europe/schellingboard --dry-run`
2. **Check that a transfer keeps the number.** GitHub doesn't document which number a
   transferred issue gets. The script assumes the next free one and stops otherwise, but
   by then one issue would sit on the wrong number. Try it with two throwaway repos in the
   `schellingboard` org: give A two issues and B one, transfer A#2 to B, and expect B#2.
   Also transfer from a public repo into a private one if the new repo stays private
   during the run.
3. Set up the new repo, keeping **Actions disabled** until the code and tags are pushed.
   Otherwise the tag pushes trigger `release.yml` and `docs.yml`:
   - Actions: `gh api -X PUT repos/schellingboard/schellingboard/actions/permissions -F enabled=false`
   - Description, homepage (`https://schellingboard.org/`) and topics (`conference`,
     `conference-scheduling`, `scheduling`, `unconference`)
   - The "Protect branches" ruleset (default branch, `release/*`, `lwcw2025`: no deletion,
     no force push, PR required) and the `github-pages` environment
   - Secrets `DOCKERHUB_TOKEN`, `DOCKERHUB_USERNAME`, `WWW_DEPLOY_APP_PRIVATE_KEY`, and the
     variable `WWW_DEPLOY_APP_CLIENT_ID`
   - Install the www deploy GitHub App on the `schellingboard` org
   - Invite collaborators and set up teams

## Cutover

1. Tell the authors of open PRs (currently #1019, #976) to reopen them against the new repo
   afterwards. Those PRs, and all others, become stubs.
2. Rename `LWCW-Europe/schellingboard` to `schellingboard-legacy` and transfer it to the
   `schellingboard` org. `LWCW-Europe/schellingboard` then redirects there.
3. Push the code while Actions is still disabled:
   ```
   git fetch origin
   git remote add new git@github.com:schellingboard/schellingboard.git
   git push new --tags 'refs/remotes/origin/main:refs/heads/main' \
     'refs/remotes/origin/lwcw2025:refs/heads/lwcw2025' \
     'refs/remotes/origin/release/*:refs/heads/release/*'
   ```
   Other branches belong to their authors, who can push them again themselves.
4. Keep anyone from opening issues or PRs in the new repo while the script runs, because a
   stray issue takes a number that can never be reclaimed. Either keep the repo private,
   which hides transferred issues from everyone else for a few hours, or make it public and
   allow only collaborators to interact for 24 hours:
   ```
   gh api -X PUT repos/schellingboard/schellingboard/interaction-limits \
     -f limit=collaborators_only -f expiry=one_day
   ```
   The same limit on the legacy repo stops new issues and PRs there.
5. Run `scripts/migrate-issues.py` until it prints "Up to date". Warnings name anything to
   fix by hand, such as an issue reopened in the legacy repo after its stub was created.
6. Re-create the 12 GitHub releases:
   ```
   for tag in $(gh release list -R schellingboard/schellingboard-legacy --json tagName --jq '.[].tagName'); do
     gh release view "$tag" -R schellingboard/schellingboard-legacy --json name,body \
       --jq '"\(.name)\n\(.body)"' > /tmp/notes.md
     gh release create "$tag" -R schellingboard/schellingboard --verify-tag \
       --title "$(head -1 /tmp/notes.md)" --notes "$(tail -n +2 /tmp/notes.md)"
   done
   ```
   Then mark the newest one as latest if GitHub picked another.
7. Move the docs site's custom domain: remove `docs.schellingboard.org` from the legacy
   repo's Pages settings, enable Pages (source: GitHub Actions) in the new repo, add the
   domain there, and run `docs.yml` for the latest tag.
8. Enable Actions and make the new repo public.
9. In the new repo, replace `LWCW-Europe/schellingboard` in `README.md`, `CONTRIBUTING.md`,
   `CHANGELOG.md` (link references), `docmd.config.json`, `docs/public/`, `docs/dev/`,
   `www/`, `utils/utils.ts` and `tests/e2e/release-notes.spec.ts`. Drop the "public fork"
   paragraph from the README, since `LICENSING_HISTORY.md` covers where the code came from.
10. Move `LWCW-Europe/schellingboard.org` (the website) to the `schellingboard` org, update
    `.github/workflows/www.yml`, and check that the DNS for schellingboard.org still points
    at it.
11. Update the Docker Hub repository description and links.
12. Legacy repo: push the "repository moved" README commit to `main`, then archive it.
    Transferred issues already redirect, so the old open issues need no comment.
13. Remove the interaction limits. Contributors update their remote:
    `git remote set-url origin git@github.com:schellingboard/schellingboard.git`.
