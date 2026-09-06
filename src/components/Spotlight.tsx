"use client";

import { useEffect, useRef, useState } from "react";

/** Off-screen position: the 600px-radius glow is fully outside the viewport. */
const PARKED = -1000;

/**
 * Soft accent-tinted glow that follows the pointer. Only enabled for devices
 * with a fine, hover-capable pointer and no reduced-motion preference —
 * both are unknown during SSR, so the layer renders parked off-screen and
 * a mount-only effect decides whether to keep it. It keeps watching both
 * media queries and tears itself down if either flips while the page is
 * open (globals.css hides `.spotlight` under the same queries as a backstop),
 * and parks the glow off-screen again whenever the pointer leaves the window.
 *
 * The glow is a pre-painted child moved with a transform written straight
 * to the element (never a CSS variable on the layer, which would recalc
 * styles), so following the pointer is compositor-only.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const unsuitable = () => reducedMotion.matches || !finePointer.matches;
    if (unsuitable()) {
      // Mount-driven decision gated on browser-only APIs (matchMedia isn't
      // available during SSR) — can't be computed at render time without
      // diverging from the server-rendered markup.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(true);
      return;
    }

    let frame: number | null = null;
    let x = PARKED;
    let y = PARKED;

    const flush = () => {
      frame = null;
      const node = ref.current;
      if (!node) return;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(flush);
    };

    const onPointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      schedule();
    };

    // The pointer left the window: don't leave the glow stranded at an edge.
    const park = () => {
      x = PARKED;
      y = PARKED;
      schedule();
    };

    function stop() {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", park);
      reducedMotion.removeEventListener("change", onMediaChange);
      finePointer.removeEventListener("change", onMediaChange);
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    }

    function onMediaChange() {
      if (!unsuitable()) return;
      stop();
      setHidden(true);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", park);
    reducedMotion.addEventListener("change", onMediaChange);
    finePointer.addEventListener("change", onMediaChange);
    return stop;
  }, []);

  if (hidden) return null;

  return (
    <div aria-hidden="true" className="spotlight pointer-events-none fixed inset-0 print:hidden">
      <div ref={ref} className="spotlight-glow" style={{ transform: `translate3d(${PARKED}px, ${PARKED}px, 0)` }} />
    </div>
  );
}
