import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * The canonical SANAD glass recipe. Keep in sync with .cursorrules.
 * Components should spread this instead of retyping the string.
 */
export const GLASS =
  "bg-white/80 dark:bg-emerald-950/70 backdrop-blur-xl border border-white/30 dark:border-emerald-800/40 shadow-lg rounded-2xl";

/** Glass + the standard hover lift. */
export const GLASS_INTERACTIVE =
  `${GLASS} hover:-translate-y-1 hover:shadow-xl transition-all duration-300`;
