import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { TrustScore, VerifiedBadge } from "@/components/VerifiedBadge";
import { useSessionUser } from "@/hooks/useSessionUser";
import { supabase } from "@/integrations/supabase/client";
import { birthChartSummary } from "@/lib/birth-chart";
import { checkInStreak, initials, myPredictionsQuery, myProfileQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — AstroLive Verified" },
      {
        name: "description",
        content: "Your birth chart summary, check-in streak and verification record.",
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
  const { user } = useSessionUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile } = useQuery(myProfileQuery(user?.id));
  const { data: predictions = [], isLoading: loadingPredictions } = useQuery(
    myPredictionsQuery(user?.id),
  );
  const isLoading = !user || loadingProfile || loadingPredictions;

  const chart = profile ? birthChartSummary(profile) : null;
  const resolved = predictions.filter((p) => p.outcome !== "pending");
  const trueCount = predictions.filter((p) => p.outcome === "true").length;
  const accuracy = resolved.length ? Math.round((trueCount / resolved.length) * 100) : 0;
  const streak = checkInStreak(predictions.map((p) => p.verified_at));

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const followed = predictions
    .map((p) => p.astrologer)
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i);

  if (isLoading) {
    return (
      <AppShell title="Profile" subtitle="Your record">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="glass-card h-24 animate-pulse p-5" />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="glass-card h-20 animate-pulse" />
            ))}
          </div>
          <div className="glass-card h-40 animate-pulse" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Profile"
      subtitle={chart ? `${chart.sun} ☉ / ${chart.moon} ☾ / ${chart.rising} ↑` : "Your record"}
    >
      <div className="mx-auto max-w-2xl space-y-4">
        {predictions.length === 0 ? (
          <div className="glass-card p-5 text-center text-sm text-muted-foreground">
            No predictions on your record yet — log one in Astra and your ledger starts there.
          </div>
        ) : null}
        <div className="glass-card flex items-center gap-4 p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/45 text-lg font-bold">
            {initials(profile?.name ?? "AL")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-lg font-bold">
              {profile?.name ?? "You"} <VerifiedBadge size="sm" />
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {profile?.place_of_birth ? `Born in ${profile.place_of_birth}` : user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Check-ins", value: String(resolved.length) },
            { label: "Streak", value: `${streak}d` },
            { label: "Confirmed true", value: `${accuracy}%` },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <p className="text-xl font-bold">{s.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {chart ? (
          <div className="glass-card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <VerifiedBadge size="sm" /> Your birth-chart summary
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { k: "Sun", v: chart.sun },
                { k: "Moon", v: chart.moon },
                { k: "Rising", v: chart.rising },
              ].map((t) => (
                <span
                  key={t.k}
                  className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-soft"
                >
                  {t.k} · {t.v}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{chart.paragraph}</p>
          </div>
        ) : null}

        {followed.length > 0 ? (
          <div className="glass-card p-5">
            <p className="text-sm font-semibold">Astrologers reading for you</p>
            <ul className="mt-3 divide-y divide-border">
              {followed.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/40 text-xs font-bold">
                    {initials(a.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/astrologer/$astrologerId"
                      params={{ astrologerId: a.id }}
                      className="truncate text-sm font-semibold hover:text-gold-soft"
                    >
                      {a.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.specialties.join(" · ")}
                    </p>
                  </div>
                  <TrustScore score={a.trust_score} size="sm" />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {resolved.length > 0 ? (
          <div className="glass-card p-5">
            <p className="text-sm font-semibold">Recent verifications</p>
            <ul className="mt-3 space-y-3">
              {resolved.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-start gap-2.5">
                  <VerifiedBadge size="sm" className="mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">{p.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {p.astrologer?.name ?? "Astrologer"} · marked {p.outcome}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

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
