import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { profile, ui } from "@/content";
import { SocialLinks } from "./SocialLinks";
import { Avatar } from "./Avatar";
import { Typewriter } from "./Typewriter";
import { Snow } from "./Snow";

export function Hero({ lang }: { lang: Locale }) {
  const t = ui[lang];

  return (
    <section
      aria-labelledby="hero-title"
      className="relative -mx-4 overflow-hidden px-4 pt-20 pb-12 sm:-mx-6 sm:px-6 sm:pt-28"
    >
      <Snow />
      <div
        aria-hidden="true"
        className="animate-aurora pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-aurora-2 pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="fade-up font-mono text-sm text-accent">
            <Typewriter text={t.hero.prompt} />
          </p>
          <h1 id="hero-title" className="fade-up d1 mt-4 text-4xl font-bold tracking-tight text-fg sm:text-5xl">
            {profile.name[lang]}
          </h1>
          <p className="fade-up d2 mt-3 font-mono text-lg text-muted">{profile.title[lang]}</p>
          <p className="fade-up d3 mt-6 max-w-2xl text-lg leading-relaxed text-muted">{profile.tagline[lang]}</p>
          <div className="fade-up d4 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="rounded-md bg-accent px-4 py-2 font-medium text-canvas transition-shadow hover:opacity-90 hover:shadow-[0_0_28px_-6px_var(--color-accent)]"
            >
              {t.actions.viewProjects}
            </a>
            <Link
              href={localePath(lang, "/cv")}
              className="rounded-md border border-border px-4 py-2 font-medium text-fg transition-colors hover:border-accent"
            >
              {t.actions.viewCv}
            </Link>
            <a href="#contact" className="px-2 py-2 font-medium text-muted hover:text-fg">
              {t.actions.contactMe} →
            </a>
          </div>
          <div className="fade-up d5 mt-8">
            <SocialLinks lang={lang} />
          </div>
        </div>
        <div className="fade-up d2 order-first justify-self-center md:order-none md:justify-self-end">
          <Avatar lang={lang} size={208} />
        </div>
      </div>
    </section>
  );
}
