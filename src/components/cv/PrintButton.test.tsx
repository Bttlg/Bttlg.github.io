import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PrintButton } from "./PrintButton";

describe("PrintButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("prints on click", () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<PrintButton label="Print / PDF" />);
    fireEvent.click(screen.getByRole("button", { name: "Print / PDF" }));
    expect(print).toHaveBeenCalledTimes(1);
  });

  it("sits on the shared pressable surface and stays off the printed page", () => {
    render(<PrintButton label="Print / PDF" />);
    const button = screen.getByRole("button", { name: "Print / PDF" });
    const classes = button.className.split(/\s+/);
    expect(classes.slice(0, 2)).toEqual(["pressable", "inline-flex"]);
    expect(button).toHaveClass("shadow-pill");
    expect(button).toHaveClass("print:hidden");
    // `.pressable` owns the transition list; a Tailwind transition utility of its own would override it.
    expect(classes.filter((c) => /(^|:)transition-/.test(c))).toEqual([]);
    expect(classes.filter((c) => /(^|:)border(-|$)/.test(c))).toEqual([]);
  });
});
