import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useSessionUser } from "@/hooks/useSessionUser";
import { mySubscriptionQuery, setSubscriptionTier, submitPartnerLead } from "@/lib/queries";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Partners — AstroLive Verified" },
      {
        name: "description",
        content:
          "Free and Verified Plus plans for readers, plus Trust Score API licensing for matrimonial platforms, astrology media and partner apps.",
      },
      { property: "og:title", content: "Pricing & Partners — AstroLive Verified" },
      {
        property: "og:description",
        content: "Leaderboard placement is earned by trust score, never bought.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

const FREE_FEATURES = [
  "Daily check-ins on assigned predictions",
  "Limited astrologer access (top 3 public profiles)",
  "Public Trust Score leaderboard, always free to read",
  "30 days of your own verification history",
];

const PLUS_FEATURES = [
  "Priority booking with the highest Trust Score astrologers",
  "Unlimited check-ins and prediction logging",
  "Ad-free across every screen",
  "Early access to new predictions before general release",
  "Full lifetime accuracy ledger, exportable",
];

function Pricing() {
  const { user, loading: loadingUser } = useSessionUser();
  const queryClient = useQueryClient();
  const { data: subscription, isLoading: loadingSub } = useQuery(mySubscriptionQuery(user?.id));
  const isPlus = subscription?.tier === "verified_plus";

  const upgrade = useMutation({
    mutationFn: async (tier: "free" | "verified_plus") => {
      if (!user) throw new Error("Sign in to change your plan.");
      return setSubscriptionTier(user.id, tier);
    },
    onSuccess: (_d, tier) => {
      void queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success(
        tier === "verified_plus" ? "You're on Verified Plus" : "Switched back to Free",
      );
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const busy = loadingUser || loadingSub;

  return (
    <AppShell title="Pricing" subtitle="Public Trust Scores stay free to read on every plan">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* SECTION 1 — readers */}
        <section>
          <h2 className="text-lg font-bold">For readers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Verification is free. Verified Plus buys depth and access, never a better score.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold">Free</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-sm text-muted-foreground"> forever</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Everything you need to hold an astrologer to their word.
              </p>
              <ul className="mt-4 space-y-2.5">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={busy || upgrade.isPending || !user || !isPlus}
                onClick={() => upgrade.mutate("free")}
                className="mt-6 w-full rounded-full border border-border bg-secondary py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
              >
                {busy ? "Checking your plan…" : !isPlus ? "Current plan" : "Downgrade to Free"}
              </button>
            </div>

            <div className="glass-card border-gold/40 p-6 gold-glow">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-gold-soft">
                <VerifiedBadge size="sm" /> Verified Plus
              </span>
              <h3 className="text-lg font-bold">Verified Plus</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold">$12</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Priority access to the astrologers whose record actually holds up.
              </p>
              <ul className="mt-4 space-y-2.5">
                {PLUS_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {user ? (
                <button
                  type="button"
                  disabled={busy || upgrade.isPending || isPlus}
                  onClick={() => upgrade.mutate("verified_plus")}
                  className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {busy
                    ? "Checking your plan…"
                    : isPlus
                      ? "Your current plan"
                      : upgrade.isPending
                        ? "Confirming…"
                        : "Subscribe to Verified Plus"}
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="mt-6 block w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground"
                >
                  Sign in to subscribe
                </Link>
              )}
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Payment is mocked in this build — no card is charged.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2 — astrologers & partners */}
        <section className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-5 md:p-7">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gold-soft">
            <VerifiedBadge size="sm" /> For astrologers &amp; partners
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gold/20 bg-background/40 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-gold" /> Ranking cannot be bought
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Leaderboard placement is derived from one number: your Trust Score, which is your
                verified predictions divided by your total resolved predictions. There is no
                promoted slot, no sponsored tier, and no way to pay for a higher position. The only
                way up is a longer record of predictions that real users confirmed as true.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Prediction volume is shown next to every score, so a small sample can't masquerade
                as a strong reputation.
              </p>
              <Link
                to="/leaderboard"
                className="mt-4 inline-block rounded-full border border-gold/30 px-4 py-2 text-xs font-semibold text-gold-soft"
              >
                See the live leaderboard
              </Link>
            </div>

            <PartnerApiTile />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function PartnerApiTile() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "" });

  const submit = useMutation({
    mutationFn: () => submitPartnerLead(form),
    onSuccess: () => {
      setSent(true);
      toast.success("Request received — we'll be in touch");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="rounded-2xl border border-gold/20 bg-background/40 p-5">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-gold" /> Trust Score API for partners
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        License the anonymised verification layer behind AstroLive: astrologer Trust Scores,
        prediction volumes and confirmation rates, delivered as a read-only API. Built for
        matrimonial platforms vetting the astrologers they recommend, astrology media citing
        accuracy instead of adjectives, and apps that want a credibility signal they didn't have to
        build. No user identities, no birth data — only aggregate verification outcomes.
      </p>

      {sent ? (
        <p className="mt-4 flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-soft">
          <VerifiedBadge size="sm" /> Thanks — your request is logged.
        </p>
      ) : open ? (
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
        >
          {(
            [
              ["name", "Your name", "text"],
              ["company", "Company", "text"],
              ["email", "Work email", "email"],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block text-xs text-muted-foreground">
              {label}
              <input
                required
                type={type}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-1.5 w-full rounded-2xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none"
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={submit.isPending}
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {submit.isPending ? "Sending…" : "Send request"}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Request access
        </button>
      )}
    </div>
  );
}
