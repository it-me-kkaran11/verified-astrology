import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import { createCirclePost, scoreBand, type ScoreType } from "@/lib/circles";

/**
 * Composer for sharing a score into Cosmic Circles.
 * Pre-fills the caption from the score the user just earned.
 */
export function ScoreComposer({
  userId,
  score,
  scoreType,
  onClose,
}: {
  userId: string;
  score: number;
  scoreType: ScoreType;
  onClose: () => void;
}) {
  const value = Math.round(score);
  const band = scoreBand(value);
  const [caption, setCaption] = useState(`I scored ${value} today ✦`);
  const queryClient = useQueryClient();

  const post = useMutation({
    mutationFn: () =>
      createCirclePost({ userId, scoreType, scoreValue: value, caption }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["circle-feed"] });
      toast.success(`Posted to the ${value} Circle`);
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Share your score"
    >
      <div className={`glass-card w-full max-w-sm border p-6 ${band.ring} ${band.glow}`}>
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-soft">
          <VerifiedBadge size="sm" /> Share your score
        </p>
        <p className="display-title mt-3 text-4xl">
          <span className={`numeral ${band.text}`}>{value}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {band.label} band ·{" "}
          {scoreType === "trust_confirmation" ? "trust confirmation" : "daily energy"}
        </p>
        <textarea
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          aria-label="Caption"
          className="mt-4 w-full resize-none rounded-2xl border border-border bg-secondary px-3 py-2.5 text-sm outline-none"
        />
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Not now
          </button>
          <button
            type="button"
            disabled={post.isPending}
            onClick={() => post.mutate()}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {post.isPending ? "Posting…" : "Post to circle"}
          </button>
        </div>
      </div>
    </div>
  );
}
