import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { astrologersQuery, initials, SPECIALTIES, type Specialty } from "@/lib/queries";
import { useState } from "react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Trust Score Leaderboard — AstroLive Verified" },
      {
        name: "description",
        content: "Public Trust Scores ranking astrologers by verified prediction accuracy.",
      },
      { property: "og:title", content: "Trust Score Leaderboard — AstroLive Verified" },
      {
        property: "og:description",
        content: "See which astrologers hold the highest verified accuracy.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(astrologersQuery());
  },
  component: Leaderboard,
  errorComponent: () => (
    <AppShell title="Leaderboard">
      <p className="text-sm text-muted-foreground">
        The leaderboard couldn't load right now. Try refreshing.
      </p>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell title="Leaderboard">
      <p className="text-sm text-muted-foreground">Nothing here.</p>
    </AppShell>
  ),
});

function Leaderboard() {
  const { data: astrologers = [], isLoading } = useQuery(astrologersQuery());
  const [specialty, setSpecialty] = useState<Specialty | "all">("all");
  const [sortBy, setSortBy] = useState<"trust_score" | "total_predictions">("trust_score");

  const rows = astrologers
    .filter((a) => specialty === "all" || a.specialties.includes(specialty))
    .sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <AppShell title="Leaderboard" subtitle="Ranked by verified accuracy, updated on every check-in">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="glass-card space-y-3 p-4">
          <div className="flex flex-wrap gap-2">
            {(["all", ...SPECIALTIES] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpecialty(s)}
                className={
                  specialty === s
                    ? "rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    : "rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {s === "all" ? "All specialties" : s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-full bg-secondary p-1 text-xs font-semibold">
            {(
              [
                ["trust_score", "Trust score"],
                ["total_predictions", "Most predictions"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortBy(key)}
                className={
                  sortBy === key
                    ? "rounded-full bg-primary py-2 text-primary-foreground"
                    : "rounded-full py-2 text-muted-foreground"
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="glass-card h-20 animate-pulse p-4" />
            ))}
          </div>
        ) : null}

        {!isLoading && rows.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-lg font-bold">No verified records yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {astrologers.length === 0
                ? "The leaderboard fills up as astrologers log predictions and users confirm them."
                : "No astrologers match that specialty yet — try another filter."}
            </p>
          </div>
        ) : null}

        {rows.map((a, i) => {
          const rate = a.total_predictions
            ? Math.round((a.verified_predictions / a.total_predictions) * 100)
            : 0;
          return (
            <Link
              key={a.id}
              to="/astrologer/$astrologerId"
              params={{ astrologerId: a.id }}
              className="glass-card flex items-center gap-4 p-4 transition-transform hover:scale-[1.01]"
            >
              <span className="w-6 text-center text-lg font-bold text-muted-foreground">
                {i + 1}
              </span>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/45 text-sm font-bold">
                {initials(a.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                  {a.name} <VerifiedBadge size="sm" />
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {a.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${rate}%` }} />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {a.verified_predictions} of {a.total_predictions} confirmed ·{" "}
                  {a.total_predictions} predictions logged
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5">
                <VerifiedBadge size="sm" label={`Trust score ${a.trust_score}%`} />
                <span className="text-base font-bold tabular-nums text-gold-gradient">
                  {a.trust_score.toFixed(1)}%
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
