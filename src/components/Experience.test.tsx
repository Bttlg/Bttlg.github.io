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
});
