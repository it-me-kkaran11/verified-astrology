import { Link, useRouterState } from "@tanstack/react-router";

import {
  ConstellationIcon,
  type ConstellationIconName,
} from "@/components/icons/ConstellationIcons";
import { cn } from "@/lib/utils";

type Dest = { to: string; label: string; icon: ConstellationIconName };

export const DESTINATIONS: Dest[] = [
  { to: "/home", label: "Home", icon: "home" },
  { to: "/leaderboard", label: "Leaderboard", icon: "leaderboard" },
  { to: "/astra", label: "Astra", icon: "chat" },
  { to: "/circles", label: "Circles", icon: "circles" },
  { to: "/profile", label: "Profile", icon: "profile" },
  { to: "/pricing", label: "Pricing", icon: "pricing" },
];

/** Desktop dial geometry */
const WHEEL = 188;
const C = WHEEL / 2;
const R = 68;

const wheelPoints = DESTINATIONS.map((_, i) => {
  const a = (-90 + i * (360 / DESTINATIONS.length)) * (Math.PI / 180);
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
});

/** Mobile arc geometry: shallow arc, middle nodes ride higher */
const ARC_R = 540;
const ARC_SPREAD = 12; // degrees between nodes
const arcPoints = DESTINATIONS.map((_, i) => {
  const a = (i - (DESTINATIONS.length - 1) / 2) * ARC_SPREAD * (Math.PI / 180);
  return { x: Math.sin(a) * ARC_R, y: (1 - Math.cos(a)) * ARC_R };
});
const ARC_W = (arcPoints.at(-1)!.x - arcPoints[0]!.x) + 84;
const ARC_H = Math.max(...arcPoints.map((p) => p.y)) + 66;

export function ZodiacNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <>
      {/* Desktop / tablet: radial zodiac dial, fixed corner */}
      <div
        aria-label="Zodiac navigation"
        className="pointer-events-none fixed bottom-6 right-6 z-50 hidden md:block"
        style={{ width: WHEEL, height: WHEEL }}
      >
        <svg
          viewBox={`0 0 ${WHEEL} ${WHEEL}`}
          className="absolute inset-0 h-full w-full text-primary-glow/70"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
        >
          <circle cx={C} cy={C} r={R} strokeWidth="0.6" opacity="0.35" />
          <circle cx={C} cy={C} r={R + 14} strokeWidth="0.4" opacity="0.16" />
          <g strokeWidth="0.6" opacity="0.4">
            {wheelPoints.map((p, i) => {
              const n = wheelPoints[(i + 1) % wheelPoints.length]!;
              return <line key={i} x1={p.x} y1={p.y} x2={n.x} y2={n.y} />;
            })}
            {wheelPoints.map((p, i) => (
              <line key={`s${i}`} x1={C} y1={C} x2={p.x} y2={p.y} opacity="0.4" />
            ))}
          </g>
          {/* degree markings */}
          <g strokeWidth="0.5" opacity="0.28">
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i * 10 - 90) * (Math.PI / 180);
              const r1 = R + 14;
              const r2 = r1 - (i % 3 === 0 ? 6 : 3);
              return (
                <line
                  key={i}
                  x1={C + r1 * Math.cos(a)}
                  y1={C + r1 * Math.sin(a)}
                  x2={C + r2 * Math.cos(a)}
                  y2={C + r2 * Math.sin(a)}
                />
              );
            })}
          </g>
        </svg>

        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 numeral text-[10px] uppercase tracking-[0.18em] text-gold-soft/80">
          ✦
        </span>

        {DESTINATIONS.map((d, i) => {
          const p = wheelPoints[i]!;
          const active = isActive(d.to);
          return (
            <Link
              key={d.to}
              to={d.to}
              title={d.label}
              aria-label={d.label}
              className={cn(
                "pointer-events-auto absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
                active
                  ? "border-gold/50 bg-gold/12 text-gold shadow-[var(--shadow-gold-glow)] scale-110"
                  : "border-border/70 bg-background/55 text-muted-foreground hover:border-primary-glow/60 hover:text-foreground",
              )}
              style={{ left: p.x, top: p.y }}
            >
              <ConstellationIcon name={d.icon} className="h-5 w-5" />
            </Link>
          );
        })}

        <span className="absolute -left-2 bottom-0 -translate-x-full whitespace-nowrap rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-md">
          {DESTINATIONS.find((d) => isActive(d.to))?.label ?? "AstroLive"}
        </span>
      </div>

      {/* Mobile: the same dial collapsed into a horizontal arc */}
      <div
        aria-label="Zodiac navigation"
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden"
        style={{ width: ARC_W, height: ARC_H, maxWidth: "96vw" }}
      >
        <svg
          viewBox={`0 0 ${ARC_W} ${ARC_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-primary-glow/60"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
        >
          <g strokeWidth="0.8" opacity="0.5">
            {arcPoints.map((p, i) => {
              const n = arcPoints[i + 1];
              if (!n) return null;
              const off = arcPoints[0]!.x;
              return (
                <line
                  key={i}
                  x1={p.x - off + 42}
                  y1={ARC_H - 34 - p.y}
                  x2={n.x - off + 42}
                  y2={ARC_H - 34 - n.y}
                />
              );
            })}
          </g>
        </svg>

        {DESTINATIONS.map((d, i) => {
          const p = arcPoints[i]!;
          const off = arcPoints[0]!.x;
          const active = isActive(d.to);
          return (
            <Link
              key={d.to}
              to={d.to}
              aria-label={d.label}
              className={cn(
                "absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
                active
                  ? "border-gold/50 bg-gold/14 text-gold shadow-[var(--shadow-gold-glow)] scale-110"
                  : "border-border/70 bg-background/70 text-muted-foreground",
              )}
              style={{ left: p.x - off + 42, top: ARC_H - 34 - p.y }}
            >
              <ConstellationIcon name={d.icon} className="h-[18px] w-[18px]" />
            </Link>
          );
        })}
        <span className="absolute inset-x-0 bottom-0 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-soft/85">
          {DESTINATIONS.find((d) => isActive(d.to))?.label ?? "AstroLive"}
        </span>
      </div>
    </>
  );
}
