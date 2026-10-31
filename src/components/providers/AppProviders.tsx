"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/dictionary";
import type { SessionUser } from "@/lib/auth-types";
import { AuthProvider } from "./AuthProvider";
import { LocaleProvider } from "./LocaleProvider";
import { ThemeProvider } from "./ThemeProvider";

export function AppProviders({
  children,
  initialLocale = "ar",
  initialTheme = "light",
  initialUser,
}: {
  children: ReactNode;
  initialLocale?: Locale;
  initialTheme?: "light" | "dark";
  initialUser?: SessionUser | null;
}) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <LocaleProvider initialLocale={initialLocale}>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
