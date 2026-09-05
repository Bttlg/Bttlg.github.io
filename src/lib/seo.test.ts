import { describe, it, expect } from "vitest";
import { alternatesFor, socialMetadata } from "./seo";

describe("alternatesFor", () => {
  it("builds canonical and hreflang alternates for a sub-path", () => {
    const alt = alternatesFor("en", "/cv");
    expect(alt.canonical).toBe("/en/cv/");
    expect(alt.languages).toEqual({ mn: "/mn/cv/", en: "/en/cv/", "x-default": "/mn/cv/" });
  });

  it("defaults to the home path", () => {
    const alt = alternatesFor("mn");
    expect(alt.canonical).toBe("/mn/");
  });
});

describe("socialMetadata", () => {
  it("builds openGraph and twitter metadata for a page", () => {
    const meta = socialMetadata("en", "/cv", "T", "D", "S");
    expect(meta.openGraph?.url).toBe("/en/cv/");
    expect(meta.openGraph?.locale).toBe("en_US");
    expect(meta.openGraph?.title).toBe("T");
    expect((meta.twitter as { card?: string } | undefined)?.card).toBe("summary_large_image");
  });

  it("uses mn_MN locale for mn", () => {
    const meta = socialMetadata("mn", "/", "T", "D", "S");
    expect(meta.openGraph?.locale).toBe("mn_MN");
  });
});
