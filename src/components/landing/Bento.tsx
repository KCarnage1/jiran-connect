"use client";

import {
  Hash,
  Landmark,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/Reveal";

export function Bento() {
  const { t } = useLocale();

  return (
    <section id="features" className="scroll-mt-24 bg-sanad-beige-50 py-12 md:py-16 dark:bg-sanad-emerald-950">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sanad-gold-500 dark:text-sanad-gold-300">
              {t("brand.full")}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-sanad-emerald-950 md:text-5xl dark:text-sanad-beige-50">
              {t("landing.bentoTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-sanad-emerald-900/70 md:text-lg dark:text-sanad-beige-100/70">
              {t("landing.bentoSubtitle")}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-6">
          {/* UAE PASS */}
          <Reveal className="md:col-span-3" delay={0.04}>
            <GlassCard interactive className="h-full">
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-sanad-emerald-900 text-sanad-gold-300">
                  <ShieldCheck aria-hidden="true" className="size-6" />
                </span>
                <Badge tone="gold" icon={<UserCheck aria-hidden="true" className="size-3.5" />}>
                  UAE PASS
                </Badge>
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                {t("landing.verified.title")}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                {t("landing.verified.desc")}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge tone="emerald" icon={<Hash aria-hidden="true" className="size-3.5" />}>
                  sha256 · 32 bytes
                </Badge>
                <Badge tone="emerald">{t("verify.storedStatus")}: verified</Badge>
                <Badge tone="emerald">{t("verify.storedAt")}: 12 Mar 2026</Badge>
              </div>
            </GlassCard>
          </Reveal>

          {/* AI assistant */}
          <Reveal className="md:col-span-3" delay={0.08}>
            <GlassCard interactive className="h-full">
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-sanad-gold-400/20 text-sanad-gold-500">
                  <Sparkles aria-hidden="true" className="size-6" />
                </span>
                <Badge tone="emerald" icon={<MessageSquare aria-hidden="true" className="size-3.5" />}>
                  {t("ai.title")}
                </Badge>
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                {t("landing.ai.title")}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                {t("landing.ai.desc")}
              </p>
              <div className="mt-6 space-y-2">
                <div className="ms-auto w-fit max-w-[85%] rounded-2xl rounded-ee-md bg-sanad-emerald-900 px-4 py-2.5 text-sm text-sanad-beige-50">
                  {t("home.aiQ2")}
                </div>
                <div className="w-fit max-w-[90%] rounded-2xl rounded-es-md border border-sanad-emerald-900/10 bg-white/70 px-4 py-2.5 text-sm text-sanad-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-sanad-beige-100">
                  {t("ai.quick2")}
                </div>
              </div>
            </GlassCard>
          </Reveal>

          {/* Cultural exchange */}
          <Reveal className="md:col-span-2" delay={0.12}>
            <GlassCard interactive className="h-full">
              <span className="flex size-12 items-center justify-center rounded-xl bg-sanad-emerald-900/10 text-sanad-emerald-900 dark:bg-white/10 dark:text-sanad-gold-300">
                <Landmark aria-hidden="true" className="size-6" />
              </span>
              <h3 className="mt-6 text-lg font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                {t("landing.culture.title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                {t("landing.culture.desc")}
              </p>
              <div id="culture" className="mt-5 flex flex-wrap gap-2 scroll-mt-24">
                {["حناء", "خط النسخ", "آداب المجلس"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-sanad-gold-400/30 bg-sanad-gold-400/10 px-3 py-1 text-xs font-medium text-sanad-emerald-900 dark:text-sanad-gold-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </GlassCard>
          </Reveal>

          {/* Privacy */}
          <Reveal className="md:col-span-4" delay={0.16}>
            <GlassCard interactive className="h-full">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-sm">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-sanad-emerald-900/10 text-sanad-emerald-900 dark:bg-white/10 dark:text-sanad-gold-300">
                    <Lock aria-hidden="true" className="size-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                    {t("landing.privacy.title")}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                    {t("landing.privacy.desc")}
                  </p>
                </div>
                <div className="w-full max-w-xs rounded-xl bg-sanad-emerald-950 p-4 font-mono text-[11px] leading-relaxed text-sanad-beige-100/80 shadow-inner">
                  <p className="text-sanad-gold-300">-- every table, no exceptions</p>
                  <p>ALTER TABLE public.profiles</p>
                  <p className="ps-4">ENABLE ROW LEVEL SECURITY;</p>
                  <p className="mt-2">CREATE POLICY &quot;read own&quot;</p>
                  <p className="ps-4">ON public.profiles</p>
                  <p className="ps-4">USING (id = auth.uid());</p>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
