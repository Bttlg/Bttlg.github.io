import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LOCALES, hasLocale } from "@/lib/i18n";
import { alternatesFor, socialMetadata } from "@/lib/seo";
import { profile } from "@/content";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Spotlight } from "@/components/Spotlight";

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
    alternates: alternatesFor(lang),
    ...socialMetadata(lang, "/", title, description, name),
    robots: { index: true, follow: true },
  };
}

export default async function LangLayout({ children, params }: { children: ReactNode; params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div lang={lang} className="flex min-h-screen flex-col">
      <ScrollProgress />
      <Spotlight />
      <Nav lang={lang} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 break-words sm:px-6">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
