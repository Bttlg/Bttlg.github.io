import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skills } from "./Skills";
import { skills, ui } from "@/content";
import { staggerDelay } from "@/lib/stagger";

describe("Skills", () => {
  it("lists every skill group with its label and items", () => {
    render(<Skills lang="en" />);
    expect(screen.getByRole("heading", { name: ui.en.sections.skills })).toBeInTheDocument();
    for (const group of skills) {
      expect(screen.getByText(group.label.en)).toBeInTheDocument();
      for (const item of group.items) {
        expect(screen.getAllByText(item).length).toBeGreaterThan(0);
      }
    }
  });

  it("makes each group its own staggered Reveal row directly inside the description list", () => {
    const { container } = render(<Skills lang="en" />);
    const rows = Array.from(container.querySelectorAll<HTMLElement>("dl > .reveal"));
    expect(rows).toHaveLength(skills.length);
    rows.forEach((row, index) => {
      // Valid <dl> markup: the group row directly contains its <dt>/<dd>.
      expect(row.querySelector(":scope > dt")).toHaveTextContent(skills[index].label.en);
      expect(row.querySelector(":scope > dd")).not.toBeNull();
      const delay = staggerDelay(index);
      expect(row.style.transitionDelay).toBe(delay > 0 ? `${delay}ms` : "");
    });
  });
});
