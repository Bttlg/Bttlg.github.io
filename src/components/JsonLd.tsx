import type { Locale } from "@/lib/i18n";
import { personJsonLd } from "@/lib/jsonld";

export function JsonLd({ lang }: { lang: Locale }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(lang)) }}
    />
  );
}
