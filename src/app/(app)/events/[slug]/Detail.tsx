"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { GlassMap } from "@/components/map/GlassMap";
import { Avatar, Badge, GlassButton, GlassCard, Progress } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/Reveal";
import { emirateLabel, getCommunity, getEvent } from "@/lib/data";
import { formatAed, formatDate, formatTime } from "@/lib/format";

export default function EventDetail({ slug }: { slug: string }) {
  const { t, pick, locale } = useLocale();
  const { user, toggleAttending } = useAuth();
  const event = getEvent(slug);
  const [waitlisted, setWaitlisted] = useState(false);

  if (!event) {
    return (
      <GlassCard className="py-16 text-center">
        <p className="text-base font-medium text-sanad-emerald-950 dark:text-sanad-beige-50">
          {t("common.none")}
        </p>
        <Link href="/events" className="mt-3 inline-block text-sm font-medium text-sanad-gold-500">
          {t("common.back")}
        </Link>
      </GlassCard>
    );
  }

  const community = getCommunity(event.communitySlug);
  const emirate = emirateLabel(event.emirate);
  const going = event.going;
  const spots = Math.max(event.capacity - going, 0);
  const attending = user?.attending.includes(event.id) ?? false;
  const full = spots === 0 && !attending;
  const roster = ["Noura Al Suwaidi", "Omar Al Hashmi", "Hessa Al Qasimi", "Fatima Rahman", "Yousef Al Ali"];

  return (
    <div className="space-y-6">
      <Link
        href="/events"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-sanad-emerald-900/70 hover:text-sanad-emerald-950 dark:text-sanad-beige-100/70 dark:hover:text-sanad-beige-50"
      >
        <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        {t("nav.events")}
      </Link>

      <Reveal>
        <GlassCard padded={false} className="overflow-hidden">
          <div className={`relative h-40 bg-gradient-to-br ${event.accent} md:h-52`}>
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.35),transparent_60%)]" />
            <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
              <Badge className="border border-white/20 bg-white/15 text-white backdrop-blur-md">
                {event.kind}
              </Badge>
              {community ? (
                <Badge className="border border-white/20 bg-white/15 text-white backdrop-blur-md">
                  {pick(community.nameEn, community.nameAr)}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-sanad-emerald-950 md:text-4xl dark:text-sanad-beige-50">
              {pick(event.titleEn, event.titleAr)}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sanad-emerald-900/65 dark:text-sanad-beige-100/65">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" className="size-4" />
                {formatDate(event.startsAt, locale, "EEEE d MMMM")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden="true" className="size-4" />
                {formatTime(event.startsAt, locale)} – {formatTime(event.endsAt, locale)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-4" />
                {pick(event.venueEn, event.venueAr)}
              </span>
            </div>
          </div>
        </GlassCard>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Reveal>
            <GlassCard>
              <h2 className="text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                {t("events.aboutEvent")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-sanad-emerald-900/75 dark:text-sanad-beige-100/75">
                {pick(event.descEn, event.descAr)}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-sanad-emerald-900/10 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.14em] text-sanad-emerald-900/45 dark:text-sanad-beige-100/45">
                    {t("events.organiser")}
                  </p>
                  <div className="mt-2 flex items-center gap-2.5">
                    <Avatar name={pick(event.hostEn, event.hostAr)} />
                    <div>
                      <p className="text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                        {pick(event.hostEn, event.hostAr)}
                      </p>
                      <p className="text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                        {emirate ? pick(emirate.en, emirate.ar) : event.emirate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-sanad-emerald-900/10 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.14em] text-sanad-emerald-900/45 dark:text-sanad-beige-100/45">
                    {t("common.capacity")}
                  </p>
                  <p className="mt-2 font-display text-xl font-bold text-sanad-emerald-950 dark:text-sanad-beige-50">
                    {going} / {event.capacity}
                  </p>
                  <div className="mt-2">
                    <Progress value={going} max={event.capacity} />
                  </div>
                  <p className="mt-2 text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                    {spots > 0 ? `${spots} ${t("events.spotsLeft")}` : t("events.full")}
                  </p>
                </div>
              </div>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-sanad-gold-500 dark:text-sanad-gold-300">
                {t("events.attending")}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {roster.map((person) => (
                  <span
                    key={person}
                    className="inline-flex items-center gap-2 rounded-full border border-sanad-emerald-900/10 bg-white/60 py-1 ps-1 pe-3 text-xs text-sanad-emerald-900/80 dark:border-white/10 dark:bg-white/5 dark:text-sanad-beige-100/80"
                  >
                    <Avatar name={person} size="sm" />
                    {person}
                  </span>
                ))}
                <Badge tone="beige">+{Math.max(event.going - roster.length, 0)}</Badge>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.06}>
            <GlassCard>
              <h2 className="mb-3 text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                {t("events.location")}
              </h2>
              <GlassMap
                lat={event.lat}
                lng={event.lng}
                label={`${pick(event.venueEn, event.venueAr)} · ${emirate ? pick(emirate.en, emirate.ar) : ""}`}
              />
            </GlassCard>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="lg:sticky lg:top-24">
            <GlassCard>
              <div className="flex items-center justify-between">
                <Badge tone={event.free ? "emerald" : "gold"} icon={<Ticket aria-hidden="true" className="size-3.5" />}>
                  {event.free ? t("common.free") : formatAed(event.priceAed ?? 0, locale)}
                </Badge>
                <span className="inline-flex items-center gap-1.5 text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                  <Users aria-hidden="true" className="size-3.5" />
                  {event.going} {t("common.going")}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                {formatDate(event.startsAt, locale, "EEEE d MMMM")} · {formatTime(event.startsAt, locale)}
              </p>
              <p className="mt-1 text-sm text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                {pick(event.venueEn, event.venueAr)}
              </p>

              {attending ? (
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 rounded-xl bg-sanad-emerald-900/10 px-3 py-2.5 text-sm font-medium text-sanad-emerald-900 dark:bg-white/10 dark:text-sanad-gold-300">
                    <CalendarCheck aria-hidden="true" className="size-4" />
                    {t("events.rsvpGoing")}
                  </div>
                  <GlassButton
                    variant="ghost"
                    className="w-full"
                    onClick={() => toggleAttending(event.id)}
                  >
                    {t("events.cancelRsvp")}
                  </GlassButton>
                </div>
              ) : (
                <GlassButton
                  size="lg"
                  className="mt-5 w-full"
                  onClick={() => {
                    if (full) {
                      setWaitlisted(true);
                      return;
                    }
                    toggleAttending(event.id);
                  }}
                >
                  {full ? t("events.waitlist") : t("events.rsvp")}
                </GlassButton>
              )}

              {waitlisted ? (
                <p className="mt-3 flex items-center gap-2 rounded-xl bg-sanad-gold-400/15 px-3 py-2 text-xs font-medium text-sanad-gold-500 dark:text-sanad-gold-300">
                  <CalendarCheck aria-hidden="true" className="size-3.5" />
                  {t("events.waitlisted")}
                </p>
              ) : null}

              <p className="mt-4 text-xs leading-relaxed text-sanad-emerald-900/50 dark:text-sanad-beige-100/50">
                {t("verify.hashNote")}
              </p>
            </GlassCard>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
