"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeInUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Fade + rise on scroll, disabled for `prefers-reduced-motion`. */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "scale";
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const base = variant === "scale" ? scaleIn : fadeInUp;
  const withDelay: Variants = {
    hidden: base.hidden,
    show: {
      ...base.show,
      transition: {
        ...(base.show as { transition?: object }).transition,
        delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={withDelay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers direct `<StaggerItem>` children by 0.08s. */
export function StaggerGroup({
  children,
  className,
  delayChildren = 0,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div variants={fadeInUp} className={cn(className)}>
      {children}
    </motion.div>
  );
}
