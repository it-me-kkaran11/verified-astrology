import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { plans } from "@/lib/mock-data";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — AstroLive Verified" },
      {
        name: "description",
        content: "Plans for verified astrology: free check-ins, full accuracy ledgers, live readings.",
      },
      { property: "og:title", content: "Pricing — AstroLive Verified" },
      {
        property: "og:description",
        content: "Choose the plan that fits how deeply you want to verify.",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <AppShell title="Pricing" subtitle="Every plan keeps the public Trust Scores free to read">
      <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={
              p.highlight
                ? "glass-card border-gold/40 p-6 gold-glow"
                : "glass-card p-6"
            }
          >
            {p.highlight ? (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-gold-soft">
                <VerifiedBadge size="sm" /> Most verified
              </span>
            ) : null}
            <h2 className="text-lg">{p.name}</h2>
            <p className="mt-2">
              <span className="text-3xl font-bold">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.cadence}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
            <ul className="mt-4 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={
                p.highlight
                  ? "mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
                  : "mt-6 w-full rounded-full border border-border bg-secondary py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
