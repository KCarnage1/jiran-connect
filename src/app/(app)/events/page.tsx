"use client";

import { useMemo, useState } from "react";
import { isSameDay } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import { EventCard } from "@/components/app/Cards";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCalendar } from "@/components/calendar/GlassCalendar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, GlassCard } from "@/components/ui/glass";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { events } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default function EventsPage() {
  const { t, locale } = useLocale();
  const [selected, setSelected] = useState<Date | undefined>();

  const eventDates = useMemo(() => events.map((event) => event.startsAt), []);
  const filtered = useMemo(
    () => (selected ? events.filter((event) => isSameDay(new Date(event.startsAt), selected)) : events),
    [selected],
  );

  return (
    <div>
      <PageHeader
        eyebrow={t("nav.events")}
        title={t("events.title")}
        subtitle={t("events.subtitle")}
        action={
          <Badge tone="gold" icon={<CalendarDays aria-hidden="true" className="size-3.5" />}>
            {events.length} {t("common.results")}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <GlassCard>
            <p className="mb-3 text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
              {t("events.pickDate")}
            </p>
            <GlassCalendar
              selected={selected}
              onSelect={setSelected}
              eventDates={eventDates}
            />
            {selected ? (
              <button
                type="button"
                onClick={() => setSelected(undefined)}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-sanad-emerald-900/10 text-sm font-medium text-sanad-emerald-900 hover:bg-sanad-emerald-900/5 dark:border-white/10 dark:text-sanad-beige-100 dark:hover:bg-white/5"
              >
                <X aria-hidden="true" className="size-4" />
                {t("events.allDates")}
              </button>
            ) : null}
          </GlassCard>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-sanad-emerald-900/65 dark:text-sanad-beige-100/65">
              {selected
                ? formatDate(selected.toISOString(), locale, "EEEE d MMMM")
                : t("events.allDates")}
            </p>
            <span className="text-xs text-sanad-emerald-900/45 dark:text-sanad-beige-100/45">
              {filtered.length} {t("common.results")}
            </span>
          </div>

          {filtered.length === 0 ? (
            <GlassCard className="py-12 text-center text-sm text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
              {t("events.noDate")}
            </GlassCard>
          ) : (
            <StaggerGroup className="grid gap-5 sm:grid-cols-2">
              {filtered.map((event) => (
                <StaggerItem key={event.id}>
                  <EventCard event={event} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </div>
    </div>
  );
}
