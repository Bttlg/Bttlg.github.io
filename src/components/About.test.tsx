import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";
import { profile, ui, experienceStart } from "@/content";

describe("About", () => {
  it("renders paragraphs and a computed years fact", () => {
    const startYear = Number(experienceStart.slice(0, 4));
    render(<About lang="mn" now={new Date(startYear + 5, 11, 31)} />);
    profile.about.mn.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument());
    expect(screen.getByText(ui.mn.about.yearsValue.replace("{n}", "5"))).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.mn.sections.about })).toBeInTheDocument();
  });
});
