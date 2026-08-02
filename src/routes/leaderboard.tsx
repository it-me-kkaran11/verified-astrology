import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { TrustScore, VerifiedBadge } from "@/components/VerifiedBadge";
import { astrologers } from "@/lib/mock-data";

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
  component: Leaderboard,
});

function Leaderboard() {
  return (
    <AppShell title="Leaderboard" subtitle="Ranked by verified accuracy, updated hourly">
      <div className="mx-auto max-w-2xl space-y-3">
        {astrologers.map((a, i) => {
          const rate = Math.round((a.verified / a.total) * 100);
          return (
            <div key={a.id} className="glass-card flex items-center gap-4 p-4">
              <span className="w-6 text-center text-lg font-bold text-muted-foreground">
                {i + 1}
              </span>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/45 text-sm font-bold">
                {a.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                  {a.name} <VerifiedBadge size="sm" />
                </p>
                <p className="truncate text-xs text-muted-foreground">{a.specialty}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${rate}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {a.verified} of {a.total} confirmed · {rate}% accurate
                </p>
              </div>
              <TrustScore score={a.trustScore} size="sm" className="shrink-0" />
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
