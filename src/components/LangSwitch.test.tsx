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

  it("remembers the chosen locale", () => {
    usePathname.mockReturnValue("/mn/");
    render(<LangSwitch lang="mn" />);
    fireEvent.click(screen.getByRole("link", { name: "EN" }));
    expect(localStorage.getItem("locale")).toBe("en");
  });
});
