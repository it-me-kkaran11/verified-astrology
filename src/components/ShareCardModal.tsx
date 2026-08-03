import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { Download, X } from "lucide-react";
import { useRef, useState } from "react";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import { initials, registerShare, shareCountQuery } from "@/lib/queries";

export type ShareTarget = {
  predictionId: string;
  predictionText: string;
  astrologerName: string;
  trustScore: number;
};

export function ShareCardModal({
  target,
  onClose,
}: {
  target: ShareTarget;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data: shareCount = 0 } = useQuery(shareCountQuery(target.predictionId));

  const share = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#1A1033",
      });
      const link = document.createElement("a");
      link.download = `astrolive-verified-${target.predictionId.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();

      await registerShare(target.predictionId);
      await queryClient.invalidateQueries({ queryKey: ["share-count", target.predictionId] });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-5 py-8 backdrop-blur-sm">
      <div className="w-full max-w-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Verified — share it</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl border border-gold/30 bg-card p-6"
          style={{ background: "linear-gradient(160deg, #2D1B4E 0%, #1A1033 100%)" }}
        >
          <span className="absolute right-3 top-3 text-[10px] font-medium text-muted-foreground">
            Shared {shareCount} {shareCount === 1 ? "time" : "times"}
          </span>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/45 text-sm font-bold">
              {initials(target.astrologerName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{target.astrologerName}</p>
              <p className="text-[11px] text-muted-foreground">AstroLive Verified astrologer</p>
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed">“{target.predictionText}”</p>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
            <VerifiedBadge size="lg" label="Verified true" />
            <div>
              <p className="text-lg font-bold text-gold-gradient">Verified True</p>
              <p className="text-[11px] text-muted-foreground">Confirmed by the person it was for</p>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground">Current trust score</p>
              <p className="flex items-center gap-1.5 text-2xl font-bold tabular-nums text-gold-gradient">
                <VerifiedBadge size="sm" />
                {target.trustScore.toFixed(1)}%
              </p>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              AstroLive
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={share}
          disabled={busy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {busy ? "Preparing PNG…" : "Share as image"}
        </button>
      </div>
    </div>
  );
}
