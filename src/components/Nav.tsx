import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { ui } from "@/content";
import { LangSwitch } from "./LangSwitch";

const SECTION_IDS = ["about", "skills", "experience", "projects", "contact"] as const;

export function Nav({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const home = localePath(lang);

  return (
    <header className="nav-material sticky top-0 z-40 print:hidden">
      <nav
        aria-label={t.nav.label}
        className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link href={home} className="font-mono text-sm font-semibold text-fg transition-colors hover:text-accent">
          {t.brand}
        </Link>
        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-4 font-mono text-sm text-muted md:flex">
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <Link
                  href={`${home}#${id}`}
                  className="relative transition-colors hover:text-fg after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 after:ease-out-strong motion-reduce:after:transition-none hover:after:scale-x-100 focus-visible:after:scale-x-100"
                >
                  {t.nav[id]}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={localePath(lang, "/cv")}
            className="pressable inline-flex h-8 items-center rounded-md bg-surface/60 px-2.5 font-mono text-sm text-fg shadow-pill hover:bg-surface hover:shadow-card"
          >
            {t.nav.cv}
          </Link>
          <LangSwitch lang={lang} />
        </div>
      </nav>
    </header>
  );
}
