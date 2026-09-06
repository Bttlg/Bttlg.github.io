/** Milliseconds added per item to a staggered reveal group. */
export const STAGGER_STEP_MS = 50;
/** Upper bound so long lists don't keep the last items waiting. */
export const STAGGER_MAX_MS = 250;

/** Transition delay for the `index`-th item of a staggered reveal group. */
export function staggerDelay(index: number): number {
  return Math.min(Math.max(0, index) * STAGGER_STEP_MS, STAGGER_MAX_MS);
}
