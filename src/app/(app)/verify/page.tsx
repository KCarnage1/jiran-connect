"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Fingerprint,
  KeyRound,
  Lock,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, GlassButton, GlassCard, Progress, TextInput } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/Reveal";
import { confirmVerification, requestVerification, type VerificationDraft } from "@/lib/uae-pass/actions";
import { formatDate } from "@/lib/format";
import type { StoredVerification } from "@/lib/auth-types";

export default function VerifyPage() {
  const { t, pick, locale } = useLocale();
  const { user, markVerified } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [emiratesId, setEmiratesId] = useState("");
  const [otp, setOtp] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState<VerificationDraft>();
  const [record, setRecord] = useState<StoredVerification>();

  async function submitId(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    if (!consent) {
      setError(t("verify.consent"));
      return;
    }
    setPending(true);
    const result = await requestVerification(emiratesId);
    setPending(false);
    if ("error" in result) {
      setError(
        result.error === "invalid_id"
          ? t("verify.invalidId")
          : pick(
              "Hash salt missing. Set NEXT_PUBLIC_UAE_PASS_HASH_PEPPER before building.",
              "مفتاح التشفير غير مضبوط. أضف NEXT_PUBLIC_UAE_PASS_HASH_PEPPER قبل البناء.",
            ),
      );
      return;
    }
    setDraft(result.draft);
    setStep(2);
  }

  async function submitOtp(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    if (!draft) return;
    setPending(true);
    const result = await confirmVerification(draft.recordId, otp);
    setPending(false);
    if ("error" in result) {
      setError(t("verify.invalidOtp"));
      return;
    }
    const stored: StoredVerification = {
      recordId: draft.recordId,
      idHash: draft.idHash,
      requestedAt: draft.requestedAt,
      status: "verified",
      verifiedAt: result.result.verifiedAt,
    };
    setRecord(stored);
    markVerified(stored);
    setStep(3);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow={t("nav.verify")}
        title={t("verify.title")}
        subtitle={t("verify.subtitle")}
        action={
          <Badge tone="gold" icon={<ShieldCheck aria-hidden="true" className="size-3.5" />}>
            UAE PASS
          </Badge>
        }
      />

      <Reveal>
        <div className="mb-6">
          <Progress value={step} max={3} />
          <div className="mt-2 flex justify-between text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
            <span>{t("verify.step1")}</span>
            <span>{t("verify.step2")}</span>
            <span>{t("verify.successTitle")}</span>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <GlassCard>
          {step === 1 ? (
            <form onSubmit={submitId} className="space-y-5" noValidate>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-sanad-emerald-900 text-sanad-gold-300">
                  <Fingerprint aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                    {t("verify.step1")}
                  </h2>
                  <p className="text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                    {t("verify.step1Desc")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="emirates-id" className="block text-sm font-medium text-sanad-emerald-950 dark:text-sanad-beige-100">
                  {t("verify.idLabel")}
                </label>
                <TextInput
                  id="emirates-id"
                  inputMode="numeric"
                  autoComplete="off"
                  dir="ltr"
                  placeholder="784-1985-1234567-1"
                  value={emiratesId}
                  onChange={(event) => setEmiratesId(event.target.value)}
                  aria-describedby="emirates-hint"
                />
                <p id="emirates-hint" className="text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                  {t("verify.hashNote")}
                </p>
                {error ? (
                  <p role="alert" className="text-xs font-medium text-red-700 dark:text-red-300">
                    {error}
                  </p>
                ) : null}
              </div>

              <label className="flex items-start gap-2.5 text-xs leading-relaxed text-sanad-emerald-900/75 dark:text-sanad-beige-100/75">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-0.5 size-4 rounded border-sanad-emerald-900/30 accent-sanad-emerald-900"
                />
                {t("verify.consent")}
              </label>

              <GlassButton type="submit" size="lg" className="w-full" disabled={pending}>
                <ShieldCheck aria-hidden="true" className="size-4" />
                {pending ? t("common.loading") : t("verify.submit")}
              </GlassButton>
            </form>
          ) : null}

          {step === 2 ? (
            <form onSubmit={submitOtp} className="space-y-5" noValidate>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-sanad-gold-400/20 text-sanad-gold-500">
                  <Smartphone aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                    {t("verify.step2")}
                  </h2>
                  <p className="text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                    {t("verify.step2Desc")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-medium text-sanad-emerald-950 dark:text-sanad-beige-100">
                  {t("verify.otp")}
                </label>
                <TextInput
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  dir="ltr"
                  placeholder="123456"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className="text-center font-mono text-lg tracking-[0.4em]"
                />
                {error ? (
                  <p role="alert" className="text-xs font-medium text-red-700 dark:text-red-300">
                    {error}
                  </p>
                ) : null}
                {draft ? (
                  <p className="truncate font-mono text-[11px] text-sanad-emerald-900/45 dark:text-sanad-beige-100/45">
                    id_hash: {draft.idHash}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <GlassButton type="submit" size="lg" className="flex-1" disabled={pending}>
                  <KeyRound aria-hidden="true" className="size-4" />
                  {pending ? t("common.loading") : t("verify.confirm")}
                </GlassButton>
                <GlassButton type="button" variant="ghost" size="lg" onClick={() => setStep(1)}>
                  {t("common.back")}
                </GlassButton>
              </div>
            </form>
          ) : null}

          {step === 3 && record ? (
            <div className="space-y-5">
              <div className="text-center">
                <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-sanad-emerald-900 text-sanad-gold-300">
                  <Check aria-hidden="true" className="size-8" strokeWidth={3} />
                </span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                  {t("verify.successTitle")}
                </h2>
                <p className="mt-1 text-sm text-sanad-emerald-900/65 dark:text-sanad-beige-100/65">
                  {t("verify.successDesc")}
                </p>
              </div>

              <div className="rounded-xl border border-sanad-emerald-900/10 bg-sanad-emerald-900/5 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                  <Lock aria-hidden="true" className="size-3.5" />
                  {t("verify.storedTitle")}
                </p>
                <dl className="mt-3 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">{t("verify.storedHash")}</dt>
                    <dd className="max-w-[60%] break-all text-end font-mono text-sanad-emerald-950 dark:text-sanad-beige-50">
                      {record.idHash.slice(0, 16)}…{record.idHash.slice(-8)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">{t("verify.storedStatus")}</dt>
                    <dd className="font-medium text-sanad-emerald-800 dark:text-sanad-gold-300">{record.status}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">{t("verify.storedAt")}</dt>
                    <dd className="text-sanad-emerald-950 dark:text-sanad-beige-50">
                      {record.verifiedAt ? formatDate(record.verifiedAt, locale, "d MMMM yyyy, h:mm a") : "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">{t("verify.storedId")}</dt>
                    <dd className="font-mono text-sanad-emerald-950 dark:text-sanad-beige-50">
                      {record.recordId.slice(0, 8)}…
                    </dd>
                  </div>
                </dl>
              </div>

              <p className="text-xs leading-relaxed text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                {t("verify.hashNote")}
              </p>

              <GlassButton size="lg" className="w-full" onClick={() => router.push("/home")}>
                {t("verify.done")}
                <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
              </GlassButton>
            </div>
          ) : null}
        </GlassCard>
      </Reveal>

      {user?.verified && step !== 3 ? (
        <p className="mt-4 text-center text-sm text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
          {t("home.verifiedDesc")}
        </p>
      ) : null}
    </div>
  );
}
