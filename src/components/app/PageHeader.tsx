"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <Reveal>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-8">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sanad-gold-500 dark:text-sanad-gold-300">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-sanad-emerald-950 md:text-4xl dark:text-sanad-beige-50">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-base leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action}
      </div>
    </Reveal>
  );
}
