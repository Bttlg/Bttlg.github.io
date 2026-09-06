import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import { profile } from "@/content";

describe("Footer", () => {
  it("renders the copyright line and a safe external GitHub link", () => {
    render(<Footer lang="en" />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent(profile.name.en);
    expect(footer).toHaveTextContent(String(new Date().getFullYear()));
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", profile.github);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("brackets the page with the nav's bright top edge instead of a border, and eases the link hover", () => {
    render(<Footer lang="en" />);
    const footer = screen.getByRole("contentinfo");
    expect(footer.className).not.toMatch(/border-t/);
    expect(footer).toHaveClass("shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]");
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveClass("transition-colors");
    expect(link).toHaveClass("hover:text-fg");
    expect(link).not.toHaveClass("hover:text-accent");
  });
});
