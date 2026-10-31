"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Field, GlassButton, TextInput } from "@/components/ui/glass";

export default function LoginPage() {
  const { t } = useLocale();
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("layla@example.ae");
  const [password, setPassword] = useState("sanad123");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    const result = await signIn(email, password);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/home");
  }

  return (
    <AuthShell
      title={t("auth.loginTitle")}
      subtitle={t("auth.loginSubtitle")}
      footer={
        <p className="text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
          {t("common.noAccount")}{" "}
          <Link href="/register" className="font-semibold text-sanad-emerald-900 underline-offset-4 hover:underline dark:text-sanad-gold-300">
            {t("common.createAccount")}
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label={t("common.email")} htmlFor="email">
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.ae"
            dir="ltr"
          />
        </Field>

        <Field label={t("common.password")} htmlFor="password" error={error}>
          <div className="relative">
            <TextInput
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="pe-12"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShow((value) => !value)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute inset-y-0 end-0 inline-flex w-12 items-center justify-center text-sanad-emerald-900/50 hover:text-sanad-emerald-900 dark:text-sanad-beige-100/50"
            >
              {show ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex min-h-11 items-center gap-2 text-sm text-sanad-emerald-900/75 dark:text-sanad-beige-100/75">
            <input type="checkbox" defaultChecked className="size-4 rounded border-sanad-emerald-900/30 accent-sanad-emerald-900" />
            {t("common.rememberMe")}
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-sanad-emerald-900/75 underline-offset-4 hover:underline dark:text-sanad-beige-100/75"
          >
            {t("common.forgotPassword")}
          </Link>
        </div>

        <GlassButton type="submit" size="lg" className="w-full" disabled={pending}>
          <LogIn aria-hidden="true" className="size-4 rtl:rotate-180" />
          {pending ? t("common.loading") : t("common.signIn")}
        </GlassButton>

        <p className="text-xs leading-relaxed text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
          {t("auth.demoHint")}
        </p>
      </form>
    </AuthShell>
  );
}
