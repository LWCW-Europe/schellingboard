export const THEME_COOKIE = "sb-theme";

export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const THEMES = ["system", "light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

export function normalizeTheme(value: string | undefined): Theme {
  return THEMES.includes(value as Theme) ? (value as Theme) : "system";
}

/**
 * "system" deliberately renders no class: the `dark` variant in
 * `app/globals.css` follows the operating system whenever <html> is not pinned
 * to `.light`, which keeps the first paint correct with no blocking script.
 */
export function themeClass(theme: Theme): string {
  return theme === "system" ? "" : theme;
}

// `--surface` from app/globals.css, for the two places that can't read CSS:
// the manifest, and the theme-color meta tag that colours the window chrome
// around an installed app.
export const LIGHT_SURFACE = "#ffffff";
export const DARK_SURFACE = "#16181d";

export type ThemeColor = { media?: string; color: string };

/**
 * What the theme-color meta tag(s) should say for `theme`. "system" needs one
 * tag per scheme, since only a media query can follow the operating system.
 */
export function themeColors(theme: Theme): ThemeColor[] {
  switch (theme) {
    case "light":
      return [{ color: LIGHT_SURFACE }];
    case "dark":
      return [{ color: DARK_SURFACE }];
    case "system":
      return [
        { media: "(prefers-color-scheme: light)", color: LIGHT_SURFACE },
        { media: "(prefers-color-scheme: dark)", color: DARK_SURFACE },
      ];
  }
}
