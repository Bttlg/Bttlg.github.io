import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Projects, sortFeaturedFirst } from "./Projects";
import { projects, ui, type Project } from "@/content";

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
});
