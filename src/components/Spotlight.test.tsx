import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render } from "@testing-library/react";
import { Spotlight } from "./Spotlight";

function mockMatchMedia({ reducedMotion, finePointer }: { reducedMotion: boolean; finePointer: boolean }) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reducedMotion : finePointer,
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

function stubImmediateFrame() {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
}

describe("Spotlight", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders a fixed, aria-hidden, click-through layer parked off-screen before the pointer moves", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: true });
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
    stubImmediateFrame();

    const { container } = render(<Spotlight />);
    const layer = container.firstElementChild as HTMLElement;

    act(() => {
      window.dispatchEvent(new PointerEvent("pointermove", { clientX: 100, clientY: 200 }));
    });

    expect(layer.style.getPropertyValue("--sx")).toBe("100px");
    expect(layer.style.getPropertyValue("--sy")).toBe("200px");
  });

  it("coalesces a burst of pointer moves into a single animation frame with the latest position", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: true });
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal("cancelAnimationFrame", () => {});

    const { container } = render(<Spotlight />);
    const layer = container.firstElementChild as HTMLElement;

    act(() => {
      for (let i = 1; i <= 4; i += 1) {
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: i * 10, clientY: i * 20 }));
      }
    });
    expect(frames).toHaveLength(1);
    expect(layer.style.getPropertyValue("--sx")).toBe("-1000px");

    act(() => {
      frames[0](16);
    });
    expect(layer.style.getPropertyValue("--sx")).toBe("40px");
    expect(layer.style.getPropertyValue("--sy")).toBe("80px");
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

  it("stops listening for pointer moves on unmount", () => {
    mockMatchMedia({ reducedMotion: false, finePointer: true });
    stubImmediateFrame();
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Spotlight />);
    unmount();
    expect(remove).toHaveBeenCalledWith("pointermove", expect.any(Function));
    remove.mockRestore();
  });
});
