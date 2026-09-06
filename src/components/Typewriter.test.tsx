import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Typewriter } from "./Typewriter";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("Typewriter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the full text immediately when reduced motion is preferred", () => {
    mockMatchMedia(true);
    render(<Typewriter text="$ whoami" />);
    expect(screen.getByLabelText("$ whoami")).toHaveTextContent("$ whoami");
  });

  it("types the text one character at a time when motion is allowed", () => {
    vi.useFakeTimers();
    mockMatchMedia(false);
    const text = "hello";
    render(<Typewriter text={text} speedMs={70} />);

    const typed = () => screen.getByTestId("typewriter-text");
    // Right after mount, nothing has been typed yet.
    expect(typed().textContent).toBe("");

    act(() => {
      vi.advanceTimersByTime(70 * 3 + 10);
    });
    // Partway through, only the first few characters have appeared.
    expect(typed().textContent).toBe(text.slice(0, 3));

    act(() => {
      vi.advanceTimersByTime(70 * (text.length - 3) + 10);
    });
    expect(typed().textContent).toBe(text);

    vi.useRealTimers();
  });

  it("shows a blinking cursor once motion is allowed", () => {
    vi.useFakeTimers();
    mockMatchMedia(false);
    render(<Typewriter text="hi" speedMs={70} />);

    act(() => {
      vi.advanceTimersByTime(70 * 2 + 10);
    });
    expect(document.querySelector(".cursor-blink")).not.toBeNull();

    vi.useRealTimers();
  });

  it("sets aria-label to the full text so screen readers get it at once", () => {
    mockMatchMedia(true);
    render(<Typewriter text="hello world" />);
    expect(screen.getByLabelText("hello world")).toBeInTheDocument();
  });
});
