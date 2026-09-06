import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Experience, sortExperience } from "./Experience";
import { experience } from "@/content";
import type { Experience as ExperienceEntry } from "@/content";
import { staggerDelay } from "@/lib/stagger";

function mk(id: string, from: string, to: string | null): ExperienceEntry {
  return {
    id,
    company: { mn: id, en: id },
    role: { mn: "r", en: "r" },
    period: { from, to },
    summary: { mn: "s", en: "s" },
    highlights: { mn: [], en: [] },
    stack: [],
  };
}

describe("sortExperience", () => {
  it("puts current roles first (latest start first), then finished roles (latest end first)", () => {
    const list = [
      mk("a", "2021-03", "2025-10"),
      mk("b", "2023-03", null),
      mk("c", "2024-09", null),
      mk("d", "2021-10", "2026-08"),
    ];
    expect(sortExperience(list).map((e) => e.id)).toEqual(["c", "b", "d", "a"]);
  });
});

describe("Experience", () => {
  it("renders the newest current role first in the timeline", () => {
    render(<Experience lang="en" />);
    const sorted = sortExperience(experience);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent(sorted[0].company.en);
  });

  it("wraps each timeline entry in a staggered Reveal that carries its own marker", () => {
    const { container } = render(<Experience lang="en" />);
    const sorted = sortExperience(experience);
    const entries = Array.from(container.querySelectorAll<HTMLLIElement>("#experience ol > li"));
    expect(entries).toHaveLength(sorted.length);

    entries.forEach((entry, index) => {
      const reveal = entry.querySelector<HTMLElement>(":scope > .reveal");
      expect(reveal).not.toBeNull();
      const delay = staggerDelay(index);
      expect(reveal!.style.transitionDelay).toBe(delay > 0 ? `${delay}ms` : "");

      const dot = reveal!.querySelector(".timeline-dot");
      expect(dot).not.toBeNull();
      // The marker's scale-in (`.reveal.is-visible > .timeline-dot` in
      // globals.css) keys off the entry's own Reveal with a child combinator,
      // so the marker must stay a direct child of that Reveal — not merely a
      // descendant of the Section's outer one, which is visible long before
      // the entries below the fold are.
      expect(dot!.parentElement).toBe(reveal);
      expect(dot).toHaveAttribute("aria-hidden", "true");
      if (sorted[index].period.to === null) {
        expect(dot).toHaveClass("animate-pulse-ring");
      } else {
        expect(dot).not.toHaveClass("animate-pulse-ring");
      }
    });
  });
});
