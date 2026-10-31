"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ClipboardList,
  ShieldAlert,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { ActivityChart } from "@/components/admin/ActivityChart";
import { PageHeader } from "@/components/app/PageHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Avatar, Badge, GlassButton, GlassCard } from "@/components/ui/glass";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import {
  categoryLabel,
  emirateLabel,
  moderationActions,
  pendingCommunities,
  people,
  reports,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const roleTone = { admin: "gold", moderator: "emerald", member: "beige" } as const;

export default function AdminPage() {
  const { t, pick } = useLocale();
  const { isStaff } = useAuth();
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});

  if (!isStaff) {
    return (
      <GlassCard className="mx-auto max-w-lg py-16 text-center">
        <ShieldAlert aria-hidden="true" className="mx-auto size-8 text-red-600" />
        <p className="mt-3 text-base font-medium text-sanad-emerald-950 dark:text-sanad-beige-50">
          {t("admin.restricted")}
        </p>
      </GlassCard>
    );
  }

  const stats = [
    { icon: Users, value: "14,200", label: t("admin.users") },
    { icon: ShieldCheck, value: "128", label: t("nav.majlis") },
    { icon: ClipboardList, value: "3,400", label: t("nav.events") },
    { icon: AlertTriangle, value: "7", label: t("admin.pendingVerifications") },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t("nav.admin")}
        title={t("admin.title")}
        subtitle={t("admin.subtitle")}
        action={
          <Badge tone="gold" icon={<ShieldCheck aria-hidden="true" className="size-3.5" />}>
            RBAC
          </Badge>
        }
      />

      {/* Bento stats */}
      <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.label}>
              <GlassCard interactive className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-xl bg-sanad-emerald-900 text-sanad-gold-300">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="font-display text-2xl font-bold text-sanad-emerald-950 dark:text-sanad-beige-50">
                    {stat.value}
                  </p>
                  <p className="text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                    {stat.label}
                  </p>
                </div>
              </GlassCard>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <GlassCard>
            <h2 className="text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("admin.activity")}
            </h2>
            <div className="mt-4">
              <ActivityChart />
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.06}>
          <GlassCard className="h-full">
            <h2 className="text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("admin.pendingVerifications")}
            </h2>
            <p className="mt-1 text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
              {t("profile.privacyDesc")}
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { name: "Marco Rossi", at: "2026-10-30 09:12" },
                { name: "Priya Nair", at: "2026-10-30 11:40" },
                { name: "Zainab Ali", at: "2026-10-29 18:03" },
              ].map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-sanad-emerald-900/10 bg-white/50 p-3 dark:border-white/10 dark:bg-white/5"
                >
                  <span className="flex items-center gap-2.5">
                    <Avatar name={item.name} size="sm" />
                    <span>
                      <span className="block text-sm font-medium text-sanad-emerald-950 dark:text-sanad-beige-50">
                        {item.name}
                      </span>
                      <span className="block font-mono text-[10px] text-sanad-emerald-900/45 dark:text-sanad-beige-100/45">
                        {item.at}
                      </span>
                    </span>
                  </span>
                  <Badge tone="beige">{t("common.pending")}</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-sanad-emerald-900/45 dark:text-sanad-beige-100/45">
              {t("verify.hashNote")}
            </p>
          </GlassCard>
        </Reveal>
      </div>

      {/* Approval queue */}
      <section aria-labelledby="queue">
        <h2 id="queue" className="mb-4 text-xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
          {t("admin.approvalQueue")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {pendingCommunities.map((item) => {
            const decision = decisions[item.id];
            const category = categoryLabel(item.category);
            const emirate = emirateLabel(item.emirate);
            return (
              <Reveal key={item.id}>
                <GlassCard interactive className="flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                        {pick(item.nameEn, item.nameAr)}
                      </h3>
                      <p className="mt-1 text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                        {pick(item.ownerEn, item.ownerAr)} · {emirate ? pick(emirate.en, emirate.ar) : ""} ·{" "}
                        {category ? pick(category.en, category.ar) : ""}
                      </p>
                    </div>
                    <Badge tone="beige">{item.members} {t("common.members")}</Badge>
                  </div>

                  {decision ? (
                    <p
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium",
                        decision === "approved"
                          ? "bg-sanad-emerald-900/10 text-sanad-emerald-800 dark:bg-white/10 dark:text-sanad-gold-300"
                          : "bg-red-500/10 text-red-700 dark:text-red-300",
                      )}
                    >
                      <CheckCircle2 aria-hidden="true" className="size-3.5" />
                      {decision === "approved" ? t("admin.approved") : t("admin.rejected")}
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <GlassButton
                        size="sm"
                        onClick={() => setDecisions((current) => ({ ...current, [item.id]: "approved" }))}
                      >
                        <Check aria-hidden="true" className="size-4" />
                        {t("admin.approve")}
                      </GlassButton>
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        className="text-red-700 hover:bg-red-500/10 dark:text-red-300"
                        onClick={() => setDecisions((current) => ({ ...current, [item.id]: "rejected" }))}
                      >
                        <X aria-hidden="true" className="size-4" />
                        {t("admin.reject")}
                      </GlassButton>
                    </div>
                  )}
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Users table */}
      <section aria-labelledby="members">
        <h2 id="members" className="mb-4 text-xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
          {t("admin.allUsers")}
        </h2>
        <GlassCard padded={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">{t("admin.users")}</caption>
              <thead>
                <tr className="border-b border-sanad-emerald-900/10 text-start text-xs uppercase tracking-[0.12em] text-sanad-emerald-900/50 dark:border-white/10 dark:text-sanad-beige-100/50">
                  <th scope="col" className="p-4 text-start font-medium">{t("common.fullName")}</th>
                  <th scope="col" className="p-4 text-start font-medium">{t("admin.role")}</th>
                  <th scope="col" className="p-4 text-start font-medium">{t("common.allEmirates")}</th>
                  <th scope="col" className="p-4 text-start font-medium">{t("admin.status")}</th>
                  <th scope="col" className="p-4 text-start font-medium">{t("admin.joined")}</th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => {
                  const emirate = emirateLabel(person.emirate);
                  return (
                    <tr
                      key={person.id}
                      className="border-b border-sanad-emerald-900/5 transition-colors last:border-0 hover:bg-sanad-emerald-900/[0.03] dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <td className="p-4">
                        <span className="flex items-center gap-3">
                          <Avatar name={pick(person.nameEn, person.nameAr)} size="sm" />
                          <span>
                            <span className="block font-medium text-sanad-emerald-950 dark:text-sanad-beige-50">
                              {pick(person.nameEn, person.nameAr)}
                            </span>
                            <span className="block text-xs text-sanad-emerald-900/50 dark:text-sanad-beige-100/50">
                              {person.email}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge tone={roleTone[person.role]}>{person.role}</Badge>
                      </td>
                      <td className="p-4 text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                        {emirate ? pick(emirate.en, emirate.ar) : person.emirate}
                      </td>
                      <td className="p-4">
                        <Badge tone={person.verified ? "gold" : "beige"}>
                          {person.verified ? t("common.verified") : t("common.unverified")}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                        {person.joined}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      {/* Moderation log + reports */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <GlassCard className="h-full">
            <h2 className="text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("admin.moderationLog")}
            </h2>
            <ol className="mt-4 space-y-3">
              {moderationActions.map((action) => (
                <li key={action.id} className="flex gap-3">
                  <span className="mt-1 flex size-2 shrink-0 rounded-full bg-sanad-gold-400" />
                  <div className="min-w-0">
                    <p className="text-sm text-sanad-emerald-950 dark:text-sanad-beige-50">
                      <span className="font-medium">{pick(action.actorEn, action.actorAr)}</span>{" "}
                      <span className="text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                        {pick(action.actionEn, action.actionAr)}
                      </span>{" "}
                      <span className="font-medium">{pick(action.targetEn, action.targetAr)}</span>
                    </p>
                    <p className="font-mono text-[10px] text-sanad-emerald-900/45 dark:text-sanad-beige-100/45">
                      {action.at}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.06}>
          <GlassCard className="h-full">
            <h2 className="text-lg font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("common.overview")}
            </h2>
            <ul className="mt-4 space-y-3">
              {reports.map((report) => (
                <li
                  key={report.id}
                  className="rounded-xl border border-sanad-emerald-900/10 bg-white/50 p-3 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-sanad-emerald-950 dark:text-sanad-beige-50">
                      {pick(report.targetEn, report.targetAr)}
                    </p>
                    <Badge tone={report.status === "open" ? "danger" : report.status === "resolved" ? "emerald" : "beige"}>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                    {pick(report.reasonEn, report.reasonAr)} · {pick(report.reporterEn, report.reporterAr)}
                  </p>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </div>
    </div>
  );
}
