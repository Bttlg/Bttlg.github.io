import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";

// `next/image` resolves through Next's image loader (which yields
// `/_next/image?...` URLs) unless it runs through the real Next.js build
// pipeline, which Vitest doesn't. Production uses `images.unoptimized:
// true` (see next.config.ts), so a plain `<img>` matches actual output.
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- test stub for a build-time-only optimized component
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ""} />,
}));

import { Avatar } from "./Avatar";
import { profile } from "@/content";

const NO_BACKDROP = /ring-|shadow|bg-/;

describe("Avatar", () => {
  it("renders an image with the localized name as alt text and the avatar src", () => {
    render(<Avatar lang="en" />);
    const img = screen.getByRole("img", { name: profile.name.en });
    expect(img).toHaveAttribute("src", expect.stringContaining("/avatar.webp"));
    expect(img).toHaveAttribute("width", "640");
    expect(img).toHaveAttribute("height", "1137");
  });

  it("wraps the photo in the beam frame by default", () => {
    const { container } = render(<Avatar lang="en" />);
    expect(container.firstElementChild?.className).not.toMatch(/animate-/);
    const frame = container.querySelector(".beam-frame");
    expect(frame).not.toBeNull();
    expect(frame).toContainElement(screen.getByRole("img", { name: profile.name.en }));
    // The beam itself is a CSS pseudo-element on the frame, not a DOM node.
    expect(frame?.childElementCount).toBe(1);
  });

  it("rounds the decorated image just inside the 2px frame and backs it with the canvas colour", () => {
    render(<Avatar lang="en" />);
    const img = screen.getByRole("img", { name: profile.name.en });
    expect(img).toHaveClass("rounded-[calc(1rem-2px)]");
    expect(img).toHaveClass("bg-canvas");
  });

  it("paints no ring, shadow or backdrop around the decorated photo (the page grid stays visible)", () => {
    const { container } = render(<Avatar lang="en" />);
    const wrapper = container.firstElementChild as HTMLElement;
    const frame = container.querySelector(".beam-frame") as HTMLElement;
    const img = screen.getByRole("img", { name: profile.name.en });
    expect(wrapper.className).not.toMatch(NO_BACKDROP);
    expect(frame.className).not.toMatch(NO_BACKDROP);
    expect(img.className).not.toMatch(/ring-|shadow/);
  });

  it("applies an imgClassName override instead of the default radius", () => {
    render(<Avatar lang="en" imgClassName="rounded-full" />);
    const img = screen.getByRole("img", { name: profile.name.en });
    expect(img).toHaveClass("rounded-full");
    expect(img).not.toHaveClass("rounded-[calc(1rem-2px)]");
  });

  it("renders plain (no beam frame) when decorated is false", () => {
    const { container } = render(<Avatar lang="en" decorated={false} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).not.toMatch(NO_BACKDROP);
    expect(container.querySelector(".beam-frame")).toBeNull();
    const img = screen.getByRole("img", { name: profile.name.en });
    expect(img).toHaveClass("rounded-lg");
    expect(img).not.toHaveClass("bg-canvas");
    expect(img.className).not.toMatch(/ring-|shadow/);
  });
});
