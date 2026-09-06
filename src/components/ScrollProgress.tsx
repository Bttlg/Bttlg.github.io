"use client";

import { useEffect, useRef } from "react";

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
 * `scroll`/`resize`, coalesced to one measurement per animation frame. The
 * transform is written straight to the DOM from that frame (as Spotlight
 * does) rather than through state, so scrolling never re-renders anything.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const schedule = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const node = ref.current;
        if (node) node.style.transform = `scaleX(${computeProgress()})`;
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
      ref={ref}
      aria-hidden="true"
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent print:hidden"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
