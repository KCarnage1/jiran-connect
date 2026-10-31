"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-sanad-emerald-900/5">
      <MapPin aria-hidden="true" className="size-6 animate-pulse text-sanad-emerald-900/40" />
    </div>
  ),
});

/** GlassMap — Leaflet wrapped in the Sanad glass shell, never raw tiles. */
export function GlassMap({
  lat,
  lng,
  label,
  className,
  height = 260,
}: {
  lat: number;
  lng: number;
  label: string;
  className?: string;
  height?: number;
}) {
  const { t } = useLocale();
  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-1.5 shadow-glass backdrop-blur-xl dark:border-emerald-800/40 dark:bg-emerald-950/60", className)}>
      <div className="overflow-hidden rounded-xl" style={{ height }}>
        <MapInner lat={lat} lng={lng} label={label} />
      </div>
      <figcaption className="flex items-center gap-2 px-2 pt-2 pb-1 text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
        <MapPin aria-hidden="true" className="size-3.5 text-sanad-gold-500" />
        {label}
        <span className="ms-auto">{t("events.mapHint")}</span>
      </figcaption>
    </figure>
  );
}
