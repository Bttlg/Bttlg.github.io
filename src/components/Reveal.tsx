"use client";

import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";

/**
 * Fades and slides its children in once they scroll into view. Skips the
 * animation (shows content immediately) when the user prefers reduced
 * motion, or when `IntersectionObserver` isn't available.
 */
export function Reveal({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const Tag = as;
  const ref = useRef<HTMLElement>(null);
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    // `Tag` is polymorphic ("div" | "section"); both resolve to a plain
    // HTMLElement at runtime for everything this component does with the
    // ref (assign `.current`, pass to `IntersectionObserver.observe`), so
    // this cast just works around JSX's per-tag ref type not distributing
    // over that union.
    <Tag ref={ref as Ref<HTMLDivElement>} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </Tag>
  );
}
