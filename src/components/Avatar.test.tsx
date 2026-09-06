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

describe("Avatar", () => {
  it("renders an image with the localized name as alt text and the avatar src", () => {
    render(<Avatar lang="en" />);
    const img = screen.getByRole("img", { name: profile.name.en });
    expect(img).toHaveAttribute("src", expect.stringContaining("/avatar.webp"));
    expect(img).toHaveAttribute("width", "640");
    expect(img).toHaveAttribute("height", "1137");
  });

  it("uses rounded-2xl on the image by default", () => {
    render(<Avatar lang="en" />);
    const img = screen.getByRole("img", { name: profile.name.en });
    expect(img).toHaveClass("rounded-2xl");
  });

  it("applies an imgClassName override instead of the default", () => {
    render(<Avatar lang="en" imgClassName="rounded-full" />);
    const img = screen.getByRole("img", { name: profile.name.en });
    expect(img).toHaveClass("rounded-full");
    expect(img).not.toHaveClass("rounded-2xl");
  });

  it("floats and glows by default", () => {
    const { container } = render(<Avatar lang="en" />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("avatar-glow");
    expect(wrapper).toHaveClass("animate-float");
  });

  it("renders no float/glow decoration and no ring element when decorated is false", () => {
    const { container } = render(<Avatar lang="en" decorated={false} />);
    const wrapper = container.firstElementChild;
    expect(wrapper).not.toHaveClass("animate-float");
    expect(wrapper).not.toHaveClass("avatar-glow");
    expect(container.querySelector(".avatar-ring")).toBeNull();
  });
});
