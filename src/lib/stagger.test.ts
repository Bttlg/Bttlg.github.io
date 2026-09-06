import { describe, it, expect } from "vitest";
import { STAGGER_MAX_MS, STAGGER_STEP_MS, staggerDelay } from "./stagger";

describe("staggerDelay", () => {
  it("is zero for the first item", () => {
    expect(staggerDelay(0)).toBe(0);
  });

  it("grows by one step per item", () => {
    expect(staggerDelay(1)).toBe(STAGGER_STEP_MS);
    expect(staggerDelay(3)).toBe(3 * STAGGER_STEP_MS);
  });

  it("caps at the maximum so long lists don't stall", () => {
    expect(staggerDelay(5)).toBe(STAGGER_MAX_MS);
    expect(staggerDelay(50)).toBe(STAGGER_MAX_MS);
  });

  it("never goes negative", () => {
    expect(staggerDelay(-2)).toBe(0);
  });

  it("uses a step of 50ms capped at 250ms", () => {
    expect(STAGGER_STEP_MS).toBe(50);
    expect(STAGGER_MAX_MS).toBe(250);
  });
});
