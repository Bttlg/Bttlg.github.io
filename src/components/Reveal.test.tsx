import { describe, it, expect, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
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

  it("becomes visible when keyboard focus enters it before it intersects", () => {
    mockMatchMedia(false);
    const disconnect = vi.fn();
    class FakeIO {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = disconnect;
    }
    // @ts-expect-error test stub
    window.IntersectionObserver = FakeIO;

    render(
      <Reveal>
        <button type="button">focus me</button>
      </Reveal>,
    );

    const button = screen.getByRole("button", { name: "focus me" });
    const el = button.closest(".reveal");
    expect(el).not.toHaveClass("is-visible");

    // focusin bubbles from the focused descendant up to the Reveal element.
    fireEvent.focusIn(button);

    expect(el).toHaveClass("is-visible");
    expect(disconnect).toHaveBeenCalled();
  });

  it("stops observing and listening for focus on unmount", () => {
    mockMatchMedia(false);
    const disconnect = vi.fn();
    class FakeIO {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = disconnect;
    }
    // @ts-expect-error test stub
    window.IntersectionObserver = FakeIO;

    const { unmount } = render(
      <Reveal>
        <p>unmounted</p>
      </Reveal>,
    );
    const el = screen.getByText("unmounted").closest(".reveal") as HTMLElement;
    const remove = vi.spyOn(el, "removeEventListener");

    unmount();

    expect(disconnect).toHaveBeenCalled();
    expect(remove).toHaveBeenCalledWith("focusin", expect.any(Function));
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

  it("applies the delay as transition-delay and exposes it as --reveal-delay for descendants", () => {
    mockMatchMedia(true);
    render(
      <Reveal delay={120}>
        <p>delayed</p>
      </Reveal>,
    );
    const el = screen.getByText("delayed").closest(".reveal") as HTMLElement;
    expect(el.style.transitionDelay).toBe("120ms");
    expect(el.style.getPropertyValue("--reveal-delay")).toBe("120ms");
  });

  it("sets no inline delay by default or for a zero delay", () => {
    mockMatchMedia(true);
    render(
      <>
        <Reveal>
          <p>no delay</p>
        </Reveal>
        <Reveal delay={0}>
          <p>zero delay</p>
        </Reveal>
      </>,
    );
    for (const text of ["no delay", "zero delay"]) {
      const el = screen.getByText(text).closest(".reveal") as HTMLElement;
      expect(el.getAttribute("style")).toBeNull();
    }
  });
});
