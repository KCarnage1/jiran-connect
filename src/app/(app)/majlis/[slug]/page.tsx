import type { Metadata } from "next";
import { communities, getCommunity } from "@/lib/data";
import MajlisDetail from "./Detail";

// Dynamic params are validated by the segment above, which opts into blocking.
export const instant = false;

export function generateStaticParams() {
  return communities.map((community) => ({ slug: community.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const community = getCommunity(slug);
  return { title: community ? community.nameEn : "Majlis" };
}

export default async function MajlisPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <MajlisDetail slug={slug} />;
}
