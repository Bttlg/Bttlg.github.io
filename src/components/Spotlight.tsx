"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Soft accent-tinted glow that follows the pointer. Only enabled for devices
 * with a fine, hover-capable pointer and no reduced-motion preference —
 * both are unknown during SSR, so the layer renders parked off-screen and
 * a mount-only effect decides whether to keep it.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (prefersReducedMotion || !hasFinePointer) {
      // Mount-driven decision gated on browser-only APIs (matchMedia isn't
      // available during SSR) — can't be computed at render time without
      // diverging from the server-rendered markup.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(true);
      return;
    }

    let frame: number | null = null;
    let x = -1000;
    let y = -1000;

    const flush = () => {
      frame = null;
      const node = ref.current;
      if (!node) return;
      node.style.setProperty("--sx", `${x}px`);
      node.style.setProperty("--sy", `${y}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (frame !== null) return;
      frame = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="spotlight pointer-events-none fixed inset-0 print:hidden"
      style={{ "--sx": "-1000px", "--sy": "-1000px" } as CSSProperties}
    />
  );
}
