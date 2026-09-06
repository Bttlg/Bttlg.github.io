import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Reveal } from "./Reveal";

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

describe("Reveal", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    // @ts-expect-error restore for other test files
    delete window.IntersectionObserver;
  });

  it("is not visible initially and becomes visible when intersecting", () => {
    mockMatchMedia(false);
    let capturedCallback: IntersectionObserverCallback = () => {};
    const unobserve = vi.fn();
    const observe = vi.fn();
    class FakeIO {
      constructor(cb: IntersectionObserverCallback) {
        capturedCallback = cb;
      }
      observe = observe;
      unobserve = unobserve;
      disconnect = vi.fn();
    }
    // @ts-expect-error test stub
    window.IntersectionObserver = FakeIO;

    render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );

    const el = screen.getByText("content").closest(".reveal");
    expect(el).not.toBeNull();
    expect(el).not.toHaveClass("is-visible");
    expect(observe).toHaveBeenCalled();

    act(() => {
      capturedCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        // @ts-expect-error stub observer instance
        {},
      );
    });

    expect(el).toHaveClass("is-visible");
    expect(unobserve).toHaveBeenCalled();
  });

  it("is visible immediately when IntersectionObserver is undefined", () => {
    mockMatchMedia(false);
    // @ts-expect-error simulate missing API
    delete window.IntersectionObserver;

    render(
      <Reveal>
        <p>fallback</p>
      </Reveal>,
    );

    const el = screen.getByText("fallback").closest(".reveal");
    expect(el).toHaveClass("is-visible");
  });

  it("is visible immediately when reduced motion is preferred", () => {
    mockMatchMedia(true);
    render(
      <Reveal>
        <p>reduced</p>
      </Reveal>,
    );
    const el = screen.getByText("reduced").closest(".reveal");
    expect(el).toHaveClass("is-visible");
  });
});
