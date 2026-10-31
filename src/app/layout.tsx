import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Fraunces, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { LOCALE_COOKIE, SESSION_COOKIE, THEME_COOKIE, type Locale } from "@/lib/i18n/dictionary";
import { parseSessionCookie } from "@/lib/auth-types";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sanad · Jiran Connect — مجتمعك أقرب مما تتخيل",
    template: "%s · Sanad",
  },
  description:
    "A privacy-first UAE community platform connecting locals and newcomers through verified majlis, real gatherings and cultural exchange.",
  applicationName: "Sanad · Jiran Connect",
  keywords: ["UAE", "community", "majlis", "newcomers", "cultural exchange", "Dubai", "Abu Dhabi"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5dc" },
    { media: "(prefers-color-scheme: dark)", color: "#041f17" },
  ],
};

// The locale comes from a cookie so the server and the first client render agree
// (no RTL/LTR hydration mismatch). That makes this segment request-rendered.
export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale: Locale = cookieStore.get(LOCALE_COOKIE)?.value === "en" ? "en" : "ar";
  const theme = cookieStore.get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";
  const initialUser = parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${theme === "dark" ? "dark" : ""} ${inter.variable} ${arabic.variable} ${display.variable} h-full`.trim()}
    >
      <body className="min-h-full flex flex-col bg-sanad-beige-50 text-sanad-ink dark:bg-sanad-emerald-950 dark:text-sanad-beige-100">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-50 focus:rounded-xl focus:bg-sanad-emerald-900 focus:px-4 focus:py-3 focus:text-sanad-beige-50"
        >
          Skip to content
        </a>
        <AppProviders initialLocale={locale} initialTheme={theme} initialUser={initialUser}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
