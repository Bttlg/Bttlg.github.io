import Link from "next/link";
import { LOCALES, localePath } from "@/lib/i18n";
import { ui } from "@/content";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <meta name="robots" content="noindex" />
      <h1 className="font-mono text-6xl font-bold text-accent">404</h1>
      {LOCALES.map((locale) => (
        <div key={locale} lang={locale} className="mt-8">
          <h2 className="text-2xl font-semibold text-fg">{ui[locale].notFound.title}</h2>
          <p className="mt-1 text-muted">{ui[locale].notFound.body}</p>
          <Link
            href={localePath(locale)}
            className="mt-2 inline-block font-mono text-accent underline-offset-4 hover:underline"
          >
            {ui[locale].notFound.home} →
          </Link>
        </div>
      ))}
    </main>
  );
}
