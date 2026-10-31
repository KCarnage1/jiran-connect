import { format, formatDistanceToNowStrict } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import type { Locale } from "@/lib/i18n/dictionary";

const locales = { ar, en: enUS } as const;

export function formatDate(iso: string, locale: Locale, pattern = "d MMMM yyyy") {
  return format(new Date(iso), pattern, { locale: locales[locale] });
}

export function formatTime(iso: string, locale: Locale) {
  return format(new Date(iso), "h:mm a", { locale: locales[locale] });
}

export function formatRange(startIso: string, endIso: string, locale: Locale) {
  return `${formatDate(startIso, locale, "EEEE d MMMM")} · ${formatTime(startIso, locale)} – ${formatTime(endIso, locale)}`;
}

export function relativeDate(iso: string, locale: Locale) {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true, locale: locales[locale] });
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE").format(value);
}

export function formatAed(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}
