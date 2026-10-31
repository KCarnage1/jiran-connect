"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, GlassCard, GlassLink } from "@/components/ui/glass";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

export function HowItWorks() {
  const { t } = useLocale();
  const steps = [
    { n: "01", title: "landing.step1.title", desc: "landing.step1.desc", icon: ShieldCheck },
    { n: "02", title: "landing.step2.title", desc: "landing.step2.desc", icon: Compass },
    { n: "03", title: "landing.step3.title", desc: "landing.step3.desc", icon: Users },
  ] as const;

  return (
    <section id="how" className="scroll-mt-24 bg-white/40 py-12 md:py-16 dark:bg-emerald-950/40">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sanad-gold-500 dark:text-sanad-gold-300">
              {t("landing.howTitle")}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-sanad-emerald-950 md:text-4xl dark:text-sanad-beige-50">
              {t("landing.howSubtitle")}
            </h2>
          </div>
        </Reveal>

        <StaggerGroup className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.n}>
                <GlassCard interactive className="relative h-full overflow-hidden">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-4 end-2 font-display text-7xl font-bold text-sanad-emerald-900/5 dark:text-white/5"
                  >
                    {step.n}
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-sanad-emerald-900 text-sanad-gold-300">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                    {t(step.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                    {t(step.desc)}
                  </p>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

export function Platform() {
  const { t } = useLocale();

  return (
    <section className="bg-sanad-beige-50 py-12 md:py-16 dark:bg-sanad-emerald-950">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:px-6 lg:grid-cols-2">
        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sanad-gold-500 dark:text-sanad-gold-300">
              {t("brand.tagline")}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-sanad-emerald-950 md:text-4xl dark:text-sanad-beige-50">
              {t("landing.platformTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-sanad-emerald-900/70 md:text-lg dark:text-sanad-beige-100/70">
              {t("landing.platformSubtitle")}
            </p>

            <ul className="mt-8 space-y-4">
              {([
                { icon: Users, title: "landing.platformP1", desc: "landing.platformP1d" },
                { icon: MapPin, title: "landing.platformP2", desc: "landing.platformP2d" },
                { icon: CalendarDays, title: "landing.platformP3", desc: "landing.platformP3d" },
              ] as const).map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-sanad-emerald-900/10 bg-white/70 text-sanad-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-sanad-gold-300">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                        {t(item.title)}
                      </p>
                      <p className="text-sm text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                        {t(item.desc)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        <Reveal variant="scale" delay={0.08}>
          <GlassCard padded={false} className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-sanad-emerald-900/10 px-5 py-3 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md bg-sanad-emerald-900 text-sanad-gold-300">
                  <ShieldCheck aria-hidden="true" className="size-3.5" />
                </span>
                <span className="text-xs font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                  {t("brand.name")}
                </span>
              </div>
              <Badge tone="gold">Live</Badge>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {[
                { emirate: "Dubai", name: "Al Barsha Families", members: 412, accent: "from-emerald-900 to-emerald-600" },
                { emirate: "Abu Dhabi", name: "Corniche Walkers", members: 268, accent: "from-teal-800 to-cyan-600" },
                { emirate: "Sharjah", name: "Sharjah Calligraphers", members: 156, accent: "from-amber-900 to-emerald-700" },
                { emirate: "RAK", name: "RAK Heritage Circle", members: 98, accent: "from-stone-800 to-emerald-700" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-sanad-emerald-900/10 bg-white/60 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
                >
                  <div className={`h-12 rounded-lg bg-gradient-to-br ${item.accent}`} />
                  <p className="mt-2.5 text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                    {item.name}
                  </p>
                  <p className="text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                    {item.emirate} · {item.members} {t("common.members")}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-sanad-emerald-900/10 px-5 py-3 text-xs text-sanad-emerald-900/60 dark:border-white/10 dark:text-sanad-beige-100/60">
              <span className="inline-flex items-center gap-1.5">
                <Check aria-hidden="true" className="size-3.5 text-sanad-gold-500" />
                RLS {t("common.verified")}
              </span>
              <span>{t("common.demoMode")}</span>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

export function CtaBand() {
  const { t } = useLocale();
  return (
    <section className="px-4 pb-16 md:px-6 md:pb-24">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-sanad-emerald-950 px-6 py-12 text-center md:px-12 md:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 start-1/2 size-72 -translate-x-1/2 rounded-full bg-sanad-gold-400/20 blur-[100px]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-sanad-beige-50 md:text-4xl">
              {t("landing.ctaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-sanad-beige-100/70 md:text-lg">
              {t("landing.ctaSubtitle")}
            </p>
            <div className="mt-8 flex justify-center">
              <GlassLink href="/register" variant="gold" size="lg">
                {t("landing.ctaButton")}
                <ArrowRight aria-hidden="true" className="size-5 rtl:rotate-180" />
              </GlassLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
