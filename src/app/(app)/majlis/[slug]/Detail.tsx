"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, Check, MapPin, ShieldCheck, Users } from "lucide-react";
import { EventCard } from "@/components/app/Cards";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Avatar, Badge, GlassButton, GlassCard, Progress } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/Reveal";
import {
  categoryLabel,
  emirateLabel,
  eventsForCommunity,
  getCommunity,
} from "@/lib/data";
import { formatNumber } from "@/lib/format";

export default function MajlisDetail({ slug }: { slug: string }) {
  const { t, pick, locale } = useLocale();
  const { user, toggleMajlis } = useAuth();
  const community = getCommunity(slug);

  if (!community) {
    return (
      <GlassCard className="py-16 text-center">
        <p className="text-base font-medium text-sanad-emerald-950 dark:text-sanad-beige-50">
          {t("common.none")}
        </p>
        <Link href="/majlis" className="mt-3 inline-block text-sm font-medium text-sanad-gold-500">
          {t("common.back")}
        </Link>
      </GlassCard>
    );
  }

  const category = categoryLabel(community.category);
  const emirate = emirateLabel(community.emirate);
  const upcoming = eventsForCommunity(community.slug);
  const joined = user?.joinedMajlis.includes(community.slug) ?? false;
  const members = ["Noura Al Suwaidi", "Omar Al Hashmi", "Hessa Al Qasimi", "Yousef Al Ali", "Fatima Rahman"];

  return (
    <div className="space-y-6">
      <Link
        href="/majlis"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-sanad-emerald-900/70 hover:text-sanad-emerald-950 dark:text-sanad-beige-100/70 dark:hover:text-sanad-beige-50"
      >
        <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        {t("nav.majlis")}
      </Link>

      <Reveal>
        <GlassCard padded={false} className="overflow-hidden">
          <div className={`relative h-40 bg-gradient-to-br ${community.accent} md:h-48`}>
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
            <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
              <Badge className="border border-white/20 bg-white/15 text-white backdrop-blur-md">
                {category ? pick(category.en, category.ar) : community.category}
              </Badge>
              {community.verifiedOnly ? (
                <Badge className="border border-white/20 bg-white/15 text-white backdrop-blur-md" icon={<ShieldCheck aria-hidden="true" className="size-3.5" />}>
                  {t("common.verified")}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-bold tracking-tight text-sanad-emerald-950 md:text-4xl dark:text-sanad-beige-50">
                  {pick(community.nameEn, community.nameAr)}
                </h1>
                <p className="mt-3 text-base leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                  {pick(community.descEn, community.descAr)}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sanad-emerald-900/65 dark:text-sanad-beige-100/65">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden="true" className="size-4" />
                    {emirate ? pick(emirate.en, emirate.ar) : community.emirate}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users aria-hidden="true" className="size-4" />
                    {formatNumber(community.members, locale)} {t("common.members")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    {upcoming.length} {t("nav.events")}
                  </span>
                </div>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-3 md:w-56">
                <GlassButton
                  variant={joined ? "glass" : "primary"}
                  size="lg"
                  onClick={() => toggleMajlis(community.slug)}
                  aria-pressed={joined}
                >
                  {joined ? <Check aria-hidden="true" className="size-4" /> : <Users aria-hidden="true" className="size-4" />}
                  {joined ? t("common.joined") : t("common.join")}
                </GlassButton>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                    <span>{t("common.capacity")}</span>
                    <span>{Math.round((community.members / 500) * 100)}%</span>
                  </div>
                  <Progress value={community.members} max={500} />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <GlassCard className="h-full">
            <h2 className="text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("majlis.about")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sanad-emerald-900/75 dark:text-sanad-beige-100/75">
              {pick(community.descEn, community.descAr)}
            </p>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-sanad-gold-500 dark:text-sanad-gold-300">
              {t("majlis.rules")}
            </h3>
            <ul className="mt-3 space-y-2.5">
              {(["majlis.rule1", "majlis.rule2", "majlis.rule3"] as const).map((rule) => (
                <li key={rule} className="flex items-start gap-2.5 text-sm text-sanad-emerald-900/75 dark:text-sanad-beige-100/75">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sanad-gold-500" />
                  {t(rule)}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-sanad-gold-500 dark:text-sanad-gold-300">
              {t("majlis.members")}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {members.map((member) => (
                <span
                  key={member}
                  className="inline-flex items-center gap-2 rounded-full border border-sanad-emerald-900/10 bg-white/60 py-1 ps-1 pe-3 text-xs text-sanad-emerald-900/80 dark:border-white/10 dark:bg-white/5 dark:text-sanad-beige-100/80"
                >
                  <Avatar name={member} size="sm" />
                  {member}
                </span>
              ))}
              <Badge tone="beige">+{community.members - members.length}</Badge>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.06}>
          <GlassCard className="h-full">
            <h2 className="text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("common.host")}
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={pick(community.hostEn, community.hostAr)} size="lg" />
              <div>
                <p className="text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                  {pick(community.hostEn, community.hostAr)}
                </p>
                <Badge tone="gold" className="mt-1">
                  {t("common.host")}
                </Badge>
              </div>
            </div>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-sanad-gold-500 dark:text-sanad-gold-300">
              {t("majlis.next")}
            </h3>
            <p className="mt-2 text-sm text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
              {upcoming[0] ? pick(upcoming[0].titleEn, upcoming[0].titleAr) : t("common.none")}
            </p>
          </GlassCard>
        </Reveal>
      </div>

      {upcoming.length > 0 ? (
        <section aria-labelledby="majlis-events">
          <h2 id="majlis-events" className="mb-4 text-xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
            {t("home.upcoming")}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
