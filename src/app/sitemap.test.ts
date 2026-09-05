import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists both locales of home and cv with hreflang alternates", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url).sort();
    expect(urls).toEqual([
      "https://bttlg.github.io/en/",
      "https://bttlg.github.io/en/cv/",
      "https://bttlg.github.io/mn/",
      "https://bttlg.github.io/mn/cv/",
    ]);
    const home = entries.find((e) => e.url === "https://bttlg.github.io/mn/");
    expect(home?.alternates?.languages).toEqual({
      mn: "https://bttlg.github.io/mn/",
      en: "https://bttlg.github.io/en/",
    });
    expect(home?.priority).toBe(1);
  });
});
