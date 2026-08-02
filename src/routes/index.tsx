import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck, Scale, ShieldCheck } from "lucide-react";

import { VerifiedBadge, TrustScore } from "@/components/VerifiedBadge";
import { astrologers } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AstroLive Verified — Astrology You Can Actually Verify" },
      {
        name: "description",
        content:
          "Every astrologer's predictions are logged, confirmed true or false by you, and rolled up into a public Trust Score.",
      },
      { property: "og:title", content: "AstroLive Verified — Astrology You Can Actually Verify" },
      {
        property: "og:description",
        content: "Public Trust Scores for astrologers, built from verified predictions.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    icon: ClipboardCheck,
    title: "1 · Predictions get logged",
    text: "Astrologers publish dated, specific predictions. Once logged, nothing can be edited or quietly deleted.",
  },
  {
    icon: ShieldCheck,
    title: "2 · You confirm the outcome",
    text: "When the window closes, you mark it true or false in your daily check-in. Real outcomes, from real people.",
  },
  {
    icon: Scale,
    title: "3 · Trust Scores update publicly",
    text: "Every confirmation rolls into a public Trust Score — like a credit score for astrologers. Accuracy becomes visible.",
  },
];

function Landing() {
  return (
    <div className="starfield min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2">
          <VerifiedBadge />
          <span className="font-bold tracking-tight">AstroLive Verified</span>
        </div>
        <Link
          to="/auth"
          className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          Log in
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-5 pt-8 text-center md:pt-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-soft">
          <VerifiedBadge size="sm" />
          1.2M predictions verified
        </span>
        <h1 className="mt-6 text-4xl leading-[1.08] md:text-6xl">
          Astrology you can <span className="text-gold-gradient">actually verify.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Most astrology never gets checked. Here, every prediction is logged in advance,
          confirmed true or false by the people who received it, and scored in public.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            to="/auth"
            className="w-full max-w-xs rounded-full bg-primary px-8 py-3.5 text-center text-base font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]"
          >
            Get Started
          </Link>
          <span className="text-xs text-muted-foreground">Free to start · no card required</span>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-5">
        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          How verification works
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="glass-card p-5">
              <s.icon className="h-6 w-6 text-gold" />
              <h3 className="mt-4 text-base">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-3xl px-5 pb-20">
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-muted-foreground">Top Trust Scores today</p>
          <ul className="mt-4 divide-y divide-border">
            {astrologers.slice(0, 3).map((a, i) => (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <span className="w-5 text-sm font-bold text-muted-foreground">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.specialty}</p>
                </div>
                <TrustScore score={a.trustScore} size="sm" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
