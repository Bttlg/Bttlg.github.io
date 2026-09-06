import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";
import { profile, ui, experienceStart } from "@/content";
import { staggerDelay } from "@/lib/stagger";

describe("About", () => {
  it("renders paragraphs and a computed years fact", () => {
    const startYear = Number(experienceStart.slice(0, 4));
    render(<About lang="mn" now={new Date(startYear + 5, 11, 31)} />);
    profile.about.mn.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument());
    expect(screen.getByText(ui.mn.about.yearsValue.replace("{n}", "5"))).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.mn.sections.about })).toBeInTheDocument();
  });

  it("reveals the body in its own Reveal, one stagger step after the heading's", () => {
    render(<About lang="en" />);
    const headingReveal = screen.getByRole("heading", { name: ui.en.sections.about }).closest(".reveal");
    const bodyReveal = screen.getByText(profile.about.en[0]).closest(".reveal") as HTMLElement;
    expect(headingReveal).not.toBeNull();
    expect(bodyReveal).not.toBeNull();
    expect(bodyReveal).not.toBe(headingReveal);
    expect(headingReveal).not.toContainElement(bodyReveal);
    expect(bodyReveal.style.transitionDelay).toBe(`${staggerDelay(1)}ms`);
  });
});
