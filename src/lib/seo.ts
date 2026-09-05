import type { Metadata } from "next";
import { LOCALES, localePath, type Locale } from "./i18n";

/** Canonical URL plus hreflang alternates (mn, en, x-default → mn) for one sub-path such as "/" or "/cv". */
export function alternatesFor(lang: Locale, sub: string = "/"): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localePath(lang, sub),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l, sub)])),
      "x-default": localePath("mn", sub),
    },
  };
}

/** OpenGraph + Twitter card metadata for one page. `url` is the page's own locale path. */
export function socialMetadata(
  lang: Locale,
  sub: string,
  title: string,
  description: string,
  siteName: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      locale: lang === "mn" ? "mn_MN" : "en_US",
      url: localePath(lang, sub),
      siteName,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
