import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, localePath } from "@/lib/i18n";
import { ui } from "@/content";
import { CvDocument } from "@/components/cv/CvDocument";
import { PrintButton } from "@/components/cv/PrintButton";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: ui[lang].cv.title,
    alternates: {
      canonical: localePath(lang, "/cv"),
      languages: {
        mn: localePath("mn", "/cv"),
        en: localePath("en", "/cv"),
        "x-default": localePath("mn", "/cv"),
      },
    },
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
