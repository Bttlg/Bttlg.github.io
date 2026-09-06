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

  it("underlines section links with a scaled line (transform only), and eases colour hovers", () => {
    render(<Nav lang="en" />);
    const link = screen.getByRole("link", { name: ui.en.nav.projects });
    const classes = link.className.split(/\s+/);
    expect(link).toHaveClass("after:scale-x-0");
    expect(link).toHaveClass("hover:after:scale-x-100");
    expect(link).toHaveClass("focus-visible:after:scale-x-100");
    // The line is never animated through its width: exactly these two
    // transition utilities, the text colour and the ::after transform.
    expect(classes.filter((c) => /(^|:)transition-/.test(c)).sort()).toEqual(
      ["after:transition-transform", "motion-reduce:after:transition-none", "transition-colors"].sort(),
    );
    expect(classes.filter((c) => /(^|:)w-/.test(c))).toEqual([]);
    expect(classes.filter((c) => /(^|:)duration-/.test(c))).toEqual(["after:duration-200"]);
    expect(screen.getByRole("link", { name: ui.en.brand })).toHaveClass("transition-colors");
  });
});
