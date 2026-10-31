"use client";

import { useMemo, useState } from "react";
import { Landmark } from "lucide-react";
import { CultureCard } from "@/components/app/Cards";
import { PageHeader } from "@/components/app/PageHeader";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, GlassCard } from "@/components/ui/glass";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { cultureItems } from "@/lib/data";
import { cn } from "@/lib/utils";

type Filter = "all" | "heritage" | "workshop";

export default function CulturePage() {
  const { t } = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? cultureItems : cultureItems.filter((item) => item.type === filter)),
    [filter],
  );

  const options: { key: Filter; label: string }[] = [
    { key: "all", label: t("common.allCategories") },
    { key: "heritage", label: t("culture.heritage") },
    { key: "workshop", label: t("culture.workshop") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("nav.culture")}
        title={t("culture.title")}
        subtitle={t("culture.subtitle")}
        action={
          <Badge tone="gold" icon={<Landmark aria-hidden="true" className="size-3.5" />}>
            {cultureItems.length} {t("common.results")}
          </Badge>
        }
      />

      <GlassCard className="mb-6 p-4">
        <div role="group" aria-label={t("common.filter")} className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              aria-pressed={filter === option.key}
              className={cn(
                "min-h-11 rounded-full px-4 text-sm font-medium transition-all duration-300",
                filter === option.key
                  ? "bg-sanad-emerald-900 text-sanad-beige-50 shadow-sm"
                  : "border border-sanad-emerald-900/15 text-sanad-emerald-900/75 hover:bg-sanad-emerald-900/5 dark:border-white/15 dark:text-sanad-beige-100/75 dark:hover:bg-white/5",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </GlassCard>

      <StaggerGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <StaggerItem key={item.id}>
            <CultureCard item={item} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
