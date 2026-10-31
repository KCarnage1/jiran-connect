import type { EmirateKey } from "@/lib/data";

export type UserRole = "member" | "moderator" | "admin";

/** What the schema stores for a verification — never the Emirates ID itself. */
export interface StoredVerification {
  recordId: string;
  idHash: string;
  status: string;
  requestedAt: string;
  verifiedAt?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  nameEn: string;
  nameAr: string;
  emirate: EmirateKey;
  role: UserRole;
  verified: boolean;
  bio: string;
  interests: string[];
  languages: string[];
  joinedMajlis: string[];
  attending: string[];
  verification?: StoredVerification;
}

/**
 * Demo session. In production this comes from `supabase.auth.getUser()` plus the
 * `profiles` row; the shape is deliberately identical so the swap is local.
 */
export const DEMO_USER: SessionUser = {
  id: "u1",
  email: "layla@example.ae",
  nameEn: "Layla Al Mansoori",
  nameAr: "ليلى المنصوري",
  emirate: "dubai",
  role: "admin",
  verified: false,
  bio: "New to Al Barsha, learning Arabic, happiest around a table with too much coffee.",
  interests: ["Families", "Heritage", "Calligraphy", "Walking"],
  languages: ["English", "Arabic", "French"],
  joinedMajlis: ["al-barsha-families", "newcomers-dubai"],
  attending: ["e1", "e8"],
};

/** Parse a session cookie value. `undefined` means "no cookie" (use the demo). */
export function parseSessionCookie(raw: string | undefined): SessionUser | null | undefined {
  if (raw === undefined || raw === "") return undefined;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as SessionUser | null;
    if (parsed === null) return null;
    if (typeof parsed !== "object" || typeof parsed.id !== "string") return DEMO_USER;
    return parsed;
  } catch {
    return DEMO_USER;
  }
}
