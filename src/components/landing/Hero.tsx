"use client";

import { ArrowRight, CalendarDays, CheckCircle2, Fingerprint, ShieldCheck, Sparkles } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, GlassLink, Progress } from "@/components/ui/glass";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

const stats = [
  { value: "128", key: "landing.statCommunities" },
  { value: "14,200", key: "landing.statMembers" },
  { value: "3,400", key: "landing.statEvents" },
] as const;

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden bg-sanad-emerald-950 pb-16 pt-28 md:pb-24 md:pt-36">
      {/* Ambient light — emerald depth plus one gold accent. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 end-[-10%] size-[34rem] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-[-16rem] start-[-10%] size-[28rem] rounded-full bg-sanad-gold-400/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 md:px-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Reveal>
            <Badge tone="gold" className="border border-sanad-gold-400/30 bg-sanad-gold-400/10 text-sanad-gold-300" icon={<Sparkles aria-hidden="true" className="size-3.5" />}>
              {t("landing.badge")}
            </Badge>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.12] tracking-tight text-sanad-beige-50 md:text-6xl">
              {t("landing.title")}
            </h1>
            <p className="mt-4 text-lg font-medium text-sanad-gold-300/90 md:text-xl">
              {t("landing.titleAr")}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-sanad-beige-100/75 md:text-lg">
              {t("landing.subtitle")}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <GlassLink href="/register" variant="gold" size="lg">
                {t("landing.ctaPrimary")}
                <ArrowRight aria-hidden="true" className="size-5 rtl:rotate-180" />
              </GlassLink>
              <GlassLink
                href="/community"
                variant="glass"
                size="lg"
                className="text-sanad-beige-50 hover:bg-white/10"
              >
                {t("landing.ctaSecondary")}
              </GlassLink>
            </div>
          </Reveal>

          <StaggerGroup className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            {(["landing.trust1", "landing.trust2", "landing.trust3", "landing.trust4"] as const).map(
              (key) => (
                <StaggerItem key={key}>
                  <div className="flex items-start gap-2.5 text-sm text-sanad-beige-100/80">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sanad-gold-400" />
                    <span>{t(key)}</span>
                  </div>
                </StaggerItem>
              ),
            )}
          </StaggerGroup>

          <Reveal delay={0.24}>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6">
              {stats.map((stat) => (
                <div key={stat.key}>
                  <dt className="text-xs uppercase tracking-[0.16em] text-sanad-beige-100/50">
                    {t(stat.key)}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-sanad-beige-50">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Frosted product collage */}
        <div className="relative lg:col-span-5">
          <StaggerGroup className="flex flex-col gap-4" delayChildren={0.1}>
            <StaggerItem>
              <div className="bg-white/80 dark:bg-emerald-950/70 backdrop-blur-xl border border-white/30 dark:border-emerald-800/40 shadow-lg rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-sanad-emerald-900 text-sanad-gold-300">
                      <ShieldCheck aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                        UAE PASS
                      </p>
                      <p className="text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                        {t("common.verified")}
                      </p>
                    </div>
                  </div>
                  <Badge tone="gold" icon={<Fingerprint aria-hidden="true" className="size-3.5" />}>
                    SHA-256
                  </Badge>
                </div>
                <div className="mt-5 rounded-xl border border-sanad-emerald-900/10 bg-sanad-emerald-900/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <p className="font-mono text-[11px] text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                    id_hash
                  </p>
                  <p className="mt-1 truncate font-mono text-sm text-sanad-emerald-950 dark:text-sanad-beige-50">
                    9f2a4c…c41b7e · 32 bytes
                  </p>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                  {t("verify.hashNote")}
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white/80 dark:bg-emerald-950/70 backdrop-blur-xl border border-white/30 dark:border-emerald-800/40 shadow-lg rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-sanad-gold-400/20 text-sanad-gold-500">
                    <CalendarDays aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                      {t("landing.platformP2")}
                    </p>
                    <p className="text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                      6 Nov · 19:30 · Al Barsha
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                  <span>12 / 12 {t("common.going")}</span>
                  <span className="font-semibold text-sanad-gold-500">{t("events.full")}</span>
                </div>
                <div className="mt-2">
                  <Progress value={12} max={12} />
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white/80 dark:bg-emerald-950/70 backdrop-blur-xl border border-white/30 dark:border-emerald-800/40 shadow-lg rounded-2xl flex items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sanad-emerald-900 text-sanad-gold-300">
                  <Sparkles aria-hidden="true" className="size-4" />
                </span>
                <p className="text-sm text-sanad-emerald-950/80 dark:text-sanad-beige-100/80">
                  {t("home.aiQ1")}
                </p>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
