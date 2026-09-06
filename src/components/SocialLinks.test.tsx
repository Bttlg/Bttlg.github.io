import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content")>();
  return { ...actual, profile: { ...actual.profile, linkedin: "" } };
});

import { SocialLinks } from "./SocialLinks";
import { profile, ui } from "@/content";

describe("SocialLinks", () => {
  it("renders email and GitHub, hides LinkedIn when empty", () => {
    render(<SocialLinks lang="en" showLabels />);
    expect(screen.getByRole("link", { name: ui.en.contact.email })).toHaveAttribute("href", `mailto:${profile.email}`);
    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", profile.github);
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByRole("link", { name: "LinkedIn" })).toBeNull();
  });

  it("pads each link to a 36px hit target without moving it, and eases the colour hover", () => {
    render(<SocialLinks lang="en" />);
    for (const link of screen.getAllByRole("link")) {
      // Padding grows the target; the negative margin cancels it in the flow.
      expect(link).toHaveClass("p-2");
      expect(link).toHaveClass("-m-2");
      expect(link).toHaveClass("rounded-md");
      expect(link).toHaveClass("transition-colors");
      expect(link).toHaveClass("hover:text-fg");
      expect(link).not.toHaveClass("hover:text-accent");
    }
  });

  it("uses aria-labels when labels are hidden", () => {
    render(<SocialLinks lang="mn" />);
    expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.queryByText("GitHub")).toBeNull();
  });
});
