# Coding Guidelines

The day-to-day style rules are in
[CONTRIBUTING.md § Code Style](../../CONTRIBUTING.md#code-style). This chapter
holds the ones that need more than a bullet.

## Comments

**Comment the WHY, not the WHAT.** The code already says what it does; a comment
earns its place only by adding something the reader can't get from reading it —
the constraint, the bug, the surprising interaction, the alternative that was
tried and failed.

Default to no comment. Write one when:

- a line looks wrong or arbitrary until you know the reason (a workaround, a
  browser quirk, an ordering constraint, a magic number)
- a file or exported function has a non-obvious purpose or scope
- the logic is genuinely intricate and a one-line summary saves the reader
  reconstructing it

Do not write:

- restatements of the code — `// toggle the like`, `// loop over the sessions`,
  `// set loading to true`
- doc blocks on self-explanatory functions, or `@param`/`@returns` that only
  repeat the signature. TypeScript types are the documentation
- section banners (`// ---- helpers ----`), commented-out code, or notes about
  the change being made (`// now also handles X`, `// new in v2`) — that belongs
  in the commit message
- comments that will silently go stale because they duplicate a value or
  behavior defined elsewhere

Keep them short: one or two lines is usually enough, and prefer prose over
ceremony. Longer is fine when the reason genuinely needs it (an ADR-sized
constraint, a subtle race), but that should be rare.

```ts
// Bad — says what the code says
// Get the guest and check if they are a host
const guest = await getActingGuest();
if (guest?.id === session.hostId) {

// Good — says what the code can't
// Hosts bypass the vote check: they can always edit their own session, even
// after voting closes.
```

**This guideline outranks consistency with surrounding code.** If a file is full
of noisy comments, don't match it — write the sparse version. Removing an
obsolete or redundant comment in code you're already touching is welcome; a
sweeping comment-cleanup pass across untouched files is not.
