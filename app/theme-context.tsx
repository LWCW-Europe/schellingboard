"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  themeClass,
  themeColors,
  type Theme,
} from "@/utils/theme";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({ theme: "system", setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  initial,
  children,
}: {
  initial: Theme;
  children: ReactNode;
}) {
  const [theme, setStoredTheme] = useState<Theme>(initial);

  const setTheme = (next: Theme) => {
    setStoredTheme(next);
    // The cookie only decides the *next* server render, so the class has to be
    // moved here as well for the page to change under the reader's hands.
    // Nothing else: `color-scheme` follows the class, in globals.css.
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (themeClass(next)) root.classList.add(themeClass(next));
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {/* React hoists these into <head>. The window chrome around an
          installed app follows them, so they are rendered from the theme
          state rather than by the layout, which only knows the cookie. */}
      {themeColors(theme).map(({ media, color }) => (
        <meta
          key={media ?? color}
          name="theme-color"
          media={media}
          content={color}
        />
      ))}
      {children}
    </ThemeContext.Provider>
  );
}
