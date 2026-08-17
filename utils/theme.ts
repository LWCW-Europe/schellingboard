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
