import type { Metadata } from "next";
import LegalDetail from "./Detail";

const slugs = ["privacy", "terms", "cookies"] as const;

// Dynamic params are validated by the segment above, which opts into blocking.
export const instant = false;

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const titles: Record<string, string> = {
    privacy: "Privacy notice",
    terms: "Community terms",
    cookies: "Cookies",
  };
  return { title: titles[slug] ?? "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegalDetail slug={slug} />;
}
