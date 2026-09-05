import { describe, it, expect } from "vitest";
import { generateMetadata } from "./page";
import { profile, ui } from "@/content";

describe("cv page metadata", () => {
  it("points canonical, og:url and titles at the CV page itself", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ lang: "en" }) });
    expect(meta.alternates?.canonical).toBe("/en/cv/");
    expect(meta.openGraph?.url).toBe("/en/cv/");
    expect(meta.openGraph?.title).toBe(`${ui.en.cv.title} · ${profile.name.en}`);
    expect(meta.twitter?.title).toBe(`${ui.en.cv.title} · ${profile.name.en}`);
  });

  it("returns empty metadata for an unsupported locale", async () => {
    expect(await generateMetadata({ params: Promise.resolve({ lang: "de" }) })).toEqual({});
  });
});
