import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_LOCALE, LOCALES, localePath } from "@/lib/i18n";
import { REDIRECT_SCRIPT } from "@/lib/redirect-script";
import { profile, ui } from "@/content";

export const metadata: Metadata = {
  title: `${profile.name.mn} · ${profile.name.en}`,
  description: profile.tagline.en,
  robots: { index: false, follow: true },
  alternates: { canonical: localePath(DEFAULT_LOCALE) },
};

/**
 * "/" has no locale. The inline script picks one (saved > browser > mn) and
 * replaces the URL before paint; the meta refresh covers no-JS visitors.
 */
export default function RootRedirectPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <meta httpEquiv="refresh" content={`0;url=${localePath(DEFAULT_LOCALE)}`} />
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
      <p className="font-mono text-sm text-accent">{ui.mn.hero.prompt}</p>
      <h1 className="text-3xl font-bold tracking-tight">
        {profile.name.mn} <span className="font-normal text-muted">/ {profile.name.en}</span>
      </h1>
      <nav className="flex gap-6 font-mono" aria-label="Language">
        {LOCALES.map((locale) => (
          <Link
            key={locale}
            href={localePath(locale)}
            lang={locale}
            hrefLang={locale}
            className="text-fg underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {ui[locale].langName}
          </Link>
        ))}
      </nav>
    </main>
  );
}
