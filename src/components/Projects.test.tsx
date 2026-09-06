import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Projects, sortFeaturedFirst } from "./Projects";
import { projects, ui, type Project } from "@/content";
import { staggerDelay } from "@/lib/stagger";

describe("sortFeaturedFirst", () => {
  it("puts featured first and keeps original order otherwise", () => {
    const mk = (slug: string, featured: boolean): Project => ({
      slug,
      name: { mn: slug, en: slug },
      kind: "work",
      role: { mn: "r", en: "r" },
      period: { from: "2024-01", to: null },
      summary: { mn: "s", en: "s" },
      highlights: { mn: [], en: [] },
      stack: [],
      featured,
    });
    const sorted = sortFeaturedFirst([mk("a", false), mk("b", true), mk("c", false), mk("d", true)]);
    expect(sorted.map((p) => p.slug)).toEqual(["b", "d", "a", "c"]);
  });
});

describe("Projects", () => {
  it("splits work and personal projects into two groups", () => {
    render(<Projects lang="en" />);
    const work = screen.getByRole("region", { name: ui.en.sections.work });
    const personal = screen.getByRole("region", { name: ui.en.sections.personal });
    expect(within(work).getAllByRole("article")).toHaveLength(projects.filter((p) => p.kind === "work").length);
    expect(within(personal).getAllByRole("article")).toHaveLength(
      projects.filter((p) => p.kind === "personal").length,
    );
  });

  it("wraps each card in its own Reveal, staggered by position within its group", () => {
    render(<Projects lang="en" />);
    for (const name of [ui.en.sections.work, ui.en.sections.personal]) {
      const group = screen.getByRole("region", { name });
      // The group heading gets its own (unstaggered) Reveal so it doesn't
      // wait on, or contain, the cards' staggered reveals.
      const headingReveal = within(group).getByRole("heading", { name }).closest(".reveal") as HTMLElement;
      expect(headingReveal).not.toBeNull();
      expect(headingReveal.getAttribute("style")).toBeNull();
      const cards = within(group).getAllByRole("article");
      for (const card of cards) expect(headingReveal).not.toContainElement(card);
      cards.forEach((card, index) => {
        const reveal = card.parentElement as HTMLElement;
        expect(reveal).toHaveClass("reveal");
        expect(reveal).toHaveClass("h-full");
        const delay = staggerDelay(index);
        expect(reveal.style.transitionDelay).toBe(delay > 0 ? `${delay}ms` : "");
      });
    }
  });
});
