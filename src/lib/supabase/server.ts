import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Server client for Server Components, Route Handlers and Server Actions.
 * Auth cookies are refreshed through the RLS-respecting anon key.
 */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot set cookies; middleware handles refresh.
        }
      },
    },
  });
}
