import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows everything and points to the sitemap", () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe("https://bttlg.github.io/sitemap.xml");
  });
});
