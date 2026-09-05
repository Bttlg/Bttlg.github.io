import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { profile } from "@/content";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <h1 className="py-20 text-4xl font-bold">{profile.name[lang]}</h1>;
}
