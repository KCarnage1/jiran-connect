"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Lock, MapPin, ShieldCheck, Users } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Avatar, Badge, GlassCard, Progress } from "@/components/ui/glass";
import { formatDate, formatNumber, formatTime } from "@/lib/format";
import {
  categoryLabel,
  emirateLabel,
  type Community,
  type CultureItem,
  type EventItem,
} from "@/lib/data";

export function CommunityCard({ community }: { community: Community }) {
  const { t, pick, locale } = useLocale();
  const category = categoryLabel(community.category);
  const emirate = emirateLabel(community.emirate);

  return (
    <Link href={`/majlis/${community.slug}`} className="group block h-full">
      <GlassCard interactive className="flex h-full flex-col">
        <div className={`relative h-24 overflow-hidden rounded-xl bg-gradient-to-br ${community.accent}`}>
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
            <Badge className="border border-white/20 bg-white/15 text-white backdrop-blur-md">
              {category ? pick(category.en, category.ar) : community.category}
            </Badge>
            {community.verifiedOnly ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                <Lock aria-hidden="true" className="size-3" />
                {t("common.verified")}
              </span>
            ) : null}
          </div>
        </div>

        <h3 className="mt-4 text-lg font-semibold tracking-tight text-sanad-emerald-950 group-hover:text-sanad-emerald-800 dark:text-sanad-beige-50">
          {pick(community.nameEn, community.nameAr)}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
          {pick(community.descEn, community.descAr)}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-sanad-emerald-900/10 pt-3 text-xs text-sanad-emerald-900/60 dark:border-white/10 dark:text-sanad-beige-100/60">
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-3.5" />
            {emirate ? pick(emirate.en, emirate.ar) : community.emirate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users aria-hidden="true" className="size-3.5" />
            {formatNumber(community.members, locale)} {t("common.members")}
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}

export function EventCard({ event }: { event: EventItem }) {
  const { t, pick, locale } = useLocale();
  const emirate = emirateLabel(event.emirate);
  const spots = Math.max(event.capacity - event.going, 0);
  const kindLabel = {
    social: pick("Social", "اجتماعي"),
    cultural: pick("Cultural", "ثقافي"),
    workshop: pick("Workshop", "ورشة"),
    heritage: pick("Heritage", "تراث"),
  }[event.kind];

  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <GlassCard interactive padded={false} className="flex h-full flex-col overflow-hidden">
        <div className={`relative h-28 bg-gradient-to-br ${event.accent}`}>
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.35),transparent_60%)]" />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between">
            <Badge className="border border-white/20 bg-white/15 text-white backdrop-blur-md">
              {kindLabel}
            </Badge>
            <div className="rounded-xl bg-white/85 px-2.5 py-1.5 text-center backdrop-blur-md">
              <p className="font-display text-lg font-bold leading-none text-sanad-emerald-950">
                {formatDate(event.startsAt, locale, "d")}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-sanad-emerald-900/60">
                {formatDate(event.startsAt, locale, "MMM")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-base font-semibold tracking-tight text-sanad-emerald-950 group-hover:text-sanad-emerald-800 dark:text-sanad-beige-50">
            {pick(event.titleEn, event.titleAr)}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
            <Clock aria-hidden="true" className="size-3.5" />
            {formatDate(event.startsAt, locale, "EEE d MMM")} · {formatTime(event.startsAt, locale)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
            <MapPin aria-hidden="true" className="size-3.5" />
            {pick(event.venueEn, event.venueAr)} · {emirate ? pick(emirate.en, emirate.ar) : ""}
          </p>

          <div className="mt-auto pt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                {event.going} / {event.capacity} {t("common.going")}
              </span>
              <span className="font-semibold text-sanad-emerald-900 dark:text-sanad-gold-300">
                {spots > 0 ? `${spots} ${t("events.spotsLeft")}` : t("events.full")}
              </span>
            </div>
            <Progress value={event.going} max={event.capacity} />
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

export function CultureCard({ item }: { item: CultureItem }) {
  const { t, pick } = useLocale();
  return (
    <Link href={`/culture/${item.slug}`} className="group block h-full">
      <GlassCard interactive padded={false} className="flex h-full flex-col overflow-hidden">
        <div className={`relative h-32 bg-gradient-to-br ${item.accent}`}>
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_55%)]" />
          <Badge className="absolute inset-x-3 top-3 w-fit border border-white/20 bg-white/15 text-white backdrop-blur-md">
            {item.type === "heritage" ? t("culture.heritage") : t("culture.workshop")}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-base font-semibold tracking-tight text-sanad-emerald-950 group-hover:text-sanad-emerald-800 dark:text-sanad-beige-50">
            {pick(item.titleEn, item.titleAr)}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
            {pick(item.descEn, item.descAr)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="beige" icon={<Clock aria-hidden="true" className="size-3" />}>
              {pick(item.durationEn, item.durationAr)}
            </Badge>
            <Badge tone="beige">{pick(item.levelEn, item.levelAr)}</Badge>
          </div>
          <div className="mt-auto flex items-center justify-between pt-4 text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
            <span className="inline-flex items-center gap-2">
              <Avatar name={pick(item.hostEn, item.hostAr)} size="sm" />
              {pick(item.hostEn, item.hostAr)}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-sanad-emerald-900 group-hover:text-sanad-gold-500 dark:text-sanad-gold-300">
              {t("common.viewDetails")}
              <ArrowRight aria-hidden="true" className="size-3.5 rtl:rotate-180" />
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

export function VerifiedLock({ verifiedOnly }: { verifiedOnly: boolean }) {
  const { t } = useLocale();
  if (!verifiedOnly) return null;
  return (
    <Badge tone="gold" icon={<ShieldCheck aria-hidden="true" className="size-3.5" />}>
      {t("common.verified")}
    </Badge>
  );
}

export function DateStrip({ iso }: { iso: string }) {
  const { locale } = useLocale();
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
      <CalendarDays aria-hidden="true" className="size-3.5" />
      {formatDate(iso, locale, "EEE d MMM")}
    </span>
  );
}
