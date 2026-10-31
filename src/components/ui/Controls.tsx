"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const control =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl border border-sanad-emerald-900/10 bg-white/60 px-3 text-sm font-medium text-sanad-emerald-900 backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-sanad-beige-100 dark:hover:bg-white/10";

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, toggleLocale } = useLocale();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={cn(control, className)}
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      title={locale === "ar" ? "English" : "العربية"}
    >
      <Languages aria-hidden="true" className="size-4" />
      <span className="text-xs font-semibold tracking-wide">{locale === "ar" ? "EN" : "ع"}</span>
    </button>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(control, className)}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light" : "Dark"}
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}
