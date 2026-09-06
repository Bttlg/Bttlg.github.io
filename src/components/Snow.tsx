import type { CSSProperties } from "react";

/** Deterministic pseudo-random in [0, 1) — same output on server and client. */
function pseudoRandom(i: number): number {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

/** Purely decorative falling snowflakes behind the hero content. */
export function Snow({ count = 22 }: { count?: number }) {
  const flakes = Array.from({ length: count }, (_, i) => {
    const r = pseudoRandom(i);
    return {
      key: i,
      left: `${(i * 37 + r * 13) % 100}%`,
      size: `${2 + r * 3}px`,
      dur: `${10 + r * 10}s`,
      delay: `-${r * 12}s`,
      opacity: `${0.35 + r * 0.45}`,
    };
  });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {flakes.map((flake) => (
        <span
          key={flake.key}
          className="snowflake"
          style={
            {
              left: flake.left,
              "--size": flake.size,
              "--dur": flake.dur,
              "--delay": flake.delay,
              "--opacity": flake.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
