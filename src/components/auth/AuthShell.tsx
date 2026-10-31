"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LocaleToggle, ThemeToggle } from "@/components/ui/Controls";
import { GlassCard } from "@/components/ui/glass";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useLocale();

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-sanad-emerald-950 p-10 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 end-0 size-96 rounded-full bg-emerald-500/20 blur-[110px]" />
          <div className="absolute bottom-0 start-0 size-80 rounded-full bg-sanad-gold-400/15 blur-[110px]" />
        </div>

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-sanad-gold-400/15 ring-1 ring-sanad-gold-400/40">
            <ShieldCheck aria-hidden="true" className="size-5 text-sanad-gold-300" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-semibold text-sanad-beige-50">{t("brand.name")}</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-sanad-beige-100/50">
              Jiran Connect
            </span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="font-display text-3xl font-semibold leading-snug text-sanad-beige-50">
            {t("landing.title")}
          </p>
          <p className="mt-4 text-base leading-relaxed text-sanad-beige-100/70">
            {t("landing.subtitle")}
          </p>
          <ul className="mt-8 space-y-3">
            {(["landing.trust1", "landing.trust2", "landing.trust4"] as const).map((key) => (
              <li key={key} className="flex items-start gap-2.5 text-sm text-sanad-beige-100/80">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sanad-gold-400" />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-sanad-beige-100/40">{t("landing.footerRights")}</p>
      </aside>

      {/* Form panel */}
      <div className="relative flex flex-col bg-sanad-beige-50 dark:bg-sanad-emerald-950">
        <div className="flex items-center justify-between px-4 py-4 md:px-8">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-medium text-sanad-emerald-900/70 transition-colors hover:text-sanad-emerald-950 dark:text-sanad-beige-100/70 dark:hover:text-sanad-beige-50"
          >
            <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
            {t("brand.name")}
          </Link>
          <div className="flex gap-2">
            <LocaleToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-12 md:px-8">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center lg:text-start">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-sanad-gold-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sanad-gold-500 dark:text-sanad-gold-300">
                <Sparkles aria-hidden="true" className="size-3" />
                {t("common.demoMode")}
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                {title}
              </h1>
              <p className="mt-2 text-base text-sanad-emerald-900/65 dark:text-sanad-beige-100/65">
                {subtitle}
              </p>
            </div>

            <GlassCard className="p-6 md:p-8">{children}</GlassCard>

            {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
