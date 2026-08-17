"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  themeClass,
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
      {children}
    </ThemeContext.Provider>
  );
}
