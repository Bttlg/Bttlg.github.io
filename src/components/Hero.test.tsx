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

  it("sets the name in the display tier: tight leading, negative tracking, balanced wrap", () => {
    render(<Hero lang="en" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveClass("leading-display");
    expect(h1).toHaveClass("tracking-display");
    expect(h1).toHaveClass("text-balance");
    expect(h1).not.toHaveClass("tracking-tight");
    expect(screen.getByText(profile.tagline.en)).toHaveClass("text-fg-soft");
  });

  it("builds the primary and secondary CTAs on the shared pressable surface at one height", () => {
    render(<Hero lang="en" />);
    const primary = screen.getByRole("link", { name: ui.en.actions.viewProjects });
    const secondary = screen.getByRole("link", { name: ui.en.actions.viewCv });
    for (const cta of [primary, secondary]) {
      const classes = cta.className.split(/\s+/);
      expect(classes.slice(0, 3)).toEqual(["pressable", "inline-flex", "h-10"]);
      // `.pressable` owns the transition list; a transition-* utility would override it.
      expect(classes.filter((c) => /(^|:)transition-/.test(c))).toEqual([]);
      expect(classes.filter((c) => /(^|:)border(-|$)/.test(c))).toEqual([]);
    }
    // A solid CTA brightens on hover instead of going translucent (which read as disabled).
    expect(primary).toHaveClass("shadow-cta");
    expect(primary).not.toHaveClass("hover:opacity-90");
    expect(secondary).toHaveClass("shadow-pill");
  });

  it("renders the contact link's arrow as a decorative icon, not text", () => {
    render(<Hero lang="en" />);
    const contact = screen.getByRole("link", { name: ui.en.actions.contactMe });
    expect(contact).toHaveAttribute("href", "#contact");
    expect(contact.textContent).toBe(ui.en.actions.contactMe);
    const icon = contact.querySelector("svg");
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(contact).toHaveClass("transition-colors");
  });

  it("frames the photo with the beam instead of an aurora backdrop or glow of its own", () => {
    const { container } = render(<Hero lang="en" />);
    expect(container.querySelector(".beam-frame")).not.toBeNull();
    expect(container.querySelector('[class*="animate-aurora"]')).toBeNull();
    expect(container.querySelector('[class*="avatar-glow"]')).toBeNull();
    expect(container.querySelector('[class*="blur-"]')).toBeNull();
  });
});
