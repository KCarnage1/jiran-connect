"use client";

import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LocaleToggle, ThemeToggle } from "@/components/ui/Controls";
import { GlassLink } from "@/components/ui/glass";

const links = [
  { href: "#features", key: "landing.bentoTitle" },
  { href: "#how", key: "landing.howTitle" },
  { href: "#culture", key: "landing.culture.title" },
] as const;

export function LandingNav() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-sanad-beige-50">
          <span className="flex size-10 items-center justify-center rounded-xl bg-sanad-gold-400/15 ring-1 ring-sanad-gold-400/40">
            <ShieldCheck aria-hidden="true" className="size-5 text-sanad-gold-300" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight">{t("brand.name")}</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-sanad-beige-100/50">
              Jiran Connect
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-sanad-beige-100/80 transition-colors duration-300 hover:bg-white/10 hover:text-sanad-beige-50"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
          <GlassLink href="/login" variant="ghost" size="sm" className="hidden text-sanad-beige-50 sm:inline-flex">
            {t("nav.login")}
          </GlassLink>
          <GlassLink href="/register" variant="gold" size="sm" className="hidden sm:inline-flex">
            {t("common.createAccount")}
          </GlassLink>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={t("nav.menu")}
            className="inline-flex size-11 items-center justify-center rounded-xl border border-white/15 text-sanad-beige-50 md:hidden"
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mx-4 mb-2 rounded-2xl border border-white/15 bg-sanad-emerald-950/95 p-3 backdrop-blur-xl md:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-sanad-beige-100/90 hover:bg-white/10"
              >
                {t(link.key)}
              </a>
            ))}
            <div className="mt-2 flex gap-2 border-t border-white/10 pt-3">
              <GlassLink href="/login" variant="glass" size="sm" className="flex-1">
                {t("nav.login")}
              </GlassLink>
              <GlassLink href="/register" variant="gold" size="sm" className="flex-1">
                {t("common.createAccount")}
              </GlassLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
