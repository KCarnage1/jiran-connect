import type { Metadata } from "next";
import { events, getEvent } from "@/lib/data";
import EventDetail from "./Detail";

// Dynamic params are validated by the segment above, which opts into blocking.
export const instant = false;

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  return { title: event ? event.titleEn : "Event" };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EventDetail slug={slug} />;
}
