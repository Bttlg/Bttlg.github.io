"use client";

import { useEffect, useState } from "react";

/**
 * Types `text` out one character at a time on mount. SSR (and reduced
 * motion) render the full text immediately, so there is no hydration
 * mismatch and no motion for users who asked not to have it.
 *
 * The static export ships the full prompt in the HTML; `data-ready` is only
 * set once the effect has decided what to show, and globals.css keeps the
 * span invisible until then (unless JS is off), so the full text never
 * flashes before being cleared and retyped.
 */
export function Typewriter({
  text,
  speedMs = 70,
  className = "",
}: {
  text: string;
  speedMs?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState(text);
  // Whether JS has taken over the animation (i.e. motion is allowed). Once
  // true, a blinking cursor stays visible like a live terminal prompt, even
  // after the text has finished typing out.
  const [animating, setAnimating] = useState(false);
  // Whether the effect has taken ownership of what is displayed.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // One-time, mount-driven decision gated on a browser-only API
      // (matchMedia isn't available during SSR): this can't be computed at
      // render time without diverging from the server-rendered markup, so
      // it has to happen here rather than in a lazy `useState` initializer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      setDisplayed(text);
      setAnimating(false);
      return;
    }

    setReady(true);
    setDisplayed("");
    setAnimating(true);
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function tick() {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        timers.push(setTimeout(tick, speedMs));
      }
    }
    timers.push(setTimeout(tick, speedMs));

    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, [text, speedMs]);

  return (
    <span aria-label={text} className={className} data-typewriter="" data-ready={ready || undefined}>
      <span aria-hidden="true" data-testid="typewriter-text">
        {displayed}
      </span>
      {animating && (
        <span aria-hidden="true" className="cursor-blink">
          ▍
        </span>
      )}
    </span>
  );
}
