import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contact } from "./Contact";
import { profile, ui } from "@/content";
import { staggerDelay } from "@/lib/stagger";

describe("Contact", () => {
  it("renders the heading, body copy and a mailto link", () => {
    render(<Contact lang="en" />);
    expect(screen.getByRole("heading", { name: ui.en.sections.contact })).toBeInTheDocument();
    expect(screen.getByText(ui.en.contact.body)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: profile.email })).toHaveAttribute("href", `mailto:${profile.email}`);
  });

  it("underlines the email link at rest and recolours text and underline together on hover", () => {
    render(<Contact lang="en" />);
    const link = screen.getByRole("link", { name: profile.email });
    expect(link).toHaveClass("underline");
    expect(link).toHaveClass("decoration-white/15");
    expect(link).not.toHaveClass("hover:underline");
    expect(link).toHaveClass("transition-colors");
    expect(screen.getByText(ui.en.contact.body)).toHaveClass("text-fg-soft");
  });

  it("reveals the body in its own Reveal, one stagger step after the heading's", () => {
    render(<Contact lang="en" />);
    const headingReveal = screen.getByRole("heading", { name: ui.en.sections.contact }).closest(".reveal");
    const bodyReveal = screen.getByText(ui.en.contact.body).closest(".reveal") as HTMLElement;
    expect(headingReveal).not.toBeNull();
    expect(bodyReveal).not.toBeNull();
    expect(bodyReveal).not.toBe(headingReveal);
    expect(headingReveal).not.toContainElement(bodyReveal);
    expect(bodyReveal.style.transitionDelay).toBe(`${staggerDelay(1)}ms`);
    // The email link and the social links travel with the body.
    expect(bodyReveal).toContainElement(screen.getByRole("link", { name: profile.email }));
  });
});
