import type { MetadataRoute } from "next";
import { LOCALES, localePath, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

// Required for `output: "export"`: Route Handlers must be explicitly marked
// static, or `next build` fails with "dynamic .../revalidate not configured".
// See https://nextjs.org/docs/app/guides/static-exports#route-handlers
export const dynamic = "force-static";

const SUBPATHS = ["/", "/cv"] as const;

function absolute(locale: Locale, sub: string): string {
  return `${SITE_URL}${localePath(locale, sub)}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return SUBPATHS.flatMap((sub) =>
    LOCALES.map((locale) => ({
      url: absolute(locale, sub),
      changeFrequency: "monthly" as const,
      priority: sub === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, absolute(l, sub)])),
      },
    })),
  );
}
