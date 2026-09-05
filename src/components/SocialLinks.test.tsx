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

  it("uses aria-labels when labels are hidden", () => {
    render(<SocialLinks lang="mn" />);
    expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.queryByText("GitHub")).toBeNull();
  });
});
