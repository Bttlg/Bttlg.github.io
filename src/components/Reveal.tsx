"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Fades and slides its children in once they scroll into view. The entrance
 * is CSS (`.reveal` in globals.css); this only toggles `is-visible`.
 *
 * Reduced motion is handled in CSS as well (the rise goes, a shorter opacity
 * fade stays), so the observer runs regardless of the preference. Keyboard
 * focus landing inside a not-yet-revealed element reveals it instantly
 * (`is-instant`: no transition, no stagger delay), since keyboard-initiated
 * actions must never animate. Without `IntersectionObserver` the content
 * shows immediately.
 */
export function Reveal({
  children,
  className = "",
  delay,
}: {
  children: ReactNode;
  className?: string;
  /**
   * Extra transition delay in milliseconds (staggered lists), applied only
   * when > 0. Also exposed as `--reveal-delay` so descendants (the timeline
   * marker) can time their own transitions after the entry's.
   */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"hidden" | "visible" | "instant">("hidden");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      // Mount-driven decision gated on a browser-only API (not available
      // during SSR) — it can't be computed at render time without diverging
      // from the server-rendered markup, so it has to happen here rather
      // than in a lazy `useState` initializer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("visible");
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState((current) => (current === "hidden" ? "visible" : current));
            observer.unobserve(entry.target);
          }
        }
      },
      // threshold 0: every element starts when its top edge crosses the same
      // line, independent of its own height.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);

    // Keyboard focus can land inside a not-yet-revealed element: a Tab that
    // scrolls a link into view by its nearest edge can leave less of the
    // element inside the root than the threshold/rootMargin ask for, and
    // the focused control would stay invisible. Reveal on focus as well —
    // instantly, so the control and its focus ring are never hidden behind
    // the transition or a stagger delay.
    const onFocus = () => {
      setState("instant");
      observer.disconnect();
    };
    node.addEventListener("focusin", onFocus, { once: true });

    return () => {
      observer.disconnect();
      node.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${state !== "hidden" ? "is-visible" : ""} ${state === "instant" ? "is-instant" : ""} ${className}`}
      style={
        delay && delay > 0
          ? ({ transitionDelay: `${delay}ms`, "--reveal-delay": `${delay}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
