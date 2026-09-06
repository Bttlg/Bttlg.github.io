"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Fades and slides its children in once they scroll into view. Skips the
 * animation (shows content immediately) when the user prefers reduced
 * motion, or when `IntersectionObserver` isn't available.
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Both branches below are one-time, mount-driven decisions gated on
    // browser-only APIs (matchMedia / IntersectionObserver aren't available
    // during SSR) — they can't be computed at render time without
    // diverging from the server-rendered markup, so they have to happen
    // here rather than in a lazy `useState` initializer.
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
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
    // the focused control would stay invisible. Reveal on focus as well.
    const onFocus = () => {
      setVisible(true);
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
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
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
