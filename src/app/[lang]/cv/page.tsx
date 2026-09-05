import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { alternatesFor, socialMetadata } from "@/lib/seo";
import { profile, ui } from "@/content";
import { CvDocument } from "@/components/cv/CvDocument";
import { PrintButton } from "@/components/cv/PrintButton";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const name = profile.name[lang];
  const title = `${ui[lang].cv.title} · ${name}`;
  return {
    title: ui[lang].cv.title,
    alternates: alternatesFor(lang, "/cv"),
    ...socialMetadata(lang, "/cv", title, profile.tagline[lang], name),
  };
}

export default async function CvPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="py-10 print:py-0">
      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton label={ui[lang].actions.print} />
      </div>
      <CvDocument lang={lang} />
    </div>
  );
}
