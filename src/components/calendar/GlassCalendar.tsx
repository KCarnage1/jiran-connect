"use client";

import { DayPicker } from "react-day-picker";
import { ar, enUS } from "react-day-picker/locale";
import { isSameDay } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * GlassCalendar — every react-day-picker class is replaced with a Tailwind
 * mapping. The library's stylesheet is never imported.
 */
export function GlassCalendar({
  selected,
  onSelect,
  eventDates = [],
  className,
}: {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  eventDates?: string[];
  className?: string;
}) {
  const { locale } = useLocale();
  const eventDays = eventDates.map((iso) => new Date(iso));

  return (
    <div className={cn("rounded-2xl", className)}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        locale={locale === "ar" ? ar : enUS}
        dir={locale === "ar" ? "rtl" : "ltr"}
        defaultMonth={eventDays[0] ?? new Date()}
        showOutsideDays
        modifiers={{ hasEvent: eventDays }}
        modifiersClassNames={{
          hasEvent:
            "[&_button]:relative [&_button]:after:absolute [&_button]:after:bottom-1 [&_button]:after:start-1/2 [&_button]:after:size-1 [&_button]:after:-translate-x-1/2 [&_button]:after:rounded-full [&_button]:after:bg-sanad-gold-400",
        }}
        classNames={{
          root: "w-full",
          months: "w-full",
          month: "w-full",
          month_caption: "relative flex items-center justify-center px-14 pb-3 pt-1",
          caption_label: "text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50",
          nav: "absolute inset-x-0 top-0 flex items-center justify-between",
          button_previous:
            "inline-flex size-11 items-center justify-center rounded-xl border border-sanad-emerald-900/10 bg-white/70 text-sanad-emerald-900 transition-all duration-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-sanad-beige-100",
          button_next:
            "inline-flex size-11 items-center justify-center rounded-xl border border-sanad-emerald-900/10 bg-white/70 text-sanad-emerald-900 transition-all duration-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-sanad-beige-100",
          chevron: "size-5 fill-current",
          month_grid: "w-full border-separate border-spacing-1",
          weekdays: "",
          weekday:
            "pb-1 text-[11px] font-medium uppercase tracking-wide text-sanad-emerald-900/45 dark:text-sanad-beige-100/45",
          week: "",
          day: "p-0 text-center align-middle",
          day_button:
            "mx-auto flex size-11 items-center justify-center rounded-xl text-sm text-sanad-emerald-950 transition-all duration-200 hover:bg-sanad-emerald-900/5 dark:text-sanad-beige-100 dark:hover:bg-white/10",
          selected:
            "[&_button]:bg-sanad-emerald-900 [&_button]:font-semibold [&_button]:text-sanad-beige-50 [&_button]:shadow-md dark:[&_button]:bg-sanad-gold-400 dark:[&_button]:text-sanad-emerald-950",
          today:
            "[&_button]:ring-2 [&_button]:ring-sanad-gold-400/70 [&_button]:ring-inset",
          outside: "[&_button]:text-sanad-emerald-900/25 dark:[&_button]:text-sanad-beige-100/25",
          disabled: "[&_button]:opacity-40",
          hidden: "invisible",
        }}
      />

      <div className="mt-3 flex items-center justify-center gap-4 border-t border-sanad-emerald-900/10 pt-3 text-[11px] text-sanad-emerald-900/55 dark:border-white/10 dark:text-sanad-beige-100/55">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-sanad-gold-400" />
          {locale === "ar" ? "يوم فعالية" : "Event day"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full ring-2 ring-sanad-gold-400" />
          {locale === "ar" ? "اليوم" : "Today"}
        </span>
      </div>
    </div>
  );
}

export function hasEventOn(date: Date, dates: string[]) {
  return dates.some((iso) => isSameDay(new Date(iso), date));
}
