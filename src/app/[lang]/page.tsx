import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <>
      <JsonLd lang={lang} />
      <Hero lang={lang} />
      <About lang={lang} />
      <Skills lang={lang} />
      <Experience lang={lang} />
      <Projects lang={lang} />
      <Contact lang={lang} />
    </>
  );
}
