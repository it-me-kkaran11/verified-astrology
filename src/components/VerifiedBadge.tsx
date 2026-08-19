import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

/**
 * Gold constellation-seal used next to every trust score and verified prediction:
 * a plotted star-ring with a check drawn as three joined stars.
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
      <svg
        viewBox="0 0 24 24"
        className={cn(sizes[size], "text-gold")}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
      >
        <g strokeWidth="0.9" strokeLinecap="round" opacity="0.75">
          <path d="M12 2.6 19.1 6.8 19.4 15.1 12 21.4 4.6 15.1 4.9 6.8Z" />
          <path d="M8.4 12.5 11 15.2 16.1 9.4" strokeWidth="1.3" opacity="1" />
        </g>
        <g fill="currentColor" stroke="none">
          <circle cx="12" cy="2.6" r="1.2" />
          <circle cx="19.1" cy="6.8" r="0.9" />
          <circle cx="19.4" cy="15.1" r="0.9" />
          <circle cx="12" cy="21.4" r="0.9" />
          <circle cx="4.6" cy="15.1" r="0.9" />
          <circle cx="4.9" cy="6.8" r="0.9" />
          <circle cx="8.4" cy="12.5" r="1.1" />
          <circle cx="11" cy="15.2" r="1.1" />
          <circle cx="16.1" cy="9.4" r="1.1" />
        </g>
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
      <span className={cn("numeral font-bold text-gold-gradient", text)}>{score}</span>
    </span>
  );
}
