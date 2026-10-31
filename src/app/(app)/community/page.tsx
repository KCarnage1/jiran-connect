"use client";

import { useMemo, useState } from "react";
import { Compass, Search, SlidersHorizontal, X } from "lucide-react";
import { CommunityCard } from "@/components/app/Cards";
import { PageHeader } from "@/components/app/PageHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, GlassCard, inputClass } from "@/components/ui/glass";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { CATEGORIES, EMIRATES, communities, type CategoryKey, type EmirateKey } from "@/lib/data";

export default function CommunityPage() {
  const { t, pick } = useLocale();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [emirate, setEmirate] = useState<EmirateKey | "all">("all");
  const [category, setCategory] = useState<CategoryKey | "all">("all");

  const filtered = useMemo(() => {
    return communities.filter((community) => {
      const haystack = `${community.nameEn} ${community.nameAr} ${community.descEn} ${community.descAr} ${community.tags.join(" ")}`.toLowerCase();
      const matchesQuery = query.trim().length === 0 || haystack.includes(query.trim().toLowerCase());
      const matchesEmirate = emirate === "all" || community.emirate === emirate;
      const matchesCategory = category === "all" || community.category === category;
      const visible = !community.verifiedOnly || user?.verified !== false;
      return matchesQuery && matchesEmirate && matchesCategory && visible;
    });
  }, [query, emirate, category, user?.verified]);

  const hasFilters = query.length > 0 || emirate !== "all" || category !== "all";

  return (
    <div>
      <PageHeader
        eyebrow={t("nav.findCommunity")}
        title={t("community.title")}
        subtitle={t("community.subtitle")}
        action={
          <Badge tone="gold" icon={<Compass aria-hidden="true" className="size-3.5" />}>
            {filtered.length} {t("community.groups")}
          </Badge>
        }
      />

      <GlassCard className="mb-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-sanad-emerald-900/40 dark:text-sanad-beige-100/40" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("common.searchPlaceholder")}
              aria-label={t("common.search")}
              className={`${inputClass} ps-10`}
            />
          </div>
          <label className="sr-only" htmlFor="emirate-filter">
            {t("common.allEmirates")}
          </label>
          <select
            id="emirate-filter"
            value={emirate}
            onChange={(event) => setEmirate(event.target.value as EmirateKey | "all")}
            className={`${inputClass} md:w-48`}
          >
            <option value="all">{t("common.allEmirates")}</option>
            {EMIRATES.map((item) => (
              <option key={item.key} value={item.key}>
                {pick(item.en, item.ar)}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="category-filter">
            {t("common.allCategories")}
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value as CategoryKey | "all")}
            className={`${inputClass} md:w-48`}
          >
            <option value="all">{t("common.allCategories")}</option>
            {CATEGORIES.map((item) => (
              <option key={item.key} value={item.key}>
                {pick(item.en, item.ar)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <p className="inline-flex items-center gap-1.5 text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
            <SlidersHorizontal aria-hidden="true" className="size-3.5" />
            {t("common.showing")} {filtered.length} {t("common.of")} {communities.length}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setEmirate("all");
                setCategory("all");
              }}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 font-medium text-sanad-emerald-900 hover:bg-black/5 dark:text-sanad-beige-100 dark:hover:bg-white/10"
            >
              <X aria-hidden="true" className="size-3.5" />
              {t("common.clear")}
            </button>
          ) : null}
        </div>
      </GlassCard>

      {filtered.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <p className="text-base font-medium text-sanad-emerald-950 dark:text-sanad-beige-50">
            {t("common.none")}
          </p>
          <p className="mt-1 text-sm text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
            {t("community.privacyNote")}
          </p>
        </GlassCard>
      ) : (
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((community) => (
            <StaggerItem key={community.id}>
              <CommunityCard community={community} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
