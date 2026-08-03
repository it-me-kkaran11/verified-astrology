import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { astrologerPredictionsQuery, astrologerQuery, initials } from "@/lib/queries";

export const Route = createFileRoute("/astrologer/$astrologerId")({
  head: () => ({
    meta: [
      { title: "Astrologer Record — AstroLive Verified" },
      {
        name: "description",
        content: "Full logged prediction history and verified Trust Score for this astrologer.",
      },
      { property: "og:title", content: "Astrologer Record — AstroLive Verified" },
      {
        property: "og:description",
        content: "Every prediction, every outcome, publicly verifiable.",
      },
    ],
  }),
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(astrologerQuery(params.astrologerId));
    context.queryClient.ensureQueryData(astrologerPredictionsQuery(params.astrologerId));
  },
  component: AstrologerPage,
  errorComponent: () => (
    <AppShell title="Astrologer">
      <p className="text-sm text-muted-foreground">This record couldn't load. Try refreshing.</p>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell title="Astrologer">
      <p className="text-sm text-muted-foreground">No astrologer with that ID.</p>
    </AppShell>
  ),
});

const OUTCOME_STYLE: Record<string, string> = {
  true: "border-gold/40 bg-gold/10 text-gold-soft",
  false: "border-border bg-secondary text-muted-foreground",
  pending: "border-primary/50 bg-primary/20 text-foreground",
};

function AstrologerPage() {
  const { astrologerId } = Route.useParams();
  const { data: astrologer } = useQuery(astrologerQuery(astrologerId));
  const { data: predictions = [] } = useQuery(astrologerPredictionsQuery(astrologerId));

  if (!astrologer) {
    return (
      <AppShell title="Astrologer">
        <p className="text-sm text-muted-foreground">We couldn't find that astrologer.</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={astrologer.name} subtitle={astrologer.specialties.join(" · ")}>
      <div className="mx-auto max-w-2xl space-y-4">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to leaderboard
        </Link>

        <div className="glass-card p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/45 text-lg font-bold">
              {initials(astrologer.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-lg font-bold">
                {astrologer.name} <VerifiedBadge size="sm" />
              </p>
              <p className="text-xs text-muted-foreground">
                {astrologer.total_predictions} predictions logged ·{" "}
                {astrologer.verified_predictions} confirmed true
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5">
              <VerifiedBadge label={`Trust score ${astrologer.trust_score}%`} />
              <span className="text-2xl font-bold tabular-nums text-gold-gradient">
                {astrologer.trust_score.toFixed(1)}%
              </span>
            </span>
          </div>
          {astrologer.bio ? (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{astrologer.bio}</p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {astrologer.specialties.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.01]"
        >
          Book Consultation
        </button>

        <h2 className="pt-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Prediction history
        </h2>

        {predictions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No predictions logged yet.</p>
        ) : null}

        {predictions.map((p) => (
          <div key={p.id} className="glass-card p-4">
            <p className="text-[15px] leading-relaxed">{p.text}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${OUTCOME_STYLE[p.outcome]}`}
              >
                {p.outcome}
              </span>
              <span>
                {p.verified_at
                  ? `verified ${new Date(p.verified_at).toLocaleDateString()}`
                  : `due ${new Date(p.check_in_due_at).toLocaleDateString()}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
