import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "./Section";

describe("Section", () => {
  it("labels the section by its heading and shows the eyebrow as a comment", () => {
    render(
      <Section id="demo" title="Demo title">
        <p>body</p>
      </Section>,
    );
    const section = screen.getByRole("region", { name: "Demo title" });
    expect(section).toHaveAttribute("id", "demo");
    expect(screen.getByText("// demo")).toBeInTheDocument();
  });

  it("reveals only the eyebrow and heading; the body sits outside that Reveal", () => {
    render(
      <Section id="demo" title="Demo title" label="lbl">
        <p>body</p>
      </Section>,
    );
    const heading = screen.getByRole("heading", { name: "Demo title" });
    const reveal = heading.closest(".reveal") as HTMLElement;
    expect(reveal).not.toBeNull();
    expect(reveal).toContainElement(screen.getByText("// lbl"));
    // Nested reveals mush the children's own stagger and let a tall wrapper's
    // intersection delay the heading, so the body is a sibling, not a child.
    expect(reveal).not.toContainElement(screen.getByText("body"));
    expect(screen.getByText("body").closest(".reveal")).toBeNull();
  });
});
