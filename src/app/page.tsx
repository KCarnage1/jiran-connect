import { Bento } from "@/components/landing/Bento";
import { Hero } from "@/components/landing/Hero";
import { LandingNav } from "@/components/landing/LandingNav";
import { CtaBand, HowItWorks, Platform } from "@/components/landing/Sections";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LandingNav />
      <main id="main" className="flex-1">
        <Hero />
        <Bento />
        <HowItWorks />
        <Platform />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
