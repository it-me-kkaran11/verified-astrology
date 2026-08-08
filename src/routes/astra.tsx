import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  ASTRA_GREETING,
  QUICK_PROMPTS,
  detectIntent,
  fallback,
  historySummary,
  logConfirmation,
  logIntro,
  trustExplainer,
} from "@/lib/astra";
import {
  astrologersQuery,
  checkInStreak,
  logPrediction,
  myPredictionsQuery,
} from "@/lib/queries";

export const Route = createFileRoute("/astra")({
  head: () => ({
    meta: [
      { title: "Astra — AstroLive Verified" },
      {
        name: "description",
        content:
          "Log predictions from any consultation, understand Trust Scores, and review your own verification record with Astra.",
      },
      { property: "og:title", content: "Astra — AstroLive Verified" },
      {
        property: "og:description",
        content: "Your verification-aware astrology assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AstraPage,
});

type Msg = { id: string; from: "astra" | "user"; text: string; form?: boolean };

function AstraPage() {
  const { user } = useSessionUser();
  const queryClient = useQueryClient();
  const { data: astrologers = [], isLoading: loadingAstrologers } = useQuery(astrologersQuery());
  const { data: predictions = [] } = useQuery(myPredictionsQuery(user?.id));

  const [messages, setMessages] = useState<Msg[]>([
    { id: "greet", from: "astra", text: ASTRA_GREETING },
  ]);
  const [draft, setDraft] = useState("");
  const counter = useRef(0);

  const stats = useMemo(() => {
    const resolved = predictions.filter((p) => p.outcome !== "pending");
    const trueCount = predictions.filter((p) => p.outcome === "true").length;
    const falseCount = predictions.filter((p) => p.outcome === "false").length;
    const top = predictions
      .map((p) => p.astrologer)
      .filter((a): a is NonNullable<typeof a> => Boolean(a))
      .sort((a, b) => b.trust_score - a.trust_score)[0];
    return {
      total: predictions.length,
      resolved: resolved.length,
      trueCount,
      falseCount,
      pending: predictions.length - resolved.length,
      accuracy: resolved.length ? Math.round((trueCount / resolved.length) * 100) : 0,
      streak: checkInStreak(predictions.map((p) => p.verified_at)),
      topAstrologer: top ? { name: top.name, trust_score: top.trust_score } : null,
    };
  }, [predictions]);

  const push = (msg: Omit<Msg, "id">) => {
    counter.current += 1;
    setMessages((prev) => [...prev, { ...msg, id: `m${counter.current}` }]);
  };

  const reply = (text: string) => {
    const intent = detectIntent(text);
    if (intent === "trust") return push({ from: "astra", text: trustExplainer() });
    if (intent === "history") return push({ from: "astra", text: historySummary(stats) });
    if (intent === "log") {
      push({ from: "astra", text: logIntro() });
      return push({ from: "astra", text: "", form: true });
    }
    return push({ from: "astra", text: fallback() });
  };

  const send = (value?: string) => {
    const text = (value ?? draft).trim();
    if (!text) return;
    push({ from: "user", text });
    setDraft("");
    window.setTimeout(() => reply(text), 260);
  };

  const logMutation = useMutation({
    mutationFn: (input: { astrologerId: string; text: string; dueAt: string }) => {
      if (!user) throw new Error("Sign in to log a prediction.");
      return logPrediction({
        userId: user.id,
        astrologerId: input.astrologerId,
        text: input.text,
        checkInDueAt: input.dueAt,
      });
    },
    onSuccess: (_data, input) => {
      const name = astrologers.find((a) => a.id === input.astrologerId)?.name ?? "your astrologer";
      push({ from: "astra", text: logConfirmation(input.text, name, input.dueAt) });
      void queryClient.invalidateQueries({ queryKey: ["my-predictions"] });
      toast.success("Prediction logged as pending");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <AppShell title="Astra" subtitle="Grounded in your verified history">
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {messages.map((m) =>
          m.form ? (
            <LogPredictionForm
              key={m.id}
              astrologers={astrologers}
              loading={loadingAstrologers}
              signedIn={Boolean(user)}
              submitting={logMutation.isPending}
              onSubmit={(v) => logMutation.mutate(v)}
            />
          ) : (
            <div
              key={m.id}
              className={
                m.from === "user"
                  ? "ml-auto max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground"
                  : "glass-card max-w-[88%] p-4 text-sm leading-relaxed"
              }
            >
              {m.from === "astra" ? (
                <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-soft">
                  <VerifiedBadge size="sm" /> Astra
                </p>
              ) : null}
              {m.text}
            </div>
          ),
        )}

        <div className="mt-1 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => send(p)}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold-soft"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="glass-card sticky bottom-24 mt-2 flex items-center gap-2 p-2 md:bottom-4">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            aria-label="Message Astra"
            placeholder="Log a prediction, or ask about trust scores…"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => send()}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function LogPredictionForm({
  astrologers,
  loading,
  signedIn,
  submitting,
  onSubmit,
}: {
  astrologers: { id: string; name: string; trust_score: number }[];
  loading: boolean;
  signedIn: boolean;
  submitting: boolean;
  onSubmit: (v: { astrologerId: string; text: string; dueAt: string }) => void;
}) {
  const [astrologerId, setAstrologerId] = useState("");
  const [text, setText] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [done, setDone] = useState(false);

  if (!signedIn) {
    return (
      <div className="glass-card max-w-[88%] p-4 text-sm text-muted-foreground">
        Sign in first and I'll write this into your own ledger — a prediction only counts when it's
        attached to a real record.
      </div>
    );
  }

  if (done) {
    return (
      <div className="glass-card max-w-[88%] border-gold/30 p-4 text-sm text-gold-soft">
        <VerifiedBadge size="sm" /> Written to your ledger.
      </div>
    );
  }

  return (
    <form
      className="glass-card space-y-3 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!astrologerId || !text.trim() || !dueAt) return;
        onSubmit({ astrologerId, text: text.trim(), dueAt });
        setDone(true);
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-soft">
        New prediction
      </p>
      <label className="block text-xs text-muted-foreground">
        Who gave it to you
        <select
          required
          value={astrologerId}
          onChange={(e) => setAstrologerId(e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none"
        >
          <option value="">{loading ? "Loading astrologers…" : "Select an astrologer"}</option>
          {astrologers.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} · {a.trust_score}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs text-muted-foreground">
        What exactly were you told
        <textarea
          required
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="A job offer arrives before the end of the month."
          className="mt-1.5 w-full resize-none rounded-2xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>
      <label className="block text-xs text-muted-foreground">
        Check in on
        <input
          required
          type="date"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {submitting ? "Logging…" : "Log prediction"}
      </button>
    </form>
  );
}
