"use client";

import Link from "next/link";
import { ArrowLeft, ScrollText } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, GlassCard } from "@/components/ui/glass";

const content = {
  privacy: {
    titleEn: "Privacy notice",
    titleAr: "سياسة الخصوصية",
    sections: [
      {
        en: "What we store for verification: a salted SHA-256 hash of your Emirates ID, its status, and two timestamps. The ID itself never reaches a database, a log or an analytics tool.",
        ar: "ما نحفظه للتوثيق: بصمة SHA-256 مع مفتاح سري لرقم هويتك، وحالتها، وتاريخان زمنيان. رقم الهوية نفسه لا يصل إلى قاعدة بيانات ولا سجل ولا أداة تحليلات.",
      },
      {
        en: "Every table runs with Row-Level Security. Reads and writes are denied unless a policy explicitly allows them, and staff powers are checked in the database — not in the browser.",
        ar: "كل جدول محمي بسياسات أمان على مستوى الصف. القراءة والكتابة ممنوعة إلا بسياسة تسمح بها، وصلاحيات فريق الإشراف تُفحص في قاعدة البيانات لا في المتصفح.",
      },
      {
        en: "You can export your profile and verification metadata as JSON at any time from your profile page, and delete your account without contacting support.",
        ar: "يمكنك تصدير ملفك وبيانات التوثيق كملف JSON في أي وقت من صفحة ملفك، وحذف حسابك دون التواصل مع الدعم.",
      },
    ],
  },
  terms: {
    titleEn: "Community terms",
    titleAr: "شروط المجتمع",
    sections: [
      {
        en: "Majlis are moderated spaces. Approvals, suspensions and removals are recorded in an append-only audit log that staff cannot edit.",
        ar: "المجالس مساحات مُدارة. الاعتمادات والإيقافات والإزالات تُسجّل في سجل تدقيق غير قابل للتعديل من فريق الإشراف.",
      },
      {
        en: "Selling, recruiting and political campaigning are not allowed in majlis. Repeated violations lead to suspension of the account.",
        ar: "البيع والتوظيف والدعاية السياسية غير مسموحة داخل المجالس. التكرار يؤدي إلى إيقاف الحساب.",
      },
      {
        en: "Hosts are responsible for their gatherings: accurate venues, honest capacities and respectful conduct.",
        ar: "المضيفون مسؤولون عن لقاءاتهم: أماكن دقيقة وسعات صادقة وسلوك محترم.",
      },
    ],
  },
  cookies: {
    titleEn: "Cookies",
    titleAr: "ملفات تعريف الارتباط",
    sections: [
      {
        en: "Sanad uses a single first-party session cookie from Supabase Auth. There are no advertising cookies and no third-party trackers.",
        ar: "يستخدم سند ملف جلسة واحدًا من طرف أول عبر مصادقة Supabase. لا ملفات إعلانية ولا أدوات تتبع خارجية.",
      },
      {
        en: "Language and appearance preferences are stored locally in your browser, not on our servers.",
        ar: "تفضيلات اللغة والمظهر تُحفظ محليًا في متصفحك، وليس على خوادمنا.",
      },
    ],
  },
} as const;

type Slug = keyof typeof content;

export default function LegalDetail({ slug: rawSlug }: { slug: string }) {
  const { pick } = useLocale();
  const slug = (rawSlug as Slug) ?? "privacy";
  const page = content[slug];

  if (!page) {
    return (
      <GlassCard className="mx-auto my-16 max-w-lg text-center">
        <p className="text-sm">Not found.</p>
        <Link href="/" className="mt-2 inline-block text-sanad-gold-500">
          Home
        </Link>
      </GlassCard>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-sanad-emerald-900/70 hover:text-sanad-emerald-950 dark:text-sanad-beige-100/70"
      >
        <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        {pick("Back home", "العودة للرئيسية")}
      </Link>

      <GlassCard className="mt-4">
        <Badge tone="gold" icon={<ScrollText aria-hidden="true" className="size-3.5" />}>
          Sanad
        </Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
          {pick(page.titleEn, page.titleAr)}
        </h1>
        <div className="mt-6 space-y-4">
          {page.sections.map((section) => (
            <p
              key={section.en}
              className="text-base leading-relaxed text-sanad-emerald-900/75 dark:text-sanad-beige-100/75"
            >
              {pick(section.en, section.ar)}
            </p>
          ))}
        </div>
      </GlassCard>
    </main>
  );
}
