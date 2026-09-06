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

import { ProjectCard } from "./ProjectCard";
import { ui, type Project } from "@/content";

const base: Project = {
  slug: "demo",
  name: { mn: "Демо", en: "Demo" },
  kind: "personal",
  role: { mn: "Ганцаараа", en: "Solo" },
  period: { from: "2025-01", to: null },
  summary: { mn: "Тайлбар", en: "Summary" },
  highlights: { mn: ["a", "b", "c", "d"], en: ["a", "b", "c", "d"] },
  stack: ["Next.js", "TypeScript"],
  featured: false,
};

describe("ProjectCard", () => {
  it("renders name, role, period, summary, at most 3 highlights and stack chips", () => {
    render(<ProjectCard project={base} lang="en" />);
    expect(screen.getByRole("heading", { name: "Demo" })).toBeInTheDocument();
    expect(screen.getByText("Solo")).toBeInTheDocument();
    expect(screen.getByText("Jan 2025 – Present")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("reads in three tiers (title fg, summary fg-soft, meta muted) with chips on the 8px gap", () => {
    render(<ProjectCard project={base} lang="en" />);
    const title = screen.getByRole("heading", { name: "Demo" });
    expect(title).toHaveClass("text-fg");
    expect(title).toHaveClass("leading-snug");
    expect(screen.getByText("Summary")).toHaveClass("text-fg-soft");
    expect(screen.getByText("Jan 2025 – Present")).toHaveClass("text-muted");
    expect(screen.getByRole("list")).toHaveClass("text-muted");
    const chipRow = screen.getByText("Next.js").parentElement!;
    expect(chipRow).toHaveClass("gap-2");
    expect(chipRow).not.toHaveClass("gap-1.5");
  });

  it("renders no links when urls are missing", () => {
    render(<ProjectCard project={base} lang="en" />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders live and source links as safe external links", () => {
    render(
      <ProjectCard
        project={{ ...base, liveUrl: "https://demo.example", repoUrl: "https://github.com/x/demo" }}
        lang="mn"
      />,
    );
    const live = screen.getByRole("link", { name: ui.mn.actions.live });
    expect(live).toHaveAttribute("href", "https://demo.example");
    expect(live).toHaveAttribute("target", "_blank");
    expect(live).toHaveAttribute("rel", "noopener noreferrer");
    const source = screen.getByRole("link", { name: ui.mn.actions.source });
    expect(source).toHaveAttribute("href", "https://github.com/x/demo");
    // Colour hovers ease instead of snapping.
    for (const link of [live, source]) expect(link).toHaveClass("transition-colors");
  });

  it("hovers on compositor properties only: a translate lift, and the deeper shadow crossfaded on a pseudo-element", () => {
    render(<ProjectCard project={base} lang="en" />);
    const card = screen.getByRole("article");
    const classes = card.className.split(/\s+/);
    // Exact transition lists, never a catch-all: the card transitions only
    // its lift (Tailwind writes -translate-y-* as `translate`, not
    // `transform`); the ::after transitions only its opacity.
    expect(classes.filter((c) => /(^|:)transition-/.test(c)).sort()).toEqual(
      ["after:transition-opacity", "transition-[translate]"].sort(),
    );
    expect(classes.filter((c) => /(^|:)duration-/.test(c)).sort()).toEqual(["after:duration-200", "duration-200"].sort());
    expect(card).toHaveClass("hover:-translate-y-0.5");
    expect(card).toHaveClass("motion-reduce:hover:translate-y-0");
    // box-shadow is a paint property: the resting shadow stays static and the
    // hover shadow lives on a static ::after whose opacity fades in.
    expect(card).toHaveClass("shadow-card");
    expect(card).not.toHaveClass("hover:shadow-card-hover");
    expect(card).toHaveClass("after:shadow-card-hover");
    expect(card).toHaveClass("after:opacity-0");
    expect(card).toHaveClass("hover:after:opacity-100");
    // The layer sits behind the card's content, inside the card's own stacking context.
    expect(card).toHaveClass("isolate");
    expect(card).toHaveClass("after:-z-10");
    expect(card).toHaveClass("after:pointer-events-none");
    expect(card).toHaveClass("after:rounded-xl");
  });

  it("renders the logo image when set, and none when it is absent", () => {
    const { container, rerender } = render(
      <ProjectCard project={{ ...base, logo: { src: "/e-geree.svg", width: 372, height: 100 } }} lang="en" />,
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", expect.stringContaining("/e-geree.svg"));
    expect(img).toHaveAttribute("alt", "");
    // The tile is its own row above the name/period row, in normal flow.
    const tile = img!.closest("span")!;
    expect(tile).not.toHaveClass("absolute");
    expect(tile.nextElementSibling).toContainElement(screen.getByRole("heading", { name: "Demo" }));
    // Soft white tile with an inset ring; an outer black ring/shadow was invisible on the dark card.
    expect(tile).toHaveClass("bg-white/90");
    expect(tile).toHaveClass("ring-inset");
    expect(tile).not.toHaveClass("shadow-sm");

    rerender(<ProjectCard project={base} lang="en" />);
    expect(container.querySelector("img")).toBeNull();
  });
});
