"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createBrowserStore } from "@/lib/browser-store";
import { THEME_COOKIE } from "@/lib/i18n/dictionary";

type Theme = "light" | "dark";
interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readThemeCookie(fallback: Theme): Theme {
  const match = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`));
  return match?.[1] === "dark" ? "dark" : match?.[1] === "light" ? "light" : fallback;
}

function writeThemeCookie(theme: Theme) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) {
  // Same contract as locale: the server reads the cookie and renders the `dark`
  // class, so the first client render matches without a flash.
  const store = useMemo(
    () =>
      createBrowserStore<Theme>({
        read: () => readThemeCookie(initialTheme),
        write: writeThemeCookie,
        fallback: initialTheme,
      }),
    [initialTheme],
  );

  const theme = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  // Apply the theme to the document (external system, no state writes).
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const setTheme = useCallback((next: Theme) => store.set(next), [store]);
  const toggleTheme = useCallback(
    () => store.set(readThemeCookie(initialTheme) === "dark" ? "light" : "dark"),
    [store, initialTheme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}
