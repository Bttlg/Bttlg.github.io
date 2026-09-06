import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { profile, ui } from "@/content";
import { SocialLinks } from "./SocialLinks";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { Typewriter } from "./Typewriter";

export function Hero({ lang }: { lang: Locale }) {
  const t = ui[lang];

  return (
    <section
      aria-labelledby="hero-title"
      className="relative -mx-4 px-4 pt-20 pb-12 sm:-mx-6 sm:px-6 sm:pt-28"
    >
      <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="fade-up font-mono text-sm text-accent">
            <Typewriter text={t.hero.prompt} />
          </p>
          <h1 id="hero-title" className="fade-up d1 mt-4 text-4xl leading-display font-bold tracking-display text-balance text-fg sm:text-5xl">
            {profile.name[lang]}
          </h1>
          <p className="fade-up d2 mt-3 font-mono text-lg text-muted">{profile.title[lang]}</p>
          <p className="fade-up d3 mt-6 max-w-2xl text-lg leading-relaxed text-fg-soft text-pretty">{profile.tagline[lang]}</p>
          <div className="fade-up d4 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="pressable inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-semibold text-canvas shadow-cta hover:brightness-110 hover:shadow-cta-hover"
            >
              {t.actions.viewProjects}
            </a>
            <Link
              href={localePath(lang, "/cv")}
              className="pressable inline-flex h-10 items-center rounded-md bg-surface/60 px-4 text-sm font-semibold text-fg shadow-pill hover:bg-surface hover:shadow-card"
            >
              {t.actions.viewCv}
            </Link>
            <a
              href="#contact"
              className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-medium text-muted transition-colors hover:text-fg"
            >
              {t.actions.contactMe}
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
          <div className="fade-up d5 mt-8">
            <SocialLinks lang={lang} />
          </div>
        </div>
        <div className="fade-up order-first justify-self-center md:order-none md:justify-self-end">
          <Avatar lang={lang} priority className="w-[200px] sm:w-[240px] md:w-[260px]" />
        </div>
      </div>
    </section>
  );
}
