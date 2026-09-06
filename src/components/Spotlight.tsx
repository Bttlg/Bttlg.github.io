"use client";

import { useEffect, useRef, useState } from "react";

/** Off-screen starting position: the 600px-radius glow is fully outside the viewport until the pointer first moves. */
const PARKED = -1000;

/**
 * Soft accent-tinted glow that follows the pointer. Only enabled for devices
 * with a fine, hover-capable pointer and no reduced-motion preference —
 * both are unknown during SSR, so the layer renders hidden (opacity 0, parked
 * off-screen) and a mount-only effect decides whether to keep it. It keeps
 * watching both media queries and tears itself down if either flips while
 * the page is open (globals.css hides `.spotlight` under the same queries as
 * a backstop).
 *
 * The glow is a pre-painted child moved with a transform written straight
 * to the element (never a CSS variable on the layer, which would recalc
 * styles), so following the pointer is compositor-only. When the pointer
 * leaves the window the glow fades out where it is rather than sweeping
 * off-screen, and when it arrives (first move, or re-entry) it lands at the
 * pointer without a transition and fades in there — a glow that is simply
 * present, never one that comes from somewhere.
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
    // Whether the pointer is currently outside the window (or hasn't moved yet).
    let parked = true;
    // Whether the DOM currently shows the glow (opacity 1).
    let shown = false;

    const flush = () => {
      frame = null;
      const node = ref.current;
      if (!node) return;
      if (parked) {
        // Fade out in place: the glow stays where the pointer left.
        node.style.opacity = "0";
        shown = false;
        return;
      }
      if (!shown) {
        // Arriving: land at the pointer with no transition (commit the snap
        // with a forced style flush before the transition comes back), then
        // let only the opacity ease in.
        node.style.transition = "none";
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        void node.offsetWidth;
        node.style.transition = "";
        node.style.opacity = "1";
        shown = true;
        return;
      }
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(flush);
    };

    const onPointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      parked = false;
      schedule();
    };

    // The pointer left the window: don't leave the glow stranded at an edge.
    const park = () => {
      parked = true;
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
      <div
        ref={ref}
        className="spotlight-glow"
        style={{ transform: `translate3d(${PARKED}px, ${PARKED}px, 0)`, opacity: 0 }}
      />
    </div>
  );
}
