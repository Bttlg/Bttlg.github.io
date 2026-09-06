"use client";

import { useEffect, useRef, useState } from "react";

/** Fraction of the page scrolled, in [0, 1]; 0 when the page isn't scrollable. */
function computeProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

/**
 * Thin bar fixed to the top of the viewport that fills left-to-right as the
 * page is scrolled. `scrollY`/`scrollHeight`/`innerHeight` aren't available
 * during SSR, so the bar starts at `scaleX(0)` and measures once mounted
 * (a restored scroll position or hash link lands mid-page), then again on
 * `scroll`/`resize`, coalesced to one measurement per animation frame.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const schedule = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        setProgress(computeProgress());
      });
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="scroll-progress fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent print:hidden"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
