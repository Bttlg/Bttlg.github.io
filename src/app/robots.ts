import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Required for `output: "export"`: Route Handlers must be explicitly marked
// static, or `next build` fails with "dynamic .../revalidate not configured".
// See https://nextjs.org/docs/app/guides/static-exports#route-handlers
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
