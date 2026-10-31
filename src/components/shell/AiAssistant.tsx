"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Bot, Sparkles, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Avatar, Badge } from "@/components/ui/glass";
import { emirateLabel } from "@/lib/data";
import { drawer } from "@/lib/motion";
import { cn, GLASS } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

/**
 * Floating assistant drawer.
 *
 * Streaming is simulated locally so the UX is reviewable without a model key;
 * `answerFor()` is the single seam to replace with a real streamed completion
 * call (server route, key stays on the server).
 */
export function AiAssistant() {
  const { t, locale, pick } = useLocale();
  const { user } = useAuth();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextId = useRef(0);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("sanad:open-ai", handler);
    return () => window.removeEventListener("sanad:open-ai", handler);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function answerFor(question: string) {
    const emirate = user ? pick(emirateLabel(user.emirate)?.en ?? "", emirateLabel(user.emirate)?.ar ?? "") : "";
    const interests = user?.interests.slice(0, 2).join(" · ") ?? "";
    const q = question.toLowerCase();

    if (locale === "ar") {
      if (q.includes("مجلس") || q.includes("عائل"))
        return `قربك في ${emirate} ثلاثة مجالس عائلية هذا الأسبوع: «عائلات البرشاء» (٤١٢ عضوًا، لقاء الجمعة)، و«أمسيات المجاز»، و«الوافدون الجدد». بما أن اهتماماتك ${interests}، أنصحك بالبدء بعائلات البرشاء — لقاء الجمعة مناسب للأطفال وبقية المقاعد قليلة. أستطيع أن أضيفك إلى قائمة الانتظار إن أردت.`;
      if (q.includes("مجاني") || q.includes("نهاية الأسبوع"))
        return `هذا الأسبوع مجانًا: جولة الفجر على كورنيش أبوظبي (الثلاثاء ٦:٠٠)، قهوة الوافدين الجدد في السركال (الخميس ١٠:٠٠)، وألعاب المجاز اللوحية (الأحد ٦:٠٠). الثلاثة مفتوحة وبدون رسوم، فقط احجز مقعدك.`;
      return `سؤال جيد. بناءً على إمارتك (${emirate}) واهتماماتك (${interests})، أقترح البدء بمجلس محلي واحد ولقاء واحد هذا الأسبوع. إن أخبرتني بما تبحث عنه تحديدًا — مدارس، عمل، أو نشاط عائلي — سأضيّق الخيارات.`;
    }

    if (q.includes("majlis") || q.includes("famil"))
      return `Near you in ${emirate} there are three family majlis meeting this week: Al Barsha Families (412 members, Friday dinner), Al Majaz Evenings, and Newcomers Dubai. Given your interests in ${interests}, start with Al Barsha Families — the Friday dinner is child-friendly, but only a few seats are left. I can put you on the waitlist.`;
    if (q.includes("free") || q.includes("weekend"))
      return `Free this week: the sunrise Corniche walk in Abu Dhabi (Tuesday 6:00), newcomer coffee hour at Alserkal (Thursday 10:00), and board games by the lagoon in Sharjah (Sunday 18:00). All three are open and cost nothing — just RSVP.`;
    return `Good question. Based on your emirate (${emirate}) and interests (${interests}), I'd start with one local majlis and one gathering this week. Tell me what you're specifically looking for — schools, work, or something for the family — and I'll narrow it down.`;
  }

  function send(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || streaming) return;

    const answer = answerFor(text);
    const userId = (nextId.current += 1);
    const assistantId = (nextId.current += 1);
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", text },
      { id: assistantId, role: "assistant", text: "" },
    ]);
    setInput("");
    setStreaming(true);

    let index = 0;
    const step = 2;
    timer.current = setInterval(() => {
      index = Math.min(answer.length, index + step);
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId ? { ...message, text: answer.slice(0, index) } : message,
        ),
      );
      if (index >= answer.length) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setStreaming(false);
      }
    }, 18);
  }

  const sooner = reduce ? {} : { variants: drawer, initial: "hidden", animate: "show", exit: "exit" };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 end-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full bg-sanad-emerald-900 px-4 py-3 text-sm font-medium text-sanad-beige-50 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl lg:bottom-6 lg:end-6 dark:bg-sanad-gold-400 dark:text-sanad-emerald-950"
        aria-label={t("nav.askAi")}
      >
        <Sparkles aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">{t("ai.title")}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 bg-sanad-emerald-950/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        ) : null}

        {open ? (
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t("ai.title")}
            {...sooner}
            className={cn(
              GLASS,
              "fixed inset-x-3 bottom-3 top-16 z-50 flex flex-col overflow-hidden p-0 sm:inset-x-auto sm:bottom-6 sm:end-6 sm:top-auto sm:h-[min(640px,80dvh)] sm:w-[420px]",
            )}
          >
            <header className="flex items-start justify-between gap-3 border-b border-sanad-emerald-900/10 p-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-sanad-emerald-900 text-sanad-gold-300">
                  <Bot aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-sanad-emerald-950 dark:text-sanad-beige-50">
                    {t("ai.title")}
                  </p>
                  <p className="text-xs text-sanad-emerald-900/55 dark:text-sanad-beige-100/55">
                    {t("ai.subtitle")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("common.close")}
                className="inline-flex size-11 items-center justify-center rounded-xl text-sanad-emerald-900/60 hover:bg-black/5 dark:text-sanad-beige-100/60 dark:hover:bg-white/10"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sanad-emerald-900 text-sanad-gold-300">
                      <Sparkles aria-hidden="true" className="size-4" />
                    </span>
                    <div className="rounded-2xl rounded-ss-md bg-sanad-emerald-900/5 p-3 text-sm leading-relaxed text-sanad-emerald-950 dark:bg-white/5 dark:text-sanad-beige-100">
                      {t("ai.welcome")}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["ai.quick1", "ai.quick2", "ai.quick3"] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => send(t(key))}
                        className="rounded-full border border-sanad-emerald-900/15 bg-white/60 px-3 py-2 text-xs font-medium text-sanad-emerald-900 transition-all duration-300 hover:border-sanad-gold-400 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-sanad-beige-100"
                      >
                        {t(key)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) =>
                  message.role === "user" ? (
                    <div key={message.id} className="flex justify-end gap-2">
                      <div className="max-w-[85%] rounded-2xl rounded-ee-md bg-sanad-emerald-900 px-4 py-2.5 text-sm leading-relaxed text-sanad-beige-50">
                        {message.text}
                      </div>
                      <Avatar name={pick(user?.nameEn ?? "You", user?.nameAr ?? "أنت")} size="sm" className="mt-0.5" />
                    </div>
                  ) : (
                    <div key={message.id} className="flex gap-3">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-sanad-emerald-900 text-sanad-gold-300">
                        <Bot aria-hidden="true" className="size-4" />
                      </span>
                      <div className="max-w-[85%] rounded-2xl rounded-ss-md bg-sanad-emerald-900/5 px-4 py-2.5 text-sm leading-relaxed text-sanad-emerald-950 dark:bg-white/5 dark:text-sanad-beige-100">
                        {message.text || "…"}
                      </div>
                    </div>
                  ),
                )
              )}
            </div>

            <div className="border-t border-sanad-emerald-900/10 p-3 dark:border-white/10">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  send();
                }}
                className="flex items-end gap-2"
              >
                <label htmlFor="ai-input" className="sr-only">
                  {t("ai.placeholder")}
                </label>
                <input
                  id="ai-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t("ai.placeholder")}
                  className="min-h-11 flex-1 rounded-xl border border-sanad-emerald-900/15 bg-white/70 px-3 py-2.5 text-sm text-sanad-emerald-950 placeholder:text-sanad-emerald-900/40 focus:border-sanad-gold-400 focus:outline-none focus:ring-2 focus:ring-sanad-gold-400/25 dark:border-white/15 dark:bg-white/5 dark:text-sanad-beige-50 dark:placeholder:text-sanad-beige-100/40"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  aria-label={t("common.send")}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-sanad-emerald-900 text-sanad-beige-50 transition-all duration-300 hover:bg-sanad-emerald-800 disabled:opacity-40 dark:bg-sanad-gold-400 dark:text-sanad-emerald-950"
                >
                  <ArrowUp aria-hidden="true" className="size-5 rtl:rotate-90" />
                </button>
              </form>
              <div className="mt-2 flex items-center justify-between px-1">
                <Badge tone="beige">{t("ai.contextAware")}</Badge>
                <span className="text-[10px] text-sanad-emerald-900/45 dark:text-sanad-beige-100/45">
                  {t("ai.disclaimer")}
                </span>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
