"use client";

import Link from "next/link";
import { useState } from "react";
import { MailCheck, Send } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Field, GlassButton, TextInput } from "@/components/ui/glass";

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      title={t("auth.forgotTitle")}
      subtitle={t("auth.forgotSubtitle")}
      footer={
        <p className="text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
          {t("common.hasAccount")}{" "}
          <Link href="/login" className="font-semibold text-sanad-emerald-900 underline-offset-4 hover:underline dark:text-sanad-gold-300">
            {t("common.signIn")}
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="space-y-4 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-sanad-emerald-900/10 text-sanad-emerald-900 dark:bg-white/10 dark:text-sanad-gold-300">
            <MailCheck aria-hidden="true" className="size-7" />
          </span>
          <p className="text-sm leading-relaxed text-sanad-emerald-900/75 dark:text-sanad-beige-100/75">
            {t("auth.forgotSent")}
          </p>
          <GlassButton variant="ghost" onClick={() => setSent(false)} className="w-full">
            {t("common.resetPassword")}
          </GlassButton>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
          className="space-y-5"
        >
          <Field label={t("common.email")} htmlFor="email">
            <TextInput
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.ae"
              dir="ltr"
              autoComplete="email"
            />
          </Field>
          <GlassButton type="submit" size="lg" className="w-full">
            <Send aria-hidden="true" className="size-4 rtl:rotate-180" />
            {t("common.resetPassword")}
          </GlassButton>
        </form>
      )}
    </AuthShell>
  );
}
