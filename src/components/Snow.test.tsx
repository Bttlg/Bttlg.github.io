import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Snow, SNOW_FLAKE_COUNT } from "./Snow";

describe("Snow", () => {
  it("renders the given count of flakes inside a fixed, aria-hidden layer hidden in print", () => {
    const { container } = render(<Snow count={22} />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
    expect(wrapper).toHaveClass("snow-layer");
    expect(wrapper).toHaveClass("fixed");
    expect(wrapper).toHaveClass("inset-0");
    expect(wrapper).toHaveClass("pointer-events-none");
    expect(wrapper).toHaveClass("print:hidden");
    expect(container.querySelectorAll(".snowflake")).toHaveLength(22);
  });

  it("defaults to 24 flakes", () => {
    const { container } = render(<Snow />);
    expect(SNOW_FLAKE_COUNT).toBe(24);
    expect(container.querySelectorAll(".snowflake")).toHaveLength(24);
  });

  it("keeps every flake faint (opacity between 0.25 and 0.5)", () => {
    const { container } = render(<Snow />);
    const opacities = Array.from(container.querySelectorAll<HTMLElement>(".snowflake")).map((el) =>
      Number(el.style.getPropertyValue("--opacity")),
    );
    expect(opacities).toHaveLength(24);
    for (const o of opacities) {
      expect(o).toBeGreaterThanOrEqual(0.25);
      expect(o).toBeLessThanOrEqual(0.5);
    }
  });

  it("is deterministic across renders (same style attrs each time)", () => {
    const a = render(<Snow count={5} />);
    const b = render(<Snow count={5} />);
    const aStyles = Array.from(a.container.querySelectorAll(".snowflake")).map((el) => el.getAttribute("style"));
    const bStyles = Array.from(b.container.querySelectorAll(".snowflake")).map((el) => el.getAttribute("style"));
    expect(aStyles).toEqual(bStyles);
    expect(aStyles.every((s) => !!s && s.length > 0)).toBe(true);
  });
});
