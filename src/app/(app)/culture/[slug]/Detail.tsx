"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CalendarDays, Check, Clock, GraduationCap, Send, Users } from "lucide-react";
import { GlassEditor } from "@/components/editor/GlassEditor";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Avatar, Badge, GlassButton, GlassCard, Progress } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/Reveal";
import { getCulture } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default function CultureDetail({ slug }: { slug: string }) {
  const { t, pick, locale } = useLocale();
  const item = getCulture(slug);
  const [published, setPublished] = useState(false);
  const [story, setStory] = useState("");

  if (!item) {
    return (
      <GlassCard className="py-16 text-center">
        <p className="text-base font-medium text-sanad-emerald-950 dark:text-sanad-beige-50">
          {t("common.none")}
        </p>
        <Link href="/culture" className="mt-3 inline-block text-sm font-medium text-sanad-gold-500">
          {t("common.back")}
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/culture"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-sanad-emerald-900/70 hover:text-sanad-emerald-950 dark:text-sanad-beige-100/70 dark:hover:text-sanad-beige-50"
      >
        <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        {t("nav.culture")}
      </Link>

      <Reveal>
        <GlassCard padded={false} className="overflow-hidden">
          <div className={`relative h-44 bg-gradient-to-br ${item.accent} md:h-56`}>
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
            <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
              <Badge className="border border-white/20 bg-white/15 text-white backdrop-blur-md">
                {item.type === "heritage" ? t("culture.heritage") : t("culture.workshop")}
              </Badge>
              <Badge className="border border-white/20 bg-white/15 text-white backdrop-blur-md">
                {pick(item.levelEn, item.levelAr)}
              </Badge>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-sanad-emerald-950 md:text-4xl dark:text-sanad-beige-50">
              {pick(item.titleEn, item.titleAr)}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
              {pick(item.descEn, item.descAr)}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sanad-emerald-900/65 dark:text-sanad-beige-100/65">
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden="true" className="size-4" />
                {pick(item.durationEn, item.durationAr)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap aria-hidden="true" className="size-4" />
                {pick(item.levelEn, item.levelAr)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" className="size-4" />
                {formatDate(item.startsAt, locale, "EEEE d MMMM")}
              </span>
            </div>
          </div>
        </GlassCard>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <GlassCard className="h-full">
            <h2 className="text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("majlis.rules")}
            </h2>
            <ul className="mt-4 space-y-3">
              {item.lessons.map((lesson, index) => (
                <li key={lesson.en} className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sanad-gold-400/20 text-xs font-bold text-sanad-gold-500 dark:text-sanad-gold-300">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-sanad-emerald-900/80 dark:text-sanad-beige-100/80">
                    {pick(lesson.en, lesson.ar)}
                  </p>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("culture.shareTitle")}
            </h2>
            <p className="mt-1 text-sm text-sanad-emerald-900/65 dark:text-sanad-beige-100/65">
              {t("culture.shareDesc")}
            </p>
            <div className="mt-3">
              <GlassEditor
                placeholder={t("culture.shareDesc")}
                onChange={setStory}
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <GlassButton
                onClick={() => setPublished(true)}
                disabled={story.replace(/<[^>]*>/g, "").trim().length === 0 && !published}
              >
                <Send aria-hidden="true" className="size-4 rtl:rotate-180" />
                {t("culture.post")}
              </GlassButton>
              {published ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-sanad-emerald-800 dark:text-sanad-gold-300">
                  <Check aria-hidden="true" className="size-4" />
                  {t("culture.published")}
                </span>
              ) : null}
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.06}>
          <GlassCard className="h-full">
            <h2 className="text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("culture.ledBy")}
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={pick(item.hostEn, item.hostAr)} size="lg" />
              <div>
                <p className="text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                  {pick(item.hostEn, item.hostAr)}
                </p>
                <p className="text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                  {t("common.host")}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                <span className="inline-flex items-center gap-1.5">
                  <Users aria-hidden="true" className="size-3.5" />
                  {item.going} / {item.capacity}
                </span>
                <span>{t("events.spotsLeft")}</span>
              </div>
              <Progress value={item.going} max={item.capacity} />
            </div>

            <GlassButton size="lg" className="mt-6 w-full">
              {t("events.rsvp")}
            </GlassButton>
          </GlassCard>
        </Reveal>
      </div>
    </div>
  );
}
