import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

/**
 * Gold checkmark-seal used next to every trust score and verified prediction.
 * Single source of truth — do not restyle inline.
 */
export function VerifiedBadge({
  size = "md",
  className,
  label = "Verified",
}: {
  size?: Size;
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
    >
      <svg viewBox="0 0 24 24" className={cn(sizes[size], "text-gold")} aria-hidden="true">
        <circle cx="12" cy="12" r="10.5" fill="currentColor" opacity="0.16" />
        <path
          d="M12 2.2l2.4 1.5 2.8-.3 1.1 2.6 2.3 1.7-.7 2.7.7 2.7-2.3 1.7-1.1 2.6-2.8-.3L12 21.8l-2.4-1.5-2.8.3-1.1-2.6L3.4 16l.7-2.7-.7-2.7 2.3-1.7 1.1-2.6 2.8.3L12 2.2z"
          fill="currentColor"
        />
        <path
          d="M8.2 12.3l2.6 2.6 5-5.2"
          fill="none"
          stroke="oklch(0.18 0.06 300)"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function TrustScore({
  score,
  size = "md",
  className,
}: {
  score: number;
  size?: Size;
  className?: string;
}) {
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-lg";
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <VerifiedBadge size={size} label={`Verified trust score ${score}`} />
      <span className={cn("font-bold tabular-nums text-gold-gradient", text)}>{score}</span>
    </span>
  );
}
