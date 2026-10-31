"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createBrowserStore } from "@/lib/browser-store";
import {
  DEMO_USER,
  parseSessionCookie,
  type SessionUser,
  type StoredVerification,
  type UserRole,
} from "@/lib/auth-types";
import { SESSION_COOKIE } from "@/lib/i18n/dictionary";

export interface AuthContextValue {
  user: SessionUser | null;
  isStaff: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
  updateUser: (patch: Partial<SessionUser>) => void;
  markVerified: (verification: StoredVerification) => void;
  toggleMajlis: (slug: string) => void;
  toggleAttending: (eventId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readSessionCookie(fallback: SessionUser | null): SessionUser | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`));
  return parseSessionCookie(match?.[1]) ?? fallback;
}

function writeSessionCookie(user: SessionUser | null) {
  const value = encodeURIComponent(JSON.stringify(user));
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * The session lives in a cookie so the server can render the same user the
 * client hydrates (no personalized-content hydration mismatch). With Supabase
 * connected this becomes the auth cookie managed by `@supabase/ssr`.
 */
export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: SessionUser | null;
}) {
  const fallback = initialUser === undefined ? DEMO_USER : initialUser;

  const store = useMemo(
    () =>
      createBrowserStore<SessionUser | null>({
        read: () => readSessionCookie(fallback),
        write: writeSessionCookie,
        fallback,
      }),
    [fallback],
  );

  const user = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!email.includes("@")) return { error: "Enter a valid email address." };
      if (password.length < 6) return { error: "Password must be at least 6 characters." };
      store.set({ ...DEMO_USER, email });
      return {};
    },
    [store],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      if (name.trim().length < 2) return { error: "Enter your full name." };
      if (!email.includes("@")) return { error: "Enter a valid email address." };
      if (password.length < 6) return { error: "Password must be at least 6 characters." };
      store.set({
        ...DEMO_USER,
        id: `u-${Date.now()}`,
        email,
        nameEn: name,
        nameAr: name,
        role: "member" as UserRole,
        verified: false,
        joinedMajlis: [],
        attending: [],
        verification: undefined,
      });
      return {};
    },
    [store],
  );

  const updateUser = useCallback(
    (patch: Partial<SessionUser>) => {
      const current = store.getSnapshot();
      if (!current) return;
      store.set({ ...current, ...patch });
    },
    [store],
  );

  const toggleInList = useCallback(
    (field: "joinedMajlis" | "attending", value: string) => {
      const current = store.getSnapshot();
      if (!current) return;
      const list = current[field];
      store.set({
        ...current,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      });
    },
    [store],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isStaff: user?.role === "admin" || user?.role === "moderator",
      signIn,
      signUp,
      signOut: () => store.set(null),
      updateUser,
      markVerified: (verification) => updateUser({ verified: true, verification }),
      toggleMajlis: (slug) => toggleInList("joinedMajlis", slug),
      toggleAttending: (eventId) => toggleInList("attending", eventId),
    }),
    [user, signIn, signUp, store, updateUser, toggleInList],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
