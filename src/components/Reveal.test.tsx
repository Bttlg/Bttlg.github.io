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

/** Installs an IntersectionObserver stub and hands back its captured callback, options and spies. */
function stubIntersectionObserver() {
  let callback: IntersectionObserverCallback = () => {};
  let options: IntersectionObserverInit | undefined;
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  class FakeIO {
    constructor(cb: IntersectionObserverCallback, init?: IntersectionObserverInit) {
      callback = cb;
      options = init;
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  }
  // @ts-expect-error test stub
  window.IntersectionObserver = FakeIO;
  return {
    observe,
    unobserve,
    disconnect,
    options: () => options,
    intersect: () =>
      act(() => {
        callback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          // @ts-expect-error stub observer instance
          {},
        );
      }),
  };
}

describe("Reveal", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    // @ts-expect-error restore for other test files
    delete window.IntersectionObserver;
  });

  it("is not visible initially and becomes visible when intersecting", () => {
    const io = stubIntersectionObserver();

    render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );

    const el = screen.getByText("content").closest(".reveal");
    expect(el).not.toBeNull();
    expect(el).not.toHaveClass("is-visible");
    expect(io.observe).toHaveBeenCalled();
    // Height-independent trigger: every element starts as soon as its top
    // edge crosses the same line, 10% up from the bottom of the viewport.
    expect(io.options()).toEqual({ threshold: 0, rootMargin: "0px 0px -10% 0px" });

    io.intersect();

    expect(el).toHaveClass("is-visible");
    // The scroll-driven reveal keeps its transition; only focus is instant.
    expect(el).not.toHaveClass("is-instant");
    expect(io.unobserve).toHaveBeenCalled();
  });

  it("reveals instantly (no transition, no stagger delay) when keyboard focus enters it before it intersects", () => {
    const io = stubIntersectionObserver();

    render(
      <Reveal delay={120}>
        <button type="button">focus me</button>
      </Reveal>,
    );

    const button = screen.getByRole("button", { name: "focus me" });
    const el = button.closest(".reveal");
    expect(el).not.toHaveClass("is-visible");

    // focusin bubbles from the focused descendant up to the Reveal element.
    fireEvent.focusIn(button);

    expect(el).toHaveClass("is-visible");
    // `.reveal.is-instant` in globals.css sets `transition: none`, which also
    // defeats the inline stagger delay: a keyboard action never animates.
    expect(el).toHaveClass("is-instant");
    expect(io.disconnect).toHaveBeenCalled();

    // A late intersection can't downgrade the instant reveal back to an animated one.
    io.intersect();
    expect(el).toHaveClass("is-instant");
  });

  it("stops observing and listening for focus on unmount", () => {
    const io = stubIntersectionObserver();

    const { unmount } = render(
      <Reveal>
        <p>unmounted</p>
      </Reveal>,
    );
    const el = screen.getByText("unmounted").closest(".reveal") as HTMLElement;
    const remove = vi.spyOn(el, "removeEventListener");

    unmount();

    expect(io.disconnect).toHaveBeenCalled();
    expect(remove).toHaveBeenCalledWith("focusin", expect.any(Function));
  });

  it("is visible immediately when IntersectionObserver is undefined", () => {
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

  it("still reveals through the observer under reduced motion (CSS keeps an opacity-only fade)", () => {
    // Gentler, not zero: the reduced-motion variant lives in globals.css
    // (`transform: none; transition: opacity ...`), so the component must
    // not short-circuit to visible-on-mount and skip the fade.
    mockMatchMedia(true);
    const io = stubIntersectionObserver();

    render(
      <Reveal>
        <p>reduced</p>
      </Reveal>,
    );
    const el = screen.getByText("reduced").closest(".reveal");
    expect(el).not.toHaveClass("is-visible");
    expect(io.observe).toHaveBeenCalled();

    io.intersect();
    expect(el).toHaveClass("is-visible");
    expect(el).not.toHaveClass("is-instant");
  });

  it("applies the delay as transition-delay and exposes it as --reveal-delay for descendants", () => {
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
