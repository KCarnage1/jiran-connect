import type { Metadata } from "next";
import { cultureItems, getCulture } from "@/lib/data";
import CultureDetail from "./Detail";

// Dynamic params are validated by the segment above, which opts into blocking.
export const instant = false;

export function generateStaticParams() {
  return cultureItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getCulture(slug);
  return { title: item ? item.titleEn : "Cultural exchange" };
}

export default async function CulturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CultureDetail slug={slug} />;
}
