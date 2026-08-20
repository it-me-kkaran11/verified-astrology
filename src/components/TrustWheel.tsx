import { VerifiedBadge } from "@/components/VerifiedBadge";
import { cn } from "@/lib/utils";

/**
 * Trust score rendered as a birth-chart ring: degree markings around the
 * circumference, a gold arc sweeping the score, and the numeral in mono.
 */
export function TrustWheel({
  score,
  size = 188,
  className,
  caption,
}: {
  score: number;
  size?: number;
  className?: string;
  caption?: string;
}) {
  const c = 100;
  const r = 78;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Trust score ${score} percent`}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-secondary" />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="text-gold"
          strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
        />
        {/* degree markings */}
        <g stroke="currentColor" className="text-gold-soft" opacity="0.5">
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i * 5) * (Math.PI / 180);
            const major = i % 6 === 0;
            const r1 = r - 8;
            const r2 = r1 - (major ? 9 : 4);
            return (
              <line
                key={i}
                x1={c + r1 * Math.cos(a)}
                y1={c + r1 * Math.sin(a)}
                x2={c + r2 * Math.cos(a)}
                y2={c + r2 * Math.sin(a)}
                strokeWidth={major ? 1.1 : 0.5}
              />
            );
          })}
        </g>
        {/* inner house lines */}
        <g stroke="currentColor" className="text-primary-glow" opacity="0.3" strokeWidth="0.6">
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30) * (Math.PI / 180);
            return (
              <line key={i} x1={c} y1={c} x2={c + (r - 22) * Math.cos(a)} y2={c + (r - 22) * Math.sin(a)} />
            );
          })}
          <circle cx={c} cy={c} r={r - 22} fill="none" />
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <VerifiedBadge size="sm" />
        <span className="numeral text-2xl font-bold text-gold-gradient">{score.toFixed(1)}%</span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {caption ?? "trust score"}
        </span>
      </div>
    </div>
  );
}
