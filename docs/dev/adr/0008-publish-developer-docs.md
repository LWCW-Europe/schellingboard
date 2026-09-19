# ADR 0008: Publish the developer docs at developers.schellingboard.org

- **Status:** Accepted
- **Date:** 2026-09-18

## Context

The developer documentation (`CONTRIBUTING.md` and `docs/dev/`) is only readable in
the repository. On GitHub it is a flat file listing with no entry point, and
navigation is by relative link. The target-architecture diagrams are worst off:
GitHub can't run LikeC4, so the chapters embed PNGs that must be re-exported by
hand and go stale silently.

The user docs at docs.schellingboard.org are built from release tags, with the
newest release at the root. Two constraints on publishing anything next to them:

- End users must not confuse the developer docs with the user docs.
- Nobody may land on documentation for unreleased features by default. Finding
  it on purpose is fine.

Other projects mostly split the two audiences. Contributor docs go on their own
site, unversioned and tracking the default branch (developers.home-assistant.io,
devguide.python.org, rustc-dev-guide). Unreleased user docs, where they are
published at all, are a non-default version with a warning banner (Docusaurus
`/docs/next/`, Read the Docs `latest` versus the `stable` default,
next.home-assistant.io).

## Decision

### The developer docs are their own site at developers.schellingboard.org

A separate `docmd.dev.config.json` builds `docs/dev/` into its own site, with its
own title, navigation and search index. The user site links to it only from the
footer. `developers.` rather than `dev.` or `devdocs.`, so the host doesn't read
like `docs.` at a glance.

It is not versioned: a new `developers.yml` builds it from `main` on pushes that
touch the developer docs, like the contributor sites above. GitHub Pages serves
one custom domain per repository, so it pushes the build to a repository that
holds nothing else, as `www.yml` does for schellingboard.org, reusing the same
deploy app. `docs.yml` and the user docs are untouched.

A path under docs.schellingboard.org was considered. It needs no extra
repository, but Pages replaces the whole site on every deploy, so each tag and
release-branch deploy of the user docs would have to rebuild `/dev/` from `main`.
A broken developer build would then block publishing a release's docs. Also,
the target audience is very different so clearly separating is better.

It is open to search engines, like the contributor sites above.

`docs/dev/README.md` becomes the index and the site's home page, so the folder is
navigable on GitHub too. Links from developer docs to files outside `docs/dev/`
point at GitHub, since the site can't resolve them.

### `CONTRIBUTING.md` becomes a short entry point

Its content moves into `docs/dev/` chapters. What stays is what GitHub shows
contributors before they open an issue or pull request: a few lines on what the
project is and a link to the developer docs. `AGENTS.md` links to
`docs/dev/README.md` instead.

### LikeC4 diagrams are interactive, and the PNG exports go

- `likec4 build --base /diagrams/ --use-hash-history` publishes the full
  explorer, with drill-down between levels, at `/diagrams/`. Hash history is
  there because GitHub Pages can't route deep links to a single-page app.
- `likec4 gen webcomponent` generates a script, loaded through docmd's `customJs`,
  that defines `<likec4-view view-id="…">`. The chapters embed their views with
  that element instead of PNGs.

`docs/dev/target-architecture/diagrams/export/` and `make arch-diagrams-export` are
removed. On GitHub the chapters then show no diagrams, which is acceptable now that
the site is where these docs are read. In exchange, nothing can go stale: the site
renders from the `.c4` sources on every build.

### No `/next/` for now

Publishing `docs/public/` from `main` as an "unreleased" version was considered and
deferred. It would let reviewers and organizers read upcoming docs rendered, but
nobody runs `main` in production. An end user arriving from a shared link or a
search would be reading about features their instance lacks, which a banner only
softens. docmd also has no per-version banner, so it would need a build-time
workaround. Revisit if people ask for rendered unreleased docs. `make docs` covers
contributors in the meantime.

## Consequences

- One more repository, DNS record and app installation to set up.
  `docs/dev/documentation.md` needs a section on the developer site.
- Developer docs are only as current as `main`. A contributor on a release branch
  reads that branch's `docs/dev/` in the repository.
- Diagram PNGs no longer need committing, and publishing diagrams no longer needs
  Playwright's Chromium. The target-architecture chapters and the diagrams
  `README.md` switch from the PNGs to embedded views.
- To check while implementing: whether embedded diagrams follow docmd's theme
  toggle, and how much the web component adds to every developer page.
