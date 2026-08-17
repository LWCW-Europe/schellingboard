# ADR 0005: Dark mode via semantic tokens and a per-device cookie

- **Status:** Accepted
- **Date:** 2026-08-17

## Context

The app had no dark mode: no `dark:` utility anywhere, no `color-scheme`
declaration, and roughly a thousand hard-coded palette utilities
(`text-gray-500` alone appeared 95 times) spread over some 78 components.

Attendees were reaching for browser extensions instead. [#802](https://github.com/LWCW-Europe/schellingboard/issues/802)
reported that under [Dark Reader](https://darkreader.org/) a voted-on proposal
became indistinguishable from an unvoted one, because the only cue was a pale
blue fill against white and the extension collapsed both to near-identical
darks. That specific bug is fixed separately — the state is now also carried by
`aria-pressed` and a check mark — but it is the symptom of not owning the
question.

Constraints that shape the decision:

- The site has surfaces that anonymous visitors see: the password gate, the
  login screen, the guest picker, the kiosk display. Anything that lives behind
  "select your name first" cannot be the only way to change the theme.
- A wrong first paint is worse than no dark mode. Whatever resolves the theme
  has to run before the page is painted.
- The schedule renders location colours as dynamic Tailwind classes
  (`bg-${color}-500`), kept alive by a `@source inline(...)` safelist. Doubling
  that safelist for a second theme is a cost worth avoiding.

## Decision

### The preference is per device, in a cookie

`sb-theme` holds `system`, `light` or `dark`, and the root layout turns it into
`class="light"` / `class="dark"` on `<html>` — `system` sets no class at all.

Per device, rather than on the guest record, because:

- `app/(site)/settings/page.tsx` requires a selected guest, and the header menu
  that reaches it only renders once a name is chosen
  (`header-user-select.tsx:62`). A guest-record setting would be unreachable
  from exactly the screens a first-time visitor sees.
- Ambient light genuinely differs per device. One attendee on a phone at night
  and on a laptop in a bright room wants two different answers; a single stored
  preference can only give one.
- Switching the current user is unauthenticated, so a guest-record preference
  would be writable by anyone claiming that name.

The control sits in the footer, which is on every page including anonymous ones
and already carries the low-salience global strip (version, help, report a bug).
It is mirrored on the settings page, labelled as applying to this device, for
discoverability — both write the same cookie.

### "System" is resolved in CSS, not in an inline script

The server cannot know the OS preference, so the usual fix is a blocking inline
script that reads it and sets a class before paint. We avoid the script
entirely: an explicit choice is a class on `<html>`, and `system` is the absence
of one, handled by a media query inside the `dark` variant.

```css
@custom-variant dark {
  &:where(.dark, .dark *) {
    @slot;
  }
  @media (prefers-color-scheme: dark) {
    &:where(html:not(.light), html:not(.light) *) {
      @slot;
    }
  }
}
```

`.dark` wins outright; otherwise the OS decides unless `light` pinned it. No
script, no flash, and it still works with JavaScript off. The cost is that
"which theme am I actually in" is not readable from JS — nothing needs it.

A variant on its own would only reach utilities that are written `dark:…`, and
the whole point of the tokens below is that components never write one. So the
token rule applies the variant to _itself_:

```css
:root {
  color-scheme: light;
  --surface: #ffffff;

  @variant dark {
    color-scheme: dark;
    --surface: #16181d;
  }
}
```

Tailwind expands that into the two branches above and flattens the nesting in
the production build, so the browser sees plain `:root:where(.dark, .dark *)`
and `@media (prefers-color-scheme: dark)` rules. Writing the dark values once,
under the one definition of "am I dark", is what keeps the class and the media
query from drifting apart. `color-scheme` rides along in the same block, which
is what gives native controls, scrollbars and form autofill the right theme —
the layout only has to set the class.

Reading the cookie makes the root layout dynamic. The site is already
effectively dynamic (a settings read in `generateMetadata`, `cookies()` in
`(site)/layout.tsx`), so this costs nothing in practice.

### Semantic tokens, not `dark:` on every utility

Components name the role a colour plays — `bg-surface`, `text-fg-muted`,
`border-line`, `bg-brand` — and the token rule in `app/globals.css` is the only
place a colour is picked. Its `@variant dark` block lists only the tokens that
change, so what the two themes disagree about is readable at a glance and a
colour that is meant to be the same in both cannot drift.

Annotating each existing utility with a `dark:` counterpart would have been a
diff of the same size that left the problem permanently open: every new
component would be free to forget, and nothing would notice. With tokens, dark
mode is correct by default for code that hasn't been written yet.

`@theme inline` is required for the swap to work — a plain `@theme` bakes the
value into the generated utility at build time, so `.dark` could never override
it.

### The dark theme is not an inversion

Two things change shape rather than value:

- **Elevation.** Light mode raises a card with a shadow; on a dark ground a
  shadow is nearly invisible, so `--surface-raised` is _lighter_ than the page
  and `--surface-sunken` is darker. The contrast test asserts this ordering.
- **Tints.** `bg-rose-50` and friends become deep desaturated grounds
  (`--brand-tint: #3b1220`) with a light accent on top, not darkened pastels.

Neither theme uses the extremes: the dark page is `#16181d` rather than black
and its text `#e8eaee` rather than white, because pure white on pure black
blooms at reading sizes.

### The contrast contract is a test

`tests/unit/theme-contrast.test.ts` parses the tokens out of `globals.css` and
asserts a WCAG ratio for every (foreground, background) pair that occurs in the
UI, in both themes — 7:1 for body copy, 4.5:1 for secondary and semantic text,
3:1 for control borders and state indicators per WCAG 2.2 1.4.11. It reads the
dark block the way the cascade does, light values with the overrides on top, so
a token that is only wrong once it inherits is still caught.

This is what stops dark mode from quietly rotting: "looks a bit washed out" is
otherwise nobody's bug. Row dividers and hover fills are deliberately exempt —
they are neither text nor controls, and holding them to 3:1 would mean drawing
boxes everywhere.

The list of pairs doubles as the rule for which token belongs on which ground:
`--fg-subtle` and `--line` clear the three page grounds but not the filled ones
(`--surface-muted`, `--surface-hover`), where `--fg-muted` and `--line-strong`
take over.

Enforcing the contract moved a few light-mode colours, which is a deliberate
consequence rather than a side effect (see below).

### Location colours are derived, not safelisted twice

A location's colour stays a palette name. `loc-<name>` puts that hue into a
`--loc` custom property and each role — block fill, dimmed fill, border, RSVP
badge, tag, admin swatch — is a `color-mix()` of it with the current `--surface`
or `--fg`, so one class works in both themes. The alternative, a second set of
safelisted `dark:bg-*-900` classes, would have doubled the `@source inline(...)`
list; as it turns out the 22 `loc-*` rules are plain CSS, so the safelist is
gone entirely.

Deriving also fixes a light-mode bug we would otherwise have carried over: the
old block was `bg-${color}-500` with `text-white`, which is 1.8:1 on
`yellow-500`. Because the fill is now mixed with the page, the title is `--fg`
on a tint of the hue and stays legible whichever of the 22 colours a location
has. `tests/unit/location-colors.test.ts` recomputes every hue in both themes —
mixing in oklab as the browser does — rather than trusting that.

The visible cost is that a scheduled session is a tinted card with a saturated
border instead of a solid block of colour.

## Consequences

### Positive

- Dark mode works before a name is selected and on the kiosk.
- Correct on first paint, with no inline script and no flash.
- Native controls, scrollbars and autofill follow the theme, because
  `color-scheme` is set by the same rule as the tokens.
- New components get dark mode for free by naming roles.
- The contrast test makes readability regressions fail the build.
- #802's class of bug is harder to reintroduce: state is no longer encoded as a
  bare palette shade.

### Negative

- A large mechanical migration touching most components, and one that reviewers
  have to read as "renames" rather than logic.
- `text-white` needed judgment per call site — it splits into `--on-brand`,
  `--on-danger`, `--on-info` and `--fg-inverse` depending on what it sits on.
- The token vocabulary is one more thing to learn before writing a component.

### Neutral

- The schedule grid looks different in light mode: session blocks are tinted
  rather than solid (see above). Locations are still told apart by hue, now
  carried by the border as much as the fill.
- Light mode shifts slightly where the contrast contract required it, most
  visibly: the several grays doing "muted text" collapse to three levels, so
  `text-gray-400` text darkens to a readable `--fg-subtle` (it was 2.9:1 on
  white); primary rose buttons deepen from rose-400/500 to rose-600, because
  white on rose-400 was 2.7:1; and form-control borders darken to meet the 3:1
  of 1.4.11.
- Emails, the hand-written landing page in `www/`, and the docs site are out of
  scope. Mail-client support for `prefers-color-scheme` is too patchy to be
  worth the divergence.
