import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Flame } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { TrustScore, VerifiedBadge } from "@/components/VerifiedBadge";
import { todaysPredictions, type Prediction } from "@/lib/mock-data";

export const Route = createFileRoute("/home")({
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

function HomePage() {
  const [items, setItems] = useState<Prediction[]>(todaysPredictions);

  const resolve = (id: string, status: "true" | "false") =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));

  const pending = items.filter((p) => p.status === "pending");

  return (
    <AppShell title="Daily Check-In" subtitle="Sunday, August 2">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="glass-card flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold/12 gold-glow">
            <Flame className="h-6 w-6 text-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Check-in streak</p>
            <p className="text-2xl font-bold">18 days</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Your accuracy contributions</p>
            <p className="flex items-center justify-end gap-1.5 text-sm font-semibold">
              <VerifiedBadge size="sm" /> 214 verified
            </p>
          </div>
        </div>

        <h2 className="pt-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Resolving today · {pending.length} left
        </h2>

        {items.map((p) => (
          <div key={p.id} className="glass-card p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{p.astrologer}</span>
              <span>·</span>
              <span className="truncate">{p.window}</span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed">{p.text}</p>

            {p.status === "pending" ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => resolve(p.id, "true")}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  <Check className="h-4 w-4" /> Happened
                </button>
                <button
                  onClick={() => resolve(p.id, "false")}
                  className="flex items-center justify-center gap-2 rounded-full border border-border bg-secondary py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" /> Didn't happen
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                {p.status === "true" ? (
                  <>
                    <VerifiedBadge size="sm" />
                    <span className="text-gold-soft">Confirmed true</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Marked false</span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="glass-card flex items-center justify-between p-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Your most trusted astrologer</p>
            <p className="truncate text-xs text-muted-foreground">Mira Kalyani · Vedic • Career</p>
          </div>
          <TrustScore score={942} />
        </div>
      </div>
    </AppShell>
  );
}
