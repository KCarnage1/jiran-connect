"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { CommunityCard } from "@/components/app/Cards";
import { PageHeader } from "@/components/app/PageHeader";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, GlassCard } from "@/components/ui/glass";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { CATEGORIES, communities, type CategoryKey } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function MajlisPage() {
  const { t, pick } = useLocale();
  const [category, setCategory] = useState<CategoryKey | "all">("all");

  const filtered = useMemo(
    () => (category === "all" ? communities : communities.filter((item) => item.category === category)),
    [category],
  );

  return (
    <div>
      <PageHeader
        eyebrow={t("nav.majlis")}
        title={t("majlis.title")}
        subtitle={t("majlis.subtitle")}
        action={
          <Badge tone="gold" icon={<Users aria-hidden="true" className="size-3.5" />}>
            {communities.length} {t("community.groups")}
          </Badge>
        }
      />

      <GlassCard className="mb-6 p-4">
        <div role="group" aria-label={t("common.filter")} className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
            className={cn(
              "min-h-11 rounded-full px-4 text-sm font-medium transition-all duration-300",
              category === "all"
                ? "bg-sanad-emerald-900 text-sanad-beige-50 shadow-sm"
                : "border border-sanad-emerald-900/15 text-sanad-emerald-900/75 hover:bg-sanad-emerald-900/5 dark:border-white/15 dark:text-sanad-beige-100/75 dark:hover:bg-white/5",
            )}
          >
            {t("common.allCategories")}
          </button>
          {CATEGORIES.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setCategory(item.key)}
              aria-pressed={category === item.key}
              className={cn(
                "min-h-11 rounded-full px-4 text-sm font-medium transition-all duration-300",
                category === item.key
                  ? "bg-sanad-emerald-900 text-sanad-beige-50 shadow-sm"
                  : "border border-sanad-emerald-900/15 text-sanad-emerald-900/75 hover:bg-sanad-emerald-900/5 dark:border-white/15 dark:text-sanad-beige-100/75 dark:hover:bg-white/5",
              )}
            >
              {pick(item.en, item.ar)}
            </button>
          ))}
        </div>
      </GlassCard>

      <StaggerGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((community) => (
          <StaggerItem key={community.id}>
            <CommunityCard community={community} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      {filtered.length === 0 ? (
        <GlassCard className="py-12 text-center text-sm text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
          {t("common.none")}
        </GlassCard>
      ) : null}
    </div>
  );
}
