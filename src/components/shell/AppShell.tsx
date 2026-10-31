"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  Compass,
  Home,
  Landmark,
  LogOut,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LocaleToggle, ThemeToggle } from "@/components/ui/Controls";
import { Avatar, Badge } from "@/components/ui/glass";
import { cn, GLASS } from "@/lib/utils";
import { AiAssistant } from "@/components/shell/AiAssistant";

const primary = [
  { href: "/home", key: "nav.home", icon: Home },
  { href: "/community", key: "nav.findCommunity", icon: Compass },
  { href: "/new-to-town", key: "nav.newToTown", icon: Sparkles },
  { href: "/majlis", key: "nav.majlis", icon: Users },
  { href: "/events", key: "nav.events", icon: CalendarDays },
  { href: "/culture", key: "nav.culture", icon: Landmark },
  { href: "/profile", key: "nav.profile", icon: User },
] as const;

const mobile = [
  { href: "/home", key: "nav.home", icon: Home },
  { href: "/community", key: "nav.findCommunity", icon: Compass },
  { href: "/events", key: "nav.events", icon: CalendarDays },
  { href: "/majlis", key: "nav.majlis", icon: Users },
  { href: "/profile", key: "nav.profile", icon: User },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isStaff, signOut } = useAuth();
  const { t, pick } = useLocale();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  const name = pick(user.nameEn, user.nameAr);

  return (
    <div className="min-h-dvh bg-sanad-beige-50 dark:bg-sanad-emerald-950">
      <div className="mx-auto flex w-full max-w-[1500px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-e border-sanad-emerald-900/10 bg-white/50 px-4 py-6 backdrop-blur-xl lg:flex dark:border-white/10 dark:bg-emerald-950/60">
          <Link href="/home" className="flex items-center gap-2.5 px-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-sanad-emerald-900 text-sanad-gold-300">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                {t("brand.name")}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-sanad-emerald-900/45 dark:text-sanad-beige-100/45">
                Jiran Connect
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="mt-8 flex flex-1 flex-col gap-1">
            {primary.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                    active
                      ? "bg-sanad-emerald-900 text-sanad-beige-50 shadow-md"
                      : "text-sanad-emerald-900/75 hover:bg-sanad-emerald-900/5 hover:text-sanad-emerald-950 dark:text-sanad-beige-100/75 dark:hover:bg-white/5 dark:hover:text-sanad-beige-50",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4.5" />
                  {t(item.key)}
                </Link>
              );
            })}

            {isStaff ? (
              <>
                <p className="mt-5 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-sanad-emerald-900/40 dark:text-sanad-beige-100/40">
                  {t("nav.admin")}
                </p>
                <Link
                  href="/admin"
                  aria-current={isActive(pathname, "/admin") ? "page" : undefined}
                  className={cn(
                    "mt-1 flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                    isActive(pathname, "/admin")
                      ? "bg-sanad-emerald-900 text-sanad-beige-50 shadow-md"
                      : "text-sanad-emerald-900/75 hover:bg-sanad-emerald-900/5 dark:text-sanad-beige-100/75 dark:hover:bg-white/5",
                  )}
                >
                  <ShieldCheck aria-hidden="true" className="size-4.5" />
                  {t("nav.admin")}
                </Link>
              </>
            ) : null}
          </nav>

          <div className={cn(GLASS, "mt-4 p-3")}>
            <div className="flex items-center gap-3">
              <Avatar name={name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                  {name}
                </p>
                <p className="truncate text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Badge tone={user.verified ? "gold" : "beige"}>
                {user.verified ? t("common.verified") : t("common.unverified")}
              </Badge>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  router.replace("/login");
                }}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-sanad-emerald-900/70 hover:bg-black/5 dark:text-sanad-beige-100/70 dark:hover:bg-white/10"
              >
                <LogOut aria-hidden="true" className="size-3.5 rtl:rotate-180" />
                {t("nav.logout")}
              </button>
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-sanad-emerald-900/10 bg-sanad-beige-50/80 backdrop-blur-xl dark:border-white/10 dark:bg-emerald-950/70">
            <div className="flex items-center gap-3 px-4 py-3 md:px-8">
              <Link href="/home" className="flex items-center gap-2 lg:hidden">
                <span className="flex size-9 items-center justify-center rounded-lg bg-sanad-emerald-900 text-sanad-gold-300">
                  <ShieldCheck aria-hidden="true" className="size-4" />
                </span>
                <span className="text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                  {t("brand.name")}
                </span>
              </Link>

              <div className="relative ms-auto hidden w-full max-w-sm md:block">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-sanad-emerald-900/40 dark:text-sanad-beige-100/40"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("common.searchPlaceholder")}
                  aria-label={t("common.search")}
                  className="w-full rounded-xl border border-sanad-emerald-900/10 bg-white/60 py-2.5 ps-10 pe-3 text-sm text-sanad-emerald-950 placeholder:text-sanad-emerald-900/40 focus:border-sanad-gold-400 focus:outline-none focus:ring-2 focus:ring-sanad-gold-400/25 dark:border-white/10 dark:bg-white/5 dark:text-sanad-beige-50 dark:placeholder:text-sanad-beige-100/40"
                />
              </div>

              <div className="ms-auto flex items-center gap-2 md:ms-0">
                <LocaleToggle />
                <ThemeToggle className="hidden sm:inline-flex" />
                <button
                  type="button"
                  aria-label={t("nav.askAi")}
                  onClick={() => window.dispatchEvent(new CustomEvent("sanad:open-ai"))}
                  className="inline-flex size-11 items-center justify-center rounded-xl border border-sanad-gold-400/30 bg-sanad-gold-400/15 text-sanad-gold-500 transition-all duration-300 hover:bg-sanad-gold-400/25 dark:text-sanad-gold-300"
                >
                  <Sparkles aria-hidden="true" className="size-4.5" />
                </button>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative inline-flex size-11 items-center justify-center rounded-xl border border-sanad-emerald-900/10 bg-white/60 text-sanad-emerald-900/70 transition-all duration-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-sanad-beige-100/70"
                >
                  <Bell aria-hidden="true" className="size-4.5" />
                  <span className="absolute end-2.5 top-2.5 size-1.5 rounded-full bg-sanad-gold-400" />
                </button>
                <Link href="/profile" aria-label={t("nav.profile")} className="hidden sm:block">
                  <Avatar name={name} size="sm" />
                </Link>
              </div>
            </div>
          </header>

          <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10 md:pt-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-sanad-emerald-900/10 bg-white/85 backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-emerald-950/85"
      >
        <div className="mx-auto grid max-w-md grid-cols-5">
          {mobile.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-300",
                  active
                    ? "text-sanad-emerald-900 dark:text-sanad-gold-300"
                    : "text-sanad-emerald-900/55 dark:text-sanad-beige-100/55",
                )}
              >
                <Icon aria-hidden="true" className={cn("size-5", active && "text-sanad-gold-500 dark:text-sanad-gold-300")} />
                {t(item.key)}
              </Link>
            );
          })}
        </div>
      </nav>

      <AiAssistant />
    </div>
  );
}
