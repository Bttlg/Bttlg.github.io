import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { profile, ui } from "@/content";
import { SocialLinks } from "./SocialLinks";

export function Hero({ lang }: { lang: Locale }) {
  const t = ui[lang];

  return (
    <section aria-labelledby="hero-title" className="fade-up relative pt-20 pb-12 sm:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <p className="font-mono text-sm text-accent">{t.hero.prompt}</p>
      <h1 id="hero-title" className="mt-4 text-4xl font-bold tracking-tight text-fg sm:text-5xl">
        {profile.name[lang]}
      </h1>
      <p className="mt-3 font-mono text-lg text-muted">{profile.title[lang]}</p>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{profile.tagline[lang]}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="rounded-md bg-accent px-4 py-2 font-medium text-canvas hover:opacity-90"
        >
          {t.actions.viewProjects}
        </a>
        <Link
          href={localePath(lang, "/cv")}
          className="rounded-md border border-border px-4 py-2 font-medium text-fg hover:border-accent"
        >
          {t.actions.viewCv}
        </Link>
        <a href="#contact" className="px-2 py-2 font-medium text-muted hover:text-fg">
          {t.actions.contactMe} →
        </a>
      </div>
      <div className="mt-8">
        <SocialLinks lang={lang} />
      </div>
    </section>
  );
}
