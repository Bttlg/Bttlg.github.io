import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render } from "@testing-library/react";
import { ScrollProgress } from "./ScrollProgress";

function setLayout({
  scrollHeight,
  innerHeight,
  scrollY,
}: {
  scrollHeight: number;
  innerHeight: number;
  scrollY: number;
}) {
  Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: scrollHeight });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: innerHeight });
  Object.defineProperty(window, "scrollY", { configurable: true, value: scrollY });
}

/**
 * Manual animation frames: like the real API, callbacks never run inside
 * `requestAnimationFrame` itself — only when the test flushes them.
 */
function fakeFrames() {
  const queue = new Map<number, FrameRequestCallback>();
  let nextId = 1;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    const id = nextId++;
    queue.set(id, cb);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    queue.delete(id);
  });
  return {
    pending: () => queue.size,
    flush: () =>
      act(() => {
        const callbacks = [...queue.values()];
        queue.clear();
        for (const cb of callbacks) cb(16);
      }),
  };
}

describe("ScrollProgress", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders a fixed, aria-hidden bar at scaleX(0) before the first frame", () => {
    const frames = fakeFrames();
    setLayout({ scrollHeight: 2000, innerHeight: 1000, scrollY: 500 });
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar).toHaveAttribute("aria-hidden", "true");
    expect(bar).toHaveClass("scroll-progress");
    expect(bar).toHaveClass("fixed");
    expect(bar).toHaveClass("print:hidden");
    expect(bar.style.transform).toBe("scaleX(0)");
    expect(frames.pending()).toBe(1);
  });

  it("measures the restored scroll position on mount, before any scroll event", () => {
    const frames = fakeFrames();
    setLayout({ scrollHeight: 2000, innerHeight: 1000, scrollY: 250 });
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;
    frames.flush();
    expect(bar.style.transform).toBe("scaleX(0.25)");
  });

  it("updates the scale to reflect scroll progress on scroll", () => {
    const frames = fakeFrames();
    setLayout({ scrollHeight: 2000, innerHeight: 1000, scrollY: 0 });
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;
    frames.flush();
    expect(bar.style.transform).toBe("scaleX(0)");

    setLayout({ scrollHeight: 2000, innerHeight: 1000, scrollY: 500 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    frames.flush();

    expect(bar.style.transform).toBe("scaleX(0.5)");
  });

  it("coalesces a burst of scroll events into a single animation frame", () => {
    const frames = fakeFrames();
    setLayout({ scrollHeight: 2000, innerHeight: 1000, scrollY: 0 });
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;
    frames.flush();

    setLayout({ scrollHeight: 2000, innerHeight: 1000, scrollY: 1000 });
    act(() => {
      for (let i = 0; i < 5; i += 1) window.dispatchEvent(new Event("scroll"));
    });
    expect(frames.pending()).toBe(1);
    expect(bar.style.transform).toBe("scaleX(0)");

    frames.flush();
    expect(bar.style.transform).toBe("scaleX(1)");
  });

  it("clamps to 0 when the page isn't scrollable", () => {
    const frames = fakeFrames();
    setLayout({ scrollHeight: 800, innerHeight: 800, scrollY: 0 });
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;
    frames.flush();

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    frames.flush();

    expect(bar.style.transform).toBe("scaleX(0)");
  });

  it("removes its listeners and cancels a pending frame on unmount", () => {
    const frames = fakeFrames();
    const remove = vi.spyOn(window, "removeEventListener");
    setLayout({ scrollHeight: 2000, innerHeight: 1000, scrollY: 0 });
    const { unmount } = render(<ScrollProgress />);
    expect(frames.pending()).toBe(1);
    unmount();
    expect(frames.pending()).toBe(0);
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
    remove.mockRestore();
  });
});
