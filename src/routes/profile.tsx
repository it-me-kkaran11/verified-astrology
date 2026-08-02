import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { TrustScore, VerifiedBadge } from "@/components/VerifiedBadge";
import { astrologers, todaysPredictions } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — AstroLive Verified" },
      {
        name: "description",
        content: "Your check-in streak, verification record, and followed astrologers.",
      },
      { property: "og:title", content: "Your Profile — AstroLive Verified" },
      {
        property: "og:description",
        content: "Track how many predictions you've confirmed and who you trust.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <AppShell title="Profile" subtitle="Ari Novak · Scorpio ☉ / Gemini ☾">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="glass-card flex items-center gap-4 p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/45 text-lg font-bold">
            AN
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-lg font-bold">
              Ari Novak <VerifiedBadge size="sm" />
            </p>
            <p className="text-xs text-muted-foreground">
              Verified checker since March 2026 · Observer plan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Check-ins", value: "214" },
            { label: "Streak", value: "18d" },
            { label: "Confirmed true", value: "63%" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <p className="text-xl font-bold">{s.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-5">
          <p className="text-sm font-semibold">Astrologers you follow</p>
          <ul className="mt-3 divide-y divide-border">
            {astrologers.slice(0, 3).map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/40 text-xs font-bold">
                  {a.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.handle}</p>
                </div>
                <TrustScore score={a.trustScore} size="sm" />
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm font-semibold">Recent verifications</p>
          <ul className="mt-3 space-y-3">
            {todaysPredictions.slice(2).map((p) => (
              <li key={p.id} className="flex items-start gap-2.5">
                <VerifiedBadge size="sm" className="mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm leading-snug">{p.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.astrologer} · marked {p.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/pricing"
          className="block rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground"
        >
          Upgrade for the full ledger
        </Link>
      </div>
    </AppShell>
  );
}
