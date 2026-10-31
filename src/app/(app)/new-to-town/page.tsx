"use client";

import { ArrowRight, BookOpen, Bus, CheckCircle2, GraduationCap, HeartPulse, IdCard, Users } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, GlassCard, GlassLink } from "@/components/ui/glass";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

export default function NewToTownPage() {
  const { t } = useLocale();

  const weeks = [
    { title: "newcomer.w1.title", desc: "newcomer.w1.desc" },
    { title: "newcomer.w2.title", desc: "newcomer.w2.desc" },
    { title: "newcomer.w3.title", desc: "newcomer.w3.desc" },
    { title: "newcomer.w4.title", desc: "newcomer.w4.desc" },
  ] as const;

  const resources = [
    { icon: IdCard, title: "newcomer.r1", desc: "newcomer.r1d" },
    { icon: GraduationCap, title: "newcomer.r2", desc: "newcomer.r2d" },
    { icon: HeartPulse, title: "newcomer.r3", desc: "newcomer.r3d" },
    { icon: Bus, title: "newcomer.r4", desc: "newcomer.r4d" },
  ] as const;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t("nav.newToTown")}
        title={t("newcomer.title")}
        subtitle={t("newcomer.subtitle")}
        action={
          <Badge tone="gold" icon={<BookOpen aria-hidden="true" className="size-3.5" />}>
            {t("newcomer.checklist")}
          </Badge>
        }
      />

      <section aria-labelledby="playbook">
        <h2 id="playbook" className="mb-4 text-xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
          {t("newcomer.checklist")}
        </h2>
        <StaggerGroup className="grid gap-4 md:grid-cols-2">
          {weeks.map((week, index) => (
            <StaggerItem key={week.title}>
              <GlassCard interactive className="h-full">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sanad-emerald-900 font-display text-lg font-bold text-sanad-gold-300">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                      {t(week.title)}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                      {t(week.desc)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section aria-labelledby="essentials">
        <h2 id="essentials" className="mb-4 text-xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
          {t("newcomer.resources")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Reveal key={resource.title}>
                <GlassCard interactive className="flex h-full items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sanad-emerald-900/10 text-sanad-emerald-900 dark:bg-white/10 dark:text-sanad-gold-300">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                      {t(resource.title)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                      {t(resource.desc)}
                    </p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-sanad-gold-500 dark:text-sanad-gold-300">
                      <CheckCircle2 aria-hidden="true" className="size-3.5" />
                      {t("common.readMore")}
                    </p>
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Reveal>
        <GlassCard className="flex flex-col gap-5 bg-sanad-emerald-900 text-sanad-beige-50 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sanad-gold-400/20 text-sanad-gold-300">
              <Users aria-hidden="true" className="size-6" />
            </span>
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold tracking-tight">{t("newcomer.mentorTitle")}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-sanad-beige-100/70">
                {t("newcomer.mentorDesc")}
              </p>
            </div>
          </div>
          <GlassLink href="/community" variant="gold" size="md" className="w-fit shrink-0">
            {t("newcomer.mentorCta")}
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </GlassLink>
        </GlassCard>
      </Reveal>
    </div>
  );
}
