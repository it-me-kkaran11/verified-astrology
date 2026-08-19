import { cn } from "@/lib/utils";

/**
 * Hand-plotted constellation icon set — dots joined by thin lines.
 * Single source of truth: never substitute a filled icon-library glyph.
 */

export type ConstellationIconProps = {
  className?: string;
  strokeWidth?: number;
};

type Plot = {
  points: [number, number][];
  /** index pairs joined by a thin line */
  lines: [number, number][];
};

const PLOTS = {
  home: {
    points: [
      [12, 3.2],
      [4.2, 9.4],
      [19.8, 9.4],
      [6.6, 20],
      [17.4, 20],
      [12, 14.4],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 5],
    ],
  },
  leaderboard: {
    points: [
      [4, 19.4],
      [4, 12.6],
      [12, 19.4],
      [12, 6.6],
      [20, 19.4],
      [20, 3.4],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [2, 3],
      [2, 4],
      [4, 5],
      [1, 3],
      [3, 5],
    ],
  },
  chat: {
    points: [
      [4.4, 6.4],
      [19.6, 6.4],
      [19.6, 15.2],
      [8.6, 15.2],
      [6, 20.2],
      [4.4, 15.2],
      [12, 10.8],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [0, 6],
      [6, 2],
    ],
  },
  profile: {
    points: [
      [12, 4.2],
      [8.2, 8.2],
      [15.8, 8.2],
      [12, 12.2],
      [4.6, 19.8],
      [19.4, 19.8],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 5],
    ],
  },
  pricing: {
    points: [
      [4.4, 8],
      [19.6, 8],
      [19.6, 17],
      [4.4, 17],
      [9.2, 12.5],
      [15.4, 12.5],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 4],
      [4, 5],
      [5, 1],
      [4, 3],
    ],
  },
  circles: {
    points: [
      [12, 3.6],
      [19, 8],
      [19.4, 16],
      [12, 20.4],
      [4.6, 16],
      [5, 8],
      [12, 12],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [0, 6],
      [2, 6],
      [4, 6],
    ],
  },
  verified: {
    points: [
      [12, 3],
      [19.5, 7.5],
      [19.5, 16.5],
      [12, 21],
      [4.5, 16.5],
      [4.5, 7.5],
      [8.6, 12.4],
      [11, 15],
      [16, 9.4],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [6, 7],
      [7, 8],
    ],
  },
  streak: {
    points: [
      [12, 3.4],
      [16.4, 9],
      [12, 12.4],
      [7.6, 15.8],
      [12, 20.6],
      [17.2, 15.4],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 2],
    ],
  },
  yes: {
    points: [
      [4.6, 12.6],
      [10, 18],
      [19.4, 6.4],
    ],
    lines: [
      [0, 1],
      [1, 2],
    ],
  },
  no: {
    points: [
      [6, 6],
      [18, 18],
      [18, 6],
      [6, 18],
    ],
    lines: [
      [0, 1],
      [2, 3],
    ],
  },
  clock: {
    points: [
      [12, 3.6],
      [20.4, 12],
      [12, 20.4],
      [3.6, 12],
      [12, 12],
      [12, 7.6],
      [15.6, 13.6],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [4, 6],
    ],
  },
  send: {
    points: [
      [3.6, 12],
      [20.4, 4.2],
      [13.4, 20.4],
      [11, 12.8],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ],
  },
  back: {
    points: [
      [20, 12],
      [5, 12],
      [10.4, 6.6],
      [10.4, 17.4],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
  },
  spark: {
    points: [
      [12, 3.4],
      [12, 20.6],
      [3.4, 12],
      [20.6, 12],
      [6.6, 6.6],
      [17.4, 17.4],
    ],
    lines: [
      [0, 1],
      [2, 3],
      [4, 5],
    ],
  },
  resonate: {
    points: [
      [12, 12],
      [12, 4.4],
      [18.6, 8.2],
      [18.6, 15.8],
      [12, 19.6],
      [5.4, 15.8],
      [5.4, 8.2],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
    ],
  },
  trend: {
    points: [
      [4, 18],
      [9.4, 12.6],
      [13.6, 15],
      [20, 6.4],
      [20, 11],
      [15.4, 6.4],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [3, 5],
    ],
  },
} satisfies Record<string, Plot>;

export type ConstellationIconName = keyof typeof PLOTS;

export function ConstellationIcon({
  name,
  className,
  strokeWidth = 0.9,
}: ConstellationIconProps & { name: ConstellationIconName }) {
  const plot: Plot = PLOTS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
    >
      <g strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.72">
        {plot.lines.map(([a, b], i) => (
          <line
            key={i}
            x1={plot.points[a]![0]}
            y1={plot.points[a]![1]}
            x2={plot.points[b]![0]}
            y2={plot.points[b]![1]}
          />
        ))}
      </g>
      <g fill="currentColor" stroke="none">
        {plot.points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 1.15 : 0.85} />
        ))}
      </g>
    </svg>
  );
}

export const iconFor = (name: ConstellationIconName) =>
  function Icon({ className }: { className?: string }) {
    return <ConstellationIcon name={name} className={className} />;
  };
