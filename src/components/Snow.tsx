import type { CSSProperties } from "react";

/** Deterministic 0..1 so server and client render identical flakes. */
function pseudoRandom(i: number): number {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

export const SNOW_FLAKE_COUNT = 24;

/**
 * Purely decorative falling snowflakes, fixed over the whole viewport. Sits
 * above the body's dotted-grid background and below all page content (see
 * `.snow-layer`'s negative z-index in globals.css). Hidden under reduced
 * motion and in print.
 */
export function Snow({ count = SNOW_FLAKE_COUNT }: { count?: number }) {
  const flakes = Array.from({ length: count }, (_, i) => {
    const r = pseudoRandom(i);
    return {
      key: i,
      left: `${(i * 37 + r * 13) % 100}%`,
      size: `${2 + r * 2}px`,
      dur: `${12 + r * 12}s`,
      delay: `-${r * 12}s`,
      // Faint: 0.25–0.5, so the flakes never compete with the content.
      opacity: `${0.25 + r * 0.25}`,
    };
  });

  return (
    <div aria-hidden="true" className="snow-layer pointer-events-none fixed inset-0 overflow-hidden print:hidden">
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
