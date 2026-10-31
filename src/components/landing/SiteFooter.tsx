"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LocaleToggle, ThemeToggle } from "@/components/ui/Controls";

export function SiteFooter() {
  const { t } = useLocale();

  const columns = [
    {
      title: "landing.footerProduct",
      links: [
        { label: "nav.findCommunity", href: "/community" },
        { label: "nav.events", href: "/events" },
        { label: "nav.majlis", href: "/majlis" },
      ],
    },
    {
      title: "landing.footerCommunity",
      links: [
        { label: "nav.newToTown", href: "/new-to-town" },
        { label: "nav.culture", href: "/culture" },
        { label: "nav.profile", href: "/profile" },
      ],
    },
    {
      title: "landing.footerLegal",
      links: [
        { label: "landing.footerPrivacy", href: "/legal/privacy" },
        { label: "landing.footerTerms", href: "/legal/terms" },
        { label: "landing.footerCookies", href: "/legal/cookies" },
      ],
    },
  ] as const;

  return (
    <footer className="mt-auto border-t border-sanad-emerald-900/10 bg-white/50 dark:border-white/10 dark:bg-emerald-950/60">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-sanad-emerald-900 text-sanad-gold-300">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-base font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                  {t("brand.name")}
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-sanad-emerald-900/50 dark:text-sanad-beige-100/50">
                  Jiran Connect
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
              {t("landing.footerTagline")}
            </p>
            <div className="mt-5 flex gap-2">
              <LocaleToggle />
              <ThemeToggle />
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={t(column.title)}>
              <p className="text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                {t(column.title)}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-sanad-emerald-900/70 transition-colors duration-300 hover:text-sanad-emerald-900 dark:text-sanad-beige-100/70 dark:hover:text-sanad-beige-50"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-sanad-emerald-900/10 pt-6 text-xs text-sanad-emerald-900/60 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-sanad-beige-100/60">
          <p>{t("landing.footerRights")}</p>
          <p>{t("common.demoMode")}</p>
        </div>
      </div>
    </footer>
  );
}
