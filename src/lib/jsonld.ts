import { localePath, type Locale } from "./i18n";
import { SITE_URL } from "./site";
import { profile } from "@/content";

/** schema.org Person for the home page. */
export function personJsonLd(lang: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name[lang],
    jobTitle: profile.title[lang],
    description: profile.tagline[lang],
    url: `${SITE_URL}${localePath(lang)}`,
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, ...(profile.linkedin ? [profile.linkedin] : [])],
    address: { "@type": "PostalAddress", addressLocality: profile.location[lang] },
  };
}

/** Serialize for a <script type="application/ld+json">: `<` is escaped so content can never close the tag. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
