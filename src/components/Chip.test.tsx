import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("renders its label as a quiet, non-interactive tag: no hover affordance, no border", () => {
    render(<Chip>TypeScript</Chip>);
    const chip = screen.getByText("TypeScript");
    expect(chip.tagName).toBe("SPAN");
    const classes = chip.className.split(/\s+/);
    // A span promising a hover on ~40 elements is a false affordance.
    expect(classes.filter((c) => /(^|:)hover:/.test(c))).toEqual([]);
    expect(classes.filter((c) => /(^|:)transition-/.test(c))).toEqual([]);
    expect(classes.filter((c) => /(^|:)border(-|$)/.test(c))).toEqual([]);
    expect(chip).toHaveClass("ring-inset");
  });
});
