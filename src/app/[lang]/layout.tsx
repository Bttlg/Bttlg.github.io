import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LOCALES, hasLocale, localePath } from "@/lib/i18n";
import { profile } from "@/content";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type Params = Promise<{ lang: string }>;

// Static export: only the locales from generateStaticParams exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const name = profile.name[lang];
  const title = `${name} — ${profile.title[lang]}`;
  const description = profile.tagline[lang];

  return {
    title: { default: title, template: `%s · ${name}` },
    description,
    alternates: {
      canonical: localePath(lang),
      languages: {
        mn: localePath("mn"),
        en: localePath("en"),
        "x-default": localePath("mn"),
      },
    },
    openGraph: {
      type: "website",
      locale: lang === "mn" ? "mn_MN" : "en_US",
      url: localePath(lang),
      siteName: name,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export default async function LangLayout({ children, params }: { children: ReactNode; params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div lang={lang} className="flex min-h-screen flex-col">
      <Nav lang={lang} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 break-words sm:px-6">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
