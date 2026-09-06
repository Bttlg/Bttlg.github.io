import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Snow } from "./Snow";

describe("Snow", () => {
  it("renders the given count of flakes inside an aria-hidden container", () => {
    const { container } = render(<Snow count={22} />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".snowflake")).toHaveLength(22);
  });

  it("defaults to 22 flakes", () => {
    const { container } = render(<Snow />);
    expect(container.querySelectorAll(".snowflake")).toHaveLength(22);
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
