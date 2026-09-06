import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const usePathname = vi.fn<() => string>();
vi.mock("next/navigation", () => ({ usePathname: () => usePathname() }));

import { LangSwitch } from "./LangSwitch";

describe("LangSwitch", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("links to the same sub-path in the other locale", () => {
    usePathname.mockReturnValue("/mn/cv/");
    render(<LangSwitch lang="mn" />);
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en/cv/");
    expect(screen.queryByRole("link", { name: "MN" })).toBeNull();
    expect(screen.getByText("MN")).toHaveAttribute("aria-current", "true");
  });

  it("links home when on the locale root", () => {
    usePathname.mockReturnValue("/en/");
    render(<LangSwitch lang="en" />);
    expect(screen.getByRole("link", { name: "MN" })).toHaveAttribute("href", "/mn/");
  });

  it("separates the locales with a hairline, not a glyph, and eases the link's colour hover", () => {
    usePathname.mockReturnValue("/en/");
    const { container } = render(<LangSwitch lang="en" />);
    const group = screen.getByRole("group", { name: "Language" });
    expect(group.textContent).toBe("MNEN");
    const divider = container.querySelector('[aria-hidden="true"]');
    expect(divider).not.toBeNull();
    expect(divider).toHaveClass("w-px");
    expect(divider).toBeEmptyDOMElement();
    const link = screen.getByRole("link", { name: "MN" });
    expect(link).toHaveClass("transition-colors");
    expect(link).toHaveClass("hover:text-fg");
    expect(link).not.toHaveClass("hover:text-accent");
  });

  it("rests the inactive locale on fg-soft (AA over the nav material's white worst case), the active one on fg", () => {
    usePathname.mockReturnValue("/en/cv/");
    render(<LangSwitch lang="en" />);
    const inactive = screen.getByRole("link", { name: "MN" });
    expect(inactive).toHaveClass("text-fg-soft");
    expect(inactive).not.toHaveClass("text-muted");
    expect(screen.getByText("EN")).toHaveClass("text-fg");
  });

  it("remembers the chosen locale", () => {
    usePathname.mockReturnValue("/mn/");
    render(<LangSwitch lang="mn" />);
    fireEvent.click(screen.getByRole("link", { name: "EN" }));
    expect(localStorage.getItem("locale")).toBe("en");
  });
});
