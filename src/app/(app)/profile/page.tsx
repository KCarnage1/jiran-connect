"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle2,
  Download,
  Fingerprint,
  LogOut,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Avatar, Badge, GlassButton, GlassCard, TextInput, inputClass } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/Reveal";
import { EMIRATES, type EmirateKey } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default function ProfilePage() {
  const { t, pick, locale } = useLocale();
  const { user, signOut, updateUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(() => (user ? pick(user.nameEn, user.nameAr) : ""));
  const [bio, setBio] = useState(user?.bio ?? "");
  const [emirate, setEmirate] = useState<EmirateKey>(user?.emirate ?? "dubai");
  const [interests, setInterests] = useState(() => user?.interests.join(", ") ?? "");
  const [languages, setLanguages] = useState(() => user?.languages.join(", ") ?? "");
  const [saved, setSaved] = useState(false);
  const verification = user?.verification ?? null;

  if (!user) return null;
  const displayName = pick(user.nameEn, user.nameAr);

  function save(event: React.FormEvent) {
    event.preventDefault();
    updateUser({
      nameEn: name,
      nameAr: name,
      bio,
      emirate,
      interests: interests.split(",").map((item) => item.trim()).filter(Boolean),
      languages: languages.split(",").map((item) => item.trim()).filter(Boolean),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function downloadData() {
    const payload = { profile: user, verification, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sanad-my-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader eyebrow={t("nav.profile")} title={t("profile.title")} subtitle={t("profile.subtitle")} />

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <GlassCard>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar name={displayName} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-sanad-emerald-950 dark:text-sanad-beige-50">
                    {displayName}
                  </h2>
                  <Badge tone={user.verified ? "gold" : "beige"} icon={user.verified ? <CheckCircle2 aria-hidden="true" className="size-3.5" /> : undefined}>
                    {user.verified ? t("common.verified") : t("common.unverified")}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-sanad-emerald-900/60 dark:text-sanad-beige-100/60">
                  {t("profile.signedInAs")} {user.email}
                </p>
              </div>
            </div>

            <form onSubmit={save} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="profile-name" className="block text-sm font-medium text-sanad-emerald-950 dark:text-sanad-beige-100">
                    {t("common.fullName")}
                  </label>
                  <TextInput id="profile-name" value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="profile-emirate" className="block text-sm font-medium text-sanad-emerald-950 dark:text-sanad-beige-100">
                    {t("common.allEmirates")}
                  </label>
                  <select
                    id="profile-emirate"
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
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-bio" className="block text-sm font-medium text-sanad-emerald-950 dark:text-sanad-beige-100">
                  {t("common.about")}
                </label>
                <textarea
                  id="profile-bio"
                  rows={3}
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="profile-interests" className="block text-sm font-medium text-sanad-emerald-950 dark:text-sanad-beige-100">
                    {t("profile.interests")}
                  </label>
                  <TextInput id="profile-interests" value={interests} onChange={(event) => setInterests(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="profile-languages" className="block text-sm font-medium text-sanad-emerald-950 dark:text-sanad-beige-100">
                    {t("profile.languages")}
                  </label>
                  <TextInput id="profile-languages" value={languages} onChange={(event) => setLanguages(event.target.value)} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <GlassButton type="submit">
                  <Save aria-hidden="true" className="size-4" />
                  {t("profile.saveChanges")}
                </GlassButton>
                {saved ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-sanad-emerald-800 dark:text-sanad-gold-300">
                    <CheckCircle2 aria-hidden="true" className="size-4" />
                    {t("profile.saved")}
                  </span>
                ) : null}
              </div>
            </form>
          </GlassCard>
        </Reveal>

        <div className="space-y-5">
          <Reveal delay={0.05}>
            <GlassCard>
              <div className="flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="size-5 text-sanad-gold-500" />
                <h2 className="text-base font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                  {t("profile.privacy")}
                </h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-sanad-emerald-900/70 dark:text-sanad-beige-100/70">
                {t("profile.privacyDesc")}
              </p>

              {verification ? (
                <dl className="mt-4 space-y-2 rounded-xl border border-sanad-emerald-900/10 bg-white/50 p-3 text-xs dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">{t("verify.storedHash")}</dt>
                    <dd className="truncate font-mono text-sanad-emerald-950 dark:text-sanad-beige-50">
                      {verification.idHash.slice(0, 12)}…{verification.idHash.slice(-4)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">{t("verify.storedStatus")}</dt>
                    <dd className="font-medium text-sanad-emerald-800 dark:text-sanad-gold-300">{verification.status}</dd>
                  </div>
                  {verification.verifiedAt ? (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">{t("verify.storedAt")}</dt>
                      <dd className="text-sanad-emerald-950 dark:text-sanad-beige-50">
                        {formatDate(verification.verifiedAt, locale)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : (
                <Link
                  href="/verify"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-sanad-gold-400/40 bg-sanad-gold-400/10 px-3 text-sm font-medium text-sanad-gold-500 dark:text-sanad-gold-300"
                >
                  <Fingerprint aria-hidden="true" className="size-4" />
                  {t("home.verifyCta")}
                </Link>
              )}

              <div className="mt-4 flex flex-col gap-2">
                <GlassButton variant="glass" size="sm" onClick={downloadData}>
                  <Download aria-hidden="true" className="size-4" />
                  {t("profile.downloadData")}
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  className="text-red-700 hover:bg-red-500/10 dark:text-red-300"
                  onClick={() => {
                    if (window.confirm(`${t("profile.deleteAccount")}?`)) {
                      signOut();
                      router.replace("/login");
                    }
                  }}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  {t("profile.deleteAccount")}
                </GlassButton>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard>
              <div className="flex items-center gap-2">
                <UserRound aria-hidden="true" className="size-5 text-sanad-emerald-900 dark:text-sanad-gold-300" />
                <h2 className="text-base font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                  {t("profile.interests")}
                </h2>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <Badge key={interest} tone="emerald">
                    {interest}
                  </Badge>
                ))}
              </div>
              <h3 className="mt-5 text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                {t("profile.languages")}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.languages.map((language) => (
                  <Badge key={language} tone="beige">
                    {language}
                  </Badge>
                ))}
              </div>

              <GlassButton
                variant="ghost"
                size="sm"
                className="mt-5 w-full"
                onClick={() => {
                  signOut();
                  router.replace("/login");
                }}
              >
                <LogOut aria-hidden="true" className="size-4 rtl:rotate-180" />
                {t("nav.logout")}
              </GlassButton>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
