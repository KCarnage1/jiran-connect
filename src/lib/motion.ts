"use client";

import type { Variants } from "framer-motion";

/** Shared stagger rhythm across every section (rule: 0.08). */
export const stagger = 0.08;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const drawer: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.99 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } },
  exit: { opacity: 0, y: 16, scale: 0.99, transition: { duration: 0.18 } },
};
