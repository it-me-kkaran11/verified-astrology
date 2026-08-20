import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { ScoreComposer } from "@/components/ScoreComposer";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { ConstellationIcon } from "@/components/icons/ConstellationIcons";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  circleFeedQuery,
  groupIntoCircles,
  scoreBand,
  toggleResonance,
  type Circle,
  type CirclePost,
} from "@/lib/circles";
import { initials } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/circles")({
  head: () => ({
    meta: [
      { title: "Cosmic Circles — AstroLive Verified" },
      {
        name: "description",
        content:
          "Share today's score and get grouped with everyone who landed on the same number — a night sky of score clusters.",
      },
      { property: "og:title", content: "Cosmic Circles — AstroLive Verified" },
      {
        property: "og:description",
        content: "Find the people who scored exactly what you scored today.",
      },
    ],
  }),
  component: CirclesPage,
});

/** Cluster of avatar dots joined by thin constellation lines. */
function DotCluster({ count, tone }: { count: number; tone: string }) {
  const n = Math.min(9, Math.max(2, count));
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (-90 + i * (360 / n)) * (Math.PI / 180);
    const r = i % 2 === 0 ? 26 : 18;
    return { x: 32 + r * Math.cos(a), y: 32 + r * Math.sin(a) };
  });
  return (
    <svg viewBox="0 0 64 64" className={`h-16 w-16 shrink-0 ${tone}`} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.6" opacity="0.55" fill="none">
        {pts.map((p, i) => {
          const q = pts[(i + 1) % pts.length]!;
          return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />;
        })}
      </g>
      <g fill="currentColor">
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === 0 ? 2.6 : 2} />
        ))}
      </g>
    </svg>
  );
}

function CirclesPage() {
  const { user } = useSessionUser();
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading } = useQuery(circleFeedQuery(user?.id));
  const [expanded, setExpanded] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);

  const circles = groupIntoCircles(posts);
  const myPost = posts.find((p) => p.user_id === user?.id);
  const myCircle = myPost ? circles.find((c) => c.score === myPost.score_value) : undefined;

  const resonate = useMutation({
    mutationFn: async (p: CirclePost) => {
      if (!user) throw new Error("Sign in to resonate.");
      await toggleResonance(p.id, user.id, !p.resonated);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["circle-feed"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const renderPost = (p: CirclePost) => {
    const band = scoreBand(p.score_value);
    return (
      <li key={p.id} className="flex items-start gap-3 py-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${band.tint}`}
        >
          {initials(p.author)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-semibold">{p.author}</span>{" "}
            <span className={`numeral ${band.text}`}>{p.score_value}</span>
          </p>
          {p.caption ? (
            <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{p.caption}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => resonate.mutate(p)}
          aria-label={p.resonated ? "Remove resonance" : "Resonate"}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
            p.resonated
              ? "border-gold/50 bg-gold/12 text-gold"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <ConstellationIcon name="resonate" className="h-3.5 w-3.5" />
          <span className="numeral">{p.resonances}</span>
        </button>
      </li>
    );
  };

  const renderCircle = (c: Circle, pinned = false) => {
    const band = scoreBand(c.score);
    const open = pinned || expanded === c.score;
    return (
      <div
        key={`${pinned ? "pin" : "c"}-${c.score}`}
        className={`glass-card border p-5 ${band.ring} ${band.glow}`}
      >
        <button
          type="button"
          onClick={() => setExpanded(open && !pinned ? null : c.score)}
          className="flex w-full items-center gap-4 text-left"
        >
          <DotCluster count={c.posts.length} tone={band.text} />
          <div className="min-w-0 flex-1">
            <p className="display-title text-xl">
              {pinned ? "Your Circle" : "The"}{" "}
              <span className={`numeral ${band.text}`}>{c.score}</span>{" "}
              {pinned ? "" : "Circle"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {pinned ? (
                <>
                  You match with{" "}
                  <span className="numeral">{Math.max(0, c.posts.length - 1)}</span> others today
                </>
              ) : (
                <>
                  <span className="numeral">{c.posts.length}</span>{" "}
                  {c.posts.length === 1 ? "person" : "people"} today · {band.label}
                </>
              )}
            </p>
          </div>
          {pinned ? <VerifiedBadge size="sm" /> : null}
        </button>

        {open ? <ul className="mt-2 divide-y divide-border">{c.posts.map(renderPost)}</ul> : null}
      </div>
    );
  };

  return (
    <AppShell
      title="Cosmic Circles"
      subtitle="Grouped by the exact score you landed on today"
    >
      <div className="mx-auto max-w-2xl space-y-4">
        <button
          type="button"
          onClick={() => setComposing(true)}
          className="glass-card flex w-full items-center gap-3 p-4 text-left"
        >
          <ConstellationIcon name="spark" className="h-5 w-5 text-gold" />
          <span className="text-sm font-semibold">Share your score</span>
          <span className="ml-auto text-xs text-muted-foreground">opens composer</span>
        </button>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="glass-card h-24 animate-pulse" />
            ))}
          </div>
        ) : null}

        {myCircle ? renderCircle(myCircle, true) : null}

        {!isLoading && circles.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="display-title text-2xl">The sky is empty tonight</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Be the first light — share a score and a circle forms around your number.
            </p>
          </div>
        ) : null}

        {circles
          .filter((c) => c.score !== myCircle?.score)
          .map((c) => renderCircle(c))}
      </div>

      {composing && user ? (
        <ScoreComposer
          userId={user.id}
          score={myPost?.score_value ?? 70}
          scoreType="daily_energy"
          onClose={() => setComposing(false)}
        />
      ) : null}
    </AppShell>
  );
}
