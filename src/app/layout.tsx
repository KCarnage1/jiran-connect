import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { type Locale } from "@/lib/i18n/dictionary";

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

// The document is prerendered with the Arabic/light defaults so it can be exported
// statically. The providers read the real locale, theme and session cookies on the
// client and update <html> after hydration, so saved preferences still apply.
export default function RootLayout({ children }: LayoutProps<"/">) {
  const locale: Locale = "ar";
  const theme = "light" as "light" | "dark";
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
        <AppProviders initialLocale={locale} initialTheme={theme} initialUser={null}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
