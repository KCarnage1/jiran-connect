import { Suspense, type ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";

// The authenticated shell reads the URL (usePathname) for active navigation and
// client-only libraries (Leaflet, Tiptap) bail out of SSR, so the bailing
// subtrees sit inside a Suspense boundary and the shell stays prerenderable.

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
