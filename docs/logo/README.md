# Logo

The project's only copy of the logo, shared the same way `docs/screenshots/` is:
the landing page, the documentation site and the app all reference these files
rather than keeping their own.

## The mark

Two schedule grid lines crossing, with the one slot everybody converged on
filled in — the board, and the focal point the name refers to.

## Files

| File                   | Use                                                    |
| ---------------------- | ------------------------------------------------------ |
| `logo.svg`             | The default: mark plus wordmark, on light backgrounds  |
| `logo-reversed.svg`    | The same, on dark backgrounds                          |
| `logo-mono.svg`        | Single ink, for print or anywhere colour is a problem  |
| `logo-stacked.svg`     | Mark above the wordmark, for narrow or square space    |
| `icon.svg`             | The mark alone, at 32px and up                         |
| `icon-reversed.svg`    | The mark alone, on dark backgrounds                    |
| `icon-mono.svg`        | The mark alone, single ink                             |
| `wordmark.svg`         | The name alone                                         |
| `favicon.svg`          | A heavier cut of the mark, for 16–48px only            |
| `apple-touch-icon.png` | 180×180, white background (iOS renders alpha as black) |

## The two cuts

`icon.svg` is drawn with a 5.5-unit stroke, which matches the stem weight of
Montserrat Bold beside it in the lockup. That stroke turns to grey mush below
about 32px, so `favicon.svg` redraws the same mark at 8 units on coordinates
that land on whole pixels at 16px. **Use `favicon.svg` for browser chrome and
`icon.svg` everywhere else.**

## Colours

| Role  | Hex       |
| ----- | --------- |
| Ink   | `#1a1a1a` |
| Coral | `#e05a5a` |

Unchanged from the landing page, which already used them.

## Type

The wordmark is Montserrat Bold — the font the app loads — converted to
outlines, so nothing here needs a webfont. Retype it only by setting Montserrat
Bold at `letter-spacing: -3` per 120px and converting to paths again; do not
substitute another font.

## Derived files

`public/` needs real files for Next.js to serve, so three are copies rather
than references. Regenerate them after any change to the mark:

```sh
for s in 16 32 48; do inkscape docs/logo/favicon.svg -o "/tmp/ico-$s.png" -w $s -h $s; done
convert -background none /tmp/ico-16.png /tmp/ico-32.png /tmp/ico-48.png public/favicon.ico
cp docs/logo/favicon.svg public/icon.svg
inkscape docs/logo/icon.svg -o /tmp/at.png -w 148 -h 148
convert -size 180x180 xc:white /tmp/at.png -gravity center -composite public/apple-touch-icon.png
cp public/apple-touch-icon.png docs/logo/apple-touch-icon.png
```

## Usage

- Keep clear space around the logo of at least the height of the coral cell.
- Don't recolour, stretch, rotate, outline or add effects to it.
- Don't rebuild the lockup by placing `icon.svg` next to live text — the
  spacing and the cap-height alignment are baked into `logo.svg`.
- Below 32px use `favicon.svg`; the mark alone, never the lockup.
