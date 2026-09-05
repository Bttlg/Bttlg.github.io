import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
    expect(screen.getByRole("link", { name: ui.mn.actions.source })).toHaveAttribute(
      "href",
      "https://github.com/x/demo",
    );
  });
});
