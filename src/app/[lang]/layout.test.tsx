import { describe, it, expect } from "vitest";
import { generateMetadata, generateStaticParams } from "./layout";

describe("[lang] layout metadata", () => {
  it("generates both locales", () => {
    expect(generateStaticParams()).toEqual([{ lang: "mn" }, { lang: "en" }]);
  });

  it("uses the home path for canonical and og:url", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ lang: "mn" }) });
    expect(meta.alternates?.canonical).toBe("/mn/");
    expect(meta.alternates?.languages).toEqual({ mn: "/mn/", en: "/en/", "x-default": "/mn/" });
    expect(meta.openGraph?.url).toBe("/mn/");
    expect(meta.openGraph?.locale).toBe("mn_MN");
  });
});
