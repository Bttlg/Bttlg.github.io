import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "./page";
import { REDIRECT_SCRIPT } from "@/lib/redirect-script";

describe("/ redirect page", () => {
  it("links to both locales", () => {
    render(<Page />);
    expect(screen.getByRole("link", { name: "Монгол" })).toHaveAttribute("href", "/mn/");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en/");
  });
  it("ships the redirect script inline", () => {
    const { container } = render(<Page />);
    const script = container.querySelector("script");
    expect(script?.innerHTML).toBe(REDIRECT_SCRIPT);
  });
  it("has a no-JS meta refresh fallback to /mn/", () => {
    render(<Page />);
    const meta = document.head.querySelector('meta[http-equiv="refresh"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute("content")).toBe("0;url=/mn/");
  });
  it("is not indexed and points canonical at /mn/", () => {
    expect(metadata.robots).toMatchObject({ index: false });
    expect(metadata.alternates).toMatchObject({ canonical: "/mn/" });
  });
});
