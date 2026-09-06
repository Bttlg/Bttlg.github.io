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
  });

  it("renders a rotating ring by default", () => {
    const { container } = render(<Avatar lang="en" />);
    expect(container.querySelector(".avatar-ring")).not.toBeNull();
  });

  it("renders no ring element when ring is false", () => {
    const { container } = render(<Avatar lang="en" ring={false} />);
    expect(container.querySelector(".avatar-ring")).toBeNull();
  });
});
