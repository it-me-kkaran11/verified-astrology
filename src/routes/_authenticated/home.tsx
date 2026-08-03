import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock, Flame, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { ShareCardModal, type ShareTarget } from "@/components/ShareCardModal";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  checkInStreak,
  myPredictionsQuery,
  resolvePrediction,
  type CheckInPrediction,
} from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Daily Check-In — AstroLive Verified" },
      {
        name: "description",
        content: "Confirm today's predictions true or false and keep Trust Scores honest.",
      },
      { property: "og:title", content: "Daily Check-In — AstroLive Verified" },
      {
        property: "og:description",
        content: "Your daily verification check-in for logged astrology predictions.",
      },
    ],
  }),
  component: HomePage,
});

function formatCountdown(ms: number): string {
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function HomePage() {
  const { user } = useSessionUser();
  const queryClient = useQueryClient();
  const { data: predictions = [], isLoading } = useQuery(myPredictionsQuery(user?.id));
  const [share, setShare] = useState<ShareTarget | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const now = Date.now();

  const { due, upcoming, streak, nextDueAt } = useMemo(() => {
    const pending = predictions.filter((p) => p.outcome === "pending");
    const dueList = pending.filter((p) => new Date(p.check_in_due_at).getTime() <= now);
    const upcomingList = pending
      .filter((p) => new Date(p.check_in_due_at).getTime() > now)
      .slice(0, 2);
    const next = pending
      .map((p) => new Date(p.check_in_due_at).getTime())
      .filter((t) => t > now)
      .sort((a, b) => a - b)[0];
    return {
      due: dueList,
      upcoming: upcomingList,
      streak: checkInStreak(predictions.map((p) => p.verified_at)),
      nextDueAt: next,
    };
  }, [predictions, now]);

  const confirm = async (p: CheckInPrediction, outcome: "true" | "false") => {
    setPendingId(p.id);
    try {
      await resolvePrediction(p.id, outcome);
      await queryClient.invalidateQueries();
      if (outcome === "true" && p.astrologer) {
        const nextTotal = p.astrologer.total_predictions + 1;
        const nextVerified = p.astrologer.verified_predictions + 1;
        setShare({
          predictionId: p.id,
          predictionText: p.text,
          astrologerName: p.astrologer.name,
          trustScore: Math.round((nextVerified / nextTotal) * 1000) / 10,
        });
      }
    } finally {
      setPendingId(null);
    }
  };

  return (
    <AppShell
      title="Daily Check-In"
      subtitle={new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}
    >
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="glass-card flex items-center gap-4 p-5">
          <div className="gold-glow flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold/12">
            <Flame className="h-6 w-6 text-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Check-in streak</p>
            <p className="text-2xl font-bold">
              {streak} {streak === 1 ? "day" : "days"}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Your confirmations</p>
            <p className="flex items-center justify-end gap-1.5 text-sm font-semibold">
              <VerifiedBadge size="sm" />
              {predictions.filter((p) => p.outcome !== "pending").length} verified
            </p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Reading your ledger…</p>
        ) : null}

        {due.length > 0 ? (
          <>
            <h2 className="pt-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Needs confirmation · {due.length}
            </h2>
            {due.map((p) => (
              <div key={p.id} className="glass-card p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {p.astrologer?.name ?? "Astrologer"}
                  </span>
                  <span>·</span>
                  <span className="truncate">
                    due {new Date(p.check_in_due_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed">{p.text}</p>
                <p className="mt-4 text-sm font-semibold">Did this happen?</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    disabled={pendingId === p.id}
                    onClick={() => confirm(p, "true")}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
                  >
                    <Check className="h-4 w-4" /> Yes
                  </button>
                  <button
                    disabled={pendingId === p.id}
                    onClick={() => confirm(p, "false")}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-border bg-secondary py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
                  >
                    <X className="h-4 w-4" /> No
                  </button>
                  <button
                    disabled={pendingId === p.id}
                    onClick={() => setPendingId(null)}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-border py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Clock className="h-4 w-4" /> Not yet
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : null}

        {upcoming.length > 0 ? (
          <>
            <h2 className="pt-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              New for you
            </h2>
            {upcoming.map((p) => (
              <div key={p.id} className="glass-card p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {p.astrologer?.name ?? "Astrologer"}
                  </span>
                  <span>·</span>
                  <span className="truncate">
                    check in {new Date(p.check_in_due_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed">{p.text}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <VerifiedBadge size="sm" /> Logged now, judged later
                </p>
              </div>
            ))}
          </>
        ) : null}

        {!isLoading && due.length === 0 && upcoming.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Sparkles className="mx-auto h-7 w-7 text-gold" />
            <p className="mt-4 text-lg font-bold">The sky is quiet for now</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Nothing is due. Every prediction you've been given is either resolved or still
              travelling toward its window — which is exactly how honest astrology should feel.
            </p>
          </div>
        ) : null}

        {!isLoading && due.length === 0 && nextDueAt ? (
          <div className="glass-card flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-semibold">Next check-in opens in</p>
              <p className="text-xs text-muted-foreground">
                {new Date(nextDueAt).toLocaleString()}
              </p>
            </div>
            <p className="text-xl font-bold tabular-nums text-gold-gradient">
              {formatCountdown(nextDueAt - now)}
            </p>
          </div>
        ) : null}
      </div>

      {share ? <ShareCardModal target={share} onClose={() => setShare(null)} /> : null}
    </AppShell>
  );
}
