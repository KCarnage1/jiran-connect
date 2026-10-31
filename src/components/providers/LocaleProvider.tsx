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
import { dictionaries, LOCALE_COOKIE, type DictKey, type Locale } from "@/lib/i18n/dictionary";
import { createBrowserStore } from "@/lib/browser-store";

type Direction = "ltr" | "rtl";

interface LocaleContextValue {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  /** Translate a dictionary key; falls back to the key so nothing renders empty. */
  t: (key: DictKey) => string;
  /** Pick the right side of a bilingual pair from data files. */
  pick: <T>(en: T, ar: T) => T;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readLocaleCookie(fallback: Locale): Locale {
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  return match?.[1] === "en" ? "en" : match?.[1] === "ar" ? "ar" : fallback;
}

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LocaleProvider({
  children,
  initialLocale = "ar",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  // The cookie is the single source of truth: the server reads it to render
  // <html lang dir> and the correct language, so hydration always matches.
  const store = useMemo(
    () =>
      createBrowserStore<Locale>({
        read: () => readLocaleCookie(initialLocale),
        write: writeLocaleCookie,
        fallback: initialLocale,
      }),
    [initialLocale],
  );

  const locale = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  const dir: Direction = locale === "ar" ? "rtl" : "ltr";

  // Keep document attributes in sync (external system, no state writes).
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
  }, [locale, dir]);

  const setLocale = useCallback((next: Locale) => store.set(next), [store]);
  const toggleLocale = useCallback(
    () => store.set(readLocaleCookie(initialLocale) === "ar" ? "en" : "ar"),
    [store, initialLocale],
  );

  const value = useMemo<LocaleContextValue>(() => {
    const table = dictionaries[locale];
    return {
      locale,
      dir,
      setLocale,
      toggleLocale,
      t: (key) => table[key] ?? key,
      pick: (en, ar) => (locale === "ar" ? ar : en),
    };
  }, [locale, dir, setLocale, toggleLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside <LocaleProvider>");
  return context;
}
