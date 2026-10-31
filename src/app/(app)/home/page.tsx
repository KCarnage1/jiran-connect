"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  Lock,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CommunityCard, EventCard } from "@/components/app/Cards";
import { Avatar, Badge, GlassCard, GlassLink } from "@/components/ui/glass";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { communities, events, emirateLabel } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default function HomePage() {
  const { user } = useAuth();
  const { t, pick, locale } = useLocale();
  if (!user) return null;

  const name = pick(user.nameEn, user.nameAr);
  const emirate = emirateLabel(user.emirate);
  const nearYou = communities
    .filter((community) => community.emirate === user.emirate)
    .slice(0, 3)
    .concat(communities.filter((community) => community.emirate !== user.emirate).slice(0, 1));
  const upcoming = events.filter((event) => !user.attending.includes(event.id)).slice(0, 3);
  const stats = [
    { icon: Users, value: String(user.joinedMajlis.length), label: "home.statsMajlis" },
    { icon: CalendarDays, value: String(user.attending.length), label: "home.statsEvents" },
    { icon: UserRound, value: "12", label: "home.statsNeighbours" },
  ] as const;

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
              {t("home.greeting")}, {emirate ? pick(emirate.en, emirate.ar) : ""}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-sanad-emerald-950 md:text-4xl dark:text-sanad-beige-50">
              {name}
            </h1>
            <p className="mt-2 text-base text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
              {t("home.subline")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar name={name} size="lg" />
            <div className="hidden sm:block">
              <Badge tone={user.verified ? "gold" : "beige"} icon={user.verified ? <CheckCircle2 aria-hidden="true" className="size-3.5" /> : <Lock aria-hidden="true" className="size-3.5" />}>
                {user.verified ? t("common.verified") : t("common.unverified")}
              </Badge>
              <p className="mt-1.5 text-xs text-sanad-emerald-900/50 dark:text-sanad-beige-100/50">
                {t("common.demoMode")}
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Stats + verification */}
      <div className="grid gap-4 md:grid-cols-3">
        <StaggerGroup className="contents">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.label}>
                <GlassCard className="flex items-center gap-4">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-sanad-emerald-900/10 text-sanad-emerald-900 dark:bg-white/10 dark:text-sanad-gold-300">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-bold text-sanad-emerald-950 dark:text-sanad-beige-50">
                      {stat.value}
                    </p>
                    <p className="text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                      {t(stat.label)}
                    </p>
                  </div>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Verification / trust card */}
        <Reveal className="lg:col-span-1">
          <GlassCard className="flex h-full flex-col justify-between bg-sanad-emerald-900/95 text-sanad-beige-50">
            <div>
              <span className="flex size-11 items-center justify-center rounded-xl bg-sanad-gold-400/20 text-sanad-gold-300">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">
                {user.verified ? t("home.verifiedTitle") : t("home.verifyTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-sanad-beige-100/70">
                {user.verified ? t("home.verifiedDesc") : t("home.verifyDesc")}
              </p>
            </div>
            <GlassLink
              href="/verify"
              variant={user.verified ? "glass" : "gold"}
              size="sm"
              className="mt-5 w-fit self-start"
            >
              {user.verified ? t("common.viewDetails") : t("home.verifyCta")}
              <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
            </GlassLink>
          </GlassCard>
        </Reveal>

        {/* AI card */}
        <Reveal className="lg:col-span-2" delay={0.06}>
          <GlassCard className="h-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge tone="gold" icon={<Sparkles aria-hidden="true" className="size-3.5" />}>
                  {t("ai.title")}
                </Badge>
                <h2 className="mt-3 text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                  {t("home.aiTitle")}
                </h2>
                <p className="mt-1 text-sm text-sanad-emerald-900/65 dark:text-sanad-beige-100/65">
                  {t("home.aiDesc")}
                </p>
              </div>
              <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-sanad-emerald-900 text-sanad-gold-300 sm:flex">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {(["home.aiQ1", "home.aiQ2", "home.aiQ3"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("sanad:open-ai"))}
                  className="rounded-full border border-sanad-emerald-900/15 bg-white/60 px-3.5 py-2 text-xs font-medium text-sanad-emerald-900 transition-all duration-300 hover:border-sanad-gold-400 hover:bg-white hover:shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-sanad-beige-100"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>

      {/* Near you */}
      <section aria-labelledby="near-you">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="near-you" className="text-xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("home.nearYou")}
            </h2>
            <p className="mt-1 text-sm text-sanad-emerald-900/65 dark:text-sanad-beige-100/65">
              {t("home.nearYouSub")}
            </p>
          </div>
          <Link href="/community" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-sanad-emerald-900 hover:text-sanad-gold-500 dark:text-sanad-beige-100 dark:hover:text-sanad-gold-300">
            {t("common.viewAll")}
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Link>
        </div>
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {nearYou.map((community) => (
            <StaggerItem key={community.id}>
              <CommunityCard community={community} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Upcoming events */}
      <section aria-labelledby="upcoming">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="upcoming" className="text-xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("home.upcoming")}
            </h2>
            <p className="mt-1 text-sm text-sanad-emerald-900/65 dark:text-sanad-beige-100/65">
              {upcoming[0] ? formatDate(upcoming[0].startsAt, locale, "EEEE d MMMM") : ""}
            </p>
          </div>
          <Link href="/events" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-sanad-emerald-900 hover:text-sanad-gold-500 dark:text-sanad-beige-100 dark:hover:text-sanad-gold-300">
            {t("common.viewAll")}
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Link>
        </div>
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((event) => (
            <StaggerItem key={event.id}>
              <EventCard event={event} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Newcomer banner */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-sanad-emerald-950 p-6 md:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full bg-sanad-gold-400/20 blur-[90px]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <Badge className="border border-sanad-gold-400/30 bg-sanad-gold-400/10 text-sanad-gold-300" icon={<Compass aria-hidden="true" className="size-3.5" />}>
                {t("nav.newToTown")}
              </Badge>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-sanad-beige-50 md:text-2xl">
                {t("home.newcomerBannerTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-sanad-beige-100/70">
                {t("home.newcomerBannerDesc")}
              </p>
            </div>
            <GlassLink href="/new-to-town" variant="gold" size="md" className="w-fit shrink-0">
              {t("home.newcomerBannerCta")}
              <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
            </GlassLink>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
