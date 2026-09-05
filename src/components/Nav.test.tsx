import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/en/" }));

import { Nav } from "./Nav";
import { ui } from "@/content";

describe("Nav", () => {
  it("renders brand, section anchors, CV link and language switch", () => {
    render(<Nav lang="en" />);
    expect(screen.getByRole("link", { name: ui.en.brand })).toHaveAttribute("href", "/en/");
    expect(screen.getByRole("link", { name: ui.en.nav.projects })).toHaveAttribute("href", "/en/#projects");
    expect(screen.getByRole("link", { name: ui.en.nav.cv })).toHaveAttribute("href", "/en/cv/");
    expect(screen.getByRole("link", { name: "MN" })).toHaveAttribute("href", "/mn/");
  });
});
