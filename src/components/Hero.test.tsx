import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- test stub for a build-time-only optimized component
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ""} />,
}));

import { Hero } from "./Hero";
import { profile, ui } from "@/content";

describe("Hero", () => {
  it("renders the name as the h1, the prompt text and the avatar image", () => {
    render(<Hero lang="en" />);
    expect(screen.getByRole("heading", { level: 1, name: profile.name.en })).toBeInTheDocument();
    expect(screen.getByLabelText(ui.en.hero.prompt)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: profile.name.en })).toHaveAttribute(
      "src",
      expect.stringContaining("/avatar.webp"),
    );
  });

  it("frames the photo with the beam instead of an aurora backdrop or glow", () => {
    const { container } = render(<Hero lang="en" />);
    expect(container.querySelector(".beam-frame")).not.toBeNull();
    expect(container.querySelector('[class*="animate-aurora"]')).toBeNull();
    expect(container.querySelector('[class*="avatar-glow"]')).toBeNull();
    expect(container.querySelector('[class*="blur-"]')).toBeNull();
  });
});
