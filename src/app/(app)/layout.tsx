import { Suspense, type ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";

// The authenticated shell reads the URL (usePathname) for active navigation and
// client-only libraries (Leaflet, Tiptap) bail out of SSR. This segment renders
// as a blocking route, with a Suspense boundary for the bailing subtrees.
export const instant = false;

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <span
              role="status"
              aria-live="polite"
              className="size-6 animate-spin rounded-full border-2 border-sanad-emerald-900/20 border-t-sanad-gold-400"
            />
          </div>
        }
      >
        {children}
      </Suspense>
    </AppShell>
  );
}
