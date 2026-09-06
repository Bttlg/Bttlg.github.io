import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render } from "@testing-library/react";
import { Spotlight } from "./Spotlight";

type Prefs = { reducedMotion: boolean; finePointer: boolean };

/**
 * `matchMedia` stub whose lists answer from a mutable preference set and
 * notify their `change` listeners when `set()` flips one.
 */
function mockMatchMedia(initial: Prefs) {
  const prefs = { ...initial };
  const listeners = new Map<string, Set<EventListener>>();
  const matchesFor = (query: string) =>
    query.includes("prefers-reduced-motion") ? prefs.reducedMotion : prefs.finePointer;

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => {
      const set = listeners.get(query) ?? new Set<EventListener>();
      listeners.set(query, set);
      return {
        get matches() {
          return matchesFor(query);
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (_type: string, listener: EventListener) => {
          set.add(listener);
        },
        removeEventListener: (_type: string, listener: EventListener) => {
          set.delete(listener);
        },
        dispatchEvent: vi.fn(),
      };
    }),
  });

  return {
    listenerCount: () => [...listeners.values()].reduce((n, set) => n + set.size, 0),
    set(next: Partial<Prefs>) {
      Object.assign(prefs, next);
      act(() => {
        for (const set of listeners.values()) {
          for (const listener of [...set]) listener(new Event("change"));
        }
      });
    },
  };
}

/**
 * Manual animation frames: like the real API, callbacks never run inside
 * `requestAnimationFrame` itself — only when the test flushes them. (A stub
 * that ran the callback synchronously would hand back its id after the
 * callback had already cleared the component's pending-frame slot, and
 * every later request would be treated as a duplicate.)
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

function moveTo(clientX: number, clientY: number) {
  act(() => {
    window.dispatchEvent(new PointerEvent("pointermove", { clientX, clientY }));
  });
}

describe("Spotlight", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders a fixed, aria-hidden, click-through layer parked off-screen before the pointer moves", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: true });
    fakeFrames();
    const { container } = render(<Spotlight />);
    const layer = container.firstElementChild as HTMLElement;
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer).toHaveClass("spotlight");
    expect(layer).toHaveClass("fixed");
    expect(layer).toHaveClass("inset-0");
    expect(layer).toHaveClass("pointer-events-none");
    expect(layer).toHaveClass("print:hidden");
    expect(layer.style.getPropertyValue("--sx")).toBe("-1000px");
    expect(layer.style.getPropertyValue("--sy")).toBe("-1000px");
  });

  it("updates --sx/--sy on pointermove for fine-pointer, motion-friendly devices", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: true });
    const frames = fakeFrames();

    const { container } = render(<Spotlight />);
    const layer = container.firstElementChild as HTMLElement;

    moveTo(100, 200);
    frames.flush();

    expect(layer.style.getPropertyValue("--sx")).toBe("100px");
    expect(layer.style.getPropertyValue("--sy")).toBe("200px");
  });

  it("coalesces a burst of pointer moves into a single animation frame with the latest position", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: true });
    const frames = fakeFrames();

    const { container } = render(<Spotlight />);
    const layer = container.firstElementChild as HTMLElement;

    for (let i = 1; i <= 4; i += 1) moveTo(i * 10, i * 20);
    expect(frames.pending()).toBe(1);
    expect(layer.style.getPropertyValue("--sx")).toBe("-1000px");

    frames.flush();
    expect(layer.style.getPropertyValue("--sx")).toBe("40px");
    expect(layer.style.getPropertyValue("--sy")).toBe("80px");
  });

  it("parks the glow off-screen again when the pointer leaves the window", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: true });
    const frames = fakeFrames();

    const { container } = render(<Spotlight />);
    const layer = container.firstElementChild as HTMLElement;

    moveTo(100, 200);
    frames.flush();
    expect(layer.style.getPropertyValue("--sx")).toBe("100px");

    act(() => {
      document.documentElement.dispatchEvent(new PointerEvent("pointerleave"));
    });
    expect(frames.pending()).toBe(1);
    frames.flush();
    expect(layer.style.getPropertyValue("--sx")).toBe("-1000px");
    expect(layer.style.getPropertyValue("--sy")).toBe("-1000px");
  });

  it("renders nothing after mount when reduced motion is preferred", () => {
    mockMatchMedia({ reducedMotion: true, finePointer: true });
    const { container } = render(<Spotlight />);
    expect(container.firstElementChild).toBeNull();
  });

  it("renders nothing after mount without a fine hover-capable pointer", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: false });
    const { container } = render(<Spotlight />);
    expect(container.firstElementChild).toBeNull();
  });

  const flips: [string, Partial<Prefs>][] = [
    ["reduced motion is enabled", { reducedMotion: true }],
    ["the pointer stops being fine and hover-capable", { finePointer: false }],
  ];
  it.each(flips)("tears itself down and renders nothing once %s after mount", (_label, change) => {
    const media = mockMatchMedia({ reducedMotion: false, finePointer: true });
    const frames = fakeFrames();
    const remove = vi.spyOn(window, "removeEventListener");

    const { container } = render(<Spotlight />);
    expect(container.firstElementChild).not.toBeNull();
    expect(media.listenerCount()).toBe(2);
    moveTo(100, 200);
    expect(frames.pending()).toBe(1);

    media.set(change);

    expect(container.firstElementChild).toBeNull();
    expect(frames.pending()).toBe(0);
    expect(remove).toHaveBeenCalledWith("pointermove", expect.any(Function));
    expect(media.listenerCount()).toBe(0);
    remove.mockRestore();
  });

  it("stops listening for pointer moves, pointer leave and media changes on unmount", () => {
    const media = mockMatchMedia({ reducedMotion: false, finePointer: true });
    const frames = fakeFrames();
    const removeFromWindow = vi.spyOn(window, "removeEventListener");
    const removeFromRoot = vi.spyOn(document.documentElement, "removeEventListener");

    const { unmount } = render(<Spotlight />);
    expect(media.listenerCount()).toBe(2);
    moveTo(100, 200);
    expect(frames.pending()).toBe(1);

    unmount();

    expect(frames.pending()).toBe(0);
    expect(removeFromWindow).toHaveBeenCalledWith("pointermove", expect.any(Function));
    expect(removeFromRoot).toHaveBeenCalledWith("pointerleave", expect.any(Function));
    expect(media.listenerCount()).toBe(0);
    removeFromWindow.mockRestore();
    removeFromRoot.mockRestore();
  });
});
