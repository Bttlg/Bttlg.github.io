import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Experience, sortExperience } from "./Experience";
import { experience } from "@/content";
import type { Experience as ExperienceEntry } from "@/content";

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

  it("eases the company link's colour hover", () => {
    const { container } = render(<Experience lang="en" />);
    const links = container.querySelectorAll("h3 > a[href]");
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) expect(link).toHaveClass("transition-colors");
  });

  it("sets each entry's summary in the prose tier and its stack chips on the 8px gap", () => {
    const { container } = render(<Experience lang="en" />);
    const sorted = sortExperience(experience);
    const entries = Array.from(container.querySelectorAll<HTMLLIElement>("#experience ol > li"));
    entries.forEach((entry, index) => {
      const summary = entry.querySelector("p.leading-relaxed");
      expect(summary).toHaveTextContent(sorted[index].summary.en);
      expect(summary).toHaveClass("text-fg-soft");
      expect(entry.querySelector("h3")).toHaveClass("leading-snug");
      expect(entry.querySelector("h3")).toHaveClass("tracking-[-0.01em]");
      if (sorted[index].stack.length > 0) {
        const chip = entry.querySelector("h3 ~ div > span");
        expect(chip).not.toBeNull();
        expect(chip!.parentElement).toHaveClass("gap-2");
        expect(chip!.parentElement).not.toHaveClass("gap-1.5");
      }
    });
  });

  it("wraps each timeline entry in its own unstaggered Reveal that carries its own marker", () => {
    const { container } = render(<Experience lang="en" />);
    const sorted = sortExperience(experience);
    const entries = Array.from(container.querySelectorAll<HTMLLIElement>("#experience ol > li"));
    expect(entries).toHaveLength(sorted.length);

    entries.forEach((entry, index) => {
      const reveal = entry.querySelector<HTMLElement>(":scope > .reveal");
      expect(reveal).not.toBeNull();
      // Entries are taller than a stagger step and cross the trigger line one
      // at a time, so a per-index delay would only make later ones feel late.
      expect(reveal!.getAttribute("style")).toBeNull();

      const dot = reveal!.querySelector(".timeline-dot");
      expect(dot).not.toBeNull();
      // The marker's materialize (`.reveal.is-visible > .timeline-dot` in
      // globals.css) keys off the entry's own Reveal with a child combinator,
      // so the marker must stay a direct child of that Reveal.
      expect(dot!.parentElement).toBe(reveal);
      expect(dot).toHaveAttribute("aria-hidden", "true");
      if (sorted[index].period.to === null) {
        expect(dot).toHaveClass("bg-accent");
      } else {
        expect(dot).toHaveClass("bg-canvas");
        expect(dot).not.toHaveClass("bg-accent");
      }
    });
  });
});
