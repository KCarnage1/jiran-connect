"use client";

import Link from "next/link";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn, GLASS } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                    */
/* -------------------------------------------------------------------------- */

export function GlassCard({
  className,
  interactive = false,
  padded = true,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        GLASS,
        padded && "p-6 md:p-8",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                     */
/* -------------------------------------------------------------------------- */

type Variant = "primary" | "gold" | "glass" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-tight transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sanad-gold-400 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-sanad-emerald-900 text-sanad-beige-50 shadow-sm hover:bg-sanad-emerald-800 hover:-translate-y-0.5 hover:shadow-lg dark:bg-sanad-gold-400 dark:text-sanad-emerald-950 dark:hover:bg-sanad-gold-300",
  gold: "bg-sanad-gold-400 text-sanad-emerald-950 shadow-sm hover:bg-sanad-gold-300 hover:-translate-y-0.5 hover:shadow-lg",
  glass: cn(GLASS, "hover:-translate-y-0.5 hover:shadow-xl"),
  ghost:
    "text-sanad-emerald-900 hover:bg-sanad-emerald-900/5 dark:text-sanad-beige-100 dark:hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-3.5 text-sm",
  md: "min-h-11 px-5 text-sm md:text-base",
  lg: "min-h-12 px-6 text-base",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function GlassButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button type="button" className={buttonStyles(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function GlassLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link href={href} className={buttonStyles(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Badges & metadata                                                           */
/* -------------------------------------------------------------------------- */

export function Badge({
  children,
  tone = "emerald",
  className,
  icon,
}: {
  children: ReactNode;
  tone?: "emerald" | "gold" | "beige" | "danger";
  className?: string;
  icon?: ReactNode;
}) {
  const tones = {
    emerald:
      "bg-sanad-emerald-900/10 text-sanad-emerald-900 dark:bg-sanad-emerald-100/10 dark:text-sanad-emerald-100",
    gold: "bg-sanad-gold-400/20 text-sanad-gold-500 dark:text-sanad-gold-300",
    beige: "bg-sanad-beige-100 text-sanad-emerald-900 dark:bg-white/10 dark:text-sanad-beige-100",
    danger: "bg-red-500/10 text-red-700 dark:text-red-300",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function VerifiedBadge({ verified, label }: { verified: boolean; label: string }) {
  if (!verified) return <Badge tone="beige">{label}</Badge>;
  return (
    <Badge tone="gold" icon={<Check aria-hidden="true" className="size-3.5" strokeWidth={3} />}>
      {label}
    </Badge>
  );
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                      */
/* -------------------------------------------------------------------------- */

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "size-9 text-xs", md: "size-11 text-sm", lg: "size-16 text-lg" };
  const label = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sanad-emerald-800 to-sanad-emerald-600 font-semibold text-sanad-beige-50 ring-1 ring-white/30 dark:ring-white/10",
        sizes[size],
        className,
      )}
    >
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout helpers                                                              */
/* -------------------------------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sanad-gold-500 dark:text-sanad-gold-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-bold tracking-tight text-sanad-emerald-950 md:text-3xl dark:text-sanad-beige-50">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-base leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Progress({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className="h-1.5 w-full overflow-hidden rounded-full bg-sanad-emerald-900/10 dark:bg-white/10"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-sanad-emerald-700 to-sanad-gold-400 transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form fields                                                                 */
/* -------------------------------------------------------------------------- */

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-sanad-emerald-950 dark:text-sanad-beige-100"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs font-medium text-red-700 dark:text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-sanad-emerald-900/15 bg-white/70 px-4 py-3 text-base text-sanad-emerald-950 placeholder:text-sanad-emerald-900/40 transition-all duration-300 focus:border-sanad-gold-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sanad-gold-400/30 dark:border-white/15 dark:bg-white/5 dark:text-sanad-beige-50 dark:placeholder:text-sanad-beige-100/40 dark:focus:bg-white/10";

export function TextInput({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cn(inputClass, className)} {...rest} />;
}
