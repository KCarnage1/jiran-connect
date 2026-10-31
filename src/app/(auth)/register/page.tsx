"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Field, GlassButton, TextInput, inputClass } from "@/components/ui/glass";
import { EMIRATES, type EmirateKey } from "@/lib/data";

export default function RegisterPage() {
  const { t, pick } = useLocale();
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emirate, setEmirate] = useState<EmirateKey>("dubai");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!consent) {
      setError(t("auth.consent"));
      return;
    }
    setPending(true);
    setError(undefined);
    const result = await signUp(name, email, password);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/home");
  }

  return (
    <AuthShell
      title={t("auth.registerTitle")}
      subtitle={t("auth.registerSubtitle")}
      footer={
        <p className="text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
          {t("common.hasAccount")}{" "}
          <Link href="/login" className="font-semibold text-sanad-emerald-900 underline-offset-4 hover:underline dark:text-sanad-gold-300">
            {t("common.signIn")}
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label={t("common.fullName")} htmlFor="name">
          <TextInput
            id="name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={pick("Layla Al Mansoori", "ليلى المنصوري")}
          />
        </Field>

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

        <Field label={t("common.allEmirates")} htmlFor="emirate">
          <select
            id="emirate"
            value={emirate}
            onChange={(event) => setEmirate(event.target.value as EmirateKey)}
            className={inputClass}
          >
            {EMIRATES.map((item) => (
              <option key={item.key} value={item.key}>
                {pick(item.en, item.ar)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t("common.password")} htmlFor="password" error={error} hint={t("auth.demoHint")}>
          <TextInput
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            dir="ltr"
          />
        </Field>

        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-sanad-emerald-900/75 dark:text-sanad-beige-100/75">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 size-4 rounded border-sanad-emerald-900/30 accent-sanad-emerald-900"
          />
          {t("auth.consent")}
        </label>

        <GlassButton type="submit" size="lg" className="w-full" disabled={pending}>
          <UserPlus aria-hidden="true" className="size-4" />
          {pending ? t("common.loading") : t("common.createAccount")}
        </GlassButton>
      </form>
    </AuthShell>
  );
}
