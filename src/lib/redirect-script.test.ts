import { describe, it, expect } from "vitest";
import { REDIRECT_SCRIPT } from "./redirect-script";

interface Fakes {
  saved?: string | null;
  storageThrows?: boolean;
  languages?: string[];
  language?: string;
}

/** Runs the exact shipped script with fake globals and returns the replaced URL. */
function run({ saved = null, storageThrows = false, languages, language = "" }: Fakes): string {
  let replaced = "";
  const localStorage = {
    getItem: () => {
      if (storageThrows) throw new Error("denied");
      return saved;
    },
  };
  const navigator = { languages, language };
  const location = { replace: (url: string) => { replaced = url; } };
  new Function("localStorage", "navigator", "location", REDIRECT_SCRIPT)(localStorage, navigator, location);
  return replaced;
}

describe("REDIRECT_SCRIPT", () => {
  it("prefers a saved locale over the browser language", () => {
    expect(run({ saved: "en", languages: ["mn-MN"] })).toBe("/en/");
    expect(run({ saved: "mn", languages: ["en-US"] })).toBe("/mn/");
  });
  it("ignores an unsupported saved value", () => {
    expect(run({ saved: "de", languages: ["en-US"] })).toBe("/en/");
  });
  it("uses the first browser language", () => {
    expect(run({ languages: ["en-GB", "mn"] })).toBe("/en/");
    expect(run({ languages: ["mn-MN", "en"] })).toBe("/mn/");
    expect(run({ languages: [], language: "en" })).toBe("/en/");
  });
  it("defaults to mn", () => {
    expect(run({})).toBe("/mn/");
    expect(run({ languages: ["de-DE"] })).toBe("/mn/");
    expect(run({ languages: ["eng"] })).toBe("/mn/");
  });
  it("survives a throwing localStorage and still detects the language", () => {
    expect(run({ storageThrows: true, languages: ["en-US"] })).toBe("/en/");
    expect(run({ storageThrows: true })).toBe("/mn/");
  });
});
