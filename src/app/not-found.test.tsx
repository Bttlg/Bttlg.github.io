import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";
import { ui } from "@/content";

describe("404 page", () => {
  it("shows both languages with links home", () => {
    render(<NotFound />);
    expect(screen.getByText(ui.mn.notFound.title)).toBeInTheDocument();
    expect(screen.getByText(ui.en.notFound.title)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: `${ui.mn.notFound.home} →` })).toHaveAttribute("href", "/mn/");
    expect(screen.getByRole("link", { name: `${ui.en.notFound.home} →` })).toHaveAttribute("href", "/en/");
  });
  it("asks robots not to index", () => {
    render(<NotFound />);
    expect(document.head.querySelector('meta[name="robots"][content="noindex"]')).not.toBeNull();
  });
});
