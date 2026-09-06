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

  it("rests the section links on fg-soft, not muted, so they keep AA contrast over the translucent material", () => {
    render(<Nav lang="en" />);
    // Worst case is the /cv page: the white CV sheet scrolls under the 72%
    // canvas material, where `muted` measures ~3.25:1 and `fg-soft` ~5.6:1.
    const list = screen.getByRole("link", { name: ui.en.nav.projects }).closest("ul") as HTMLElement;
    expect(list).toHaveClass("text-fg-soft");
    expect(list).not.toHaveClass("text-muted");
    const link = screen.getByRole("link", { name: ui.en.nav.projects });
    expect(link).toHaveClass("hover:text-fg");
    expect(link.className).not.toMatch(/(^|\s)text-muted(\s|$)/);
  });

  it("renders the header as a translucent material: no hard bottom border, no bespoke blur utilities", () => {
    render(<Nav lang="en" />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("nav-material");
    expect(header.className).not.toMatch(/border-b|bg-canvas|backdrop-blur/);
  });

  it("builds the CV pill on the shared pressable surface, with no transition utility of its own", () => {
    render(<Nav lang="en" />);
    const cv = screen.getByRole("link", { name: ui.en.nav.cv });
    const classes = cv.className.split(/\s+/);
    // `.pressable` owns the transition list; `inline-flex` lets its press scale apply to the <a>.
    expect(classes.slice(0, 2)).toEqual(["pressable", "inline-flex"]);
    expect(cv).toHaveClass("shadow-pill");
    expect(classes.filter((c) => /(^|:)transition-/.test(c))).toEqual([]);
    expect(classes.filter((c) => /(^|:)border(-|$)/.test(c))).toEqual([]);
    // The bar keeps one accent (the progress line): the pill hovers by surface, not by colour.
    expect(cv).not.toHaveClass("hover:text-accent");
  });
});
