"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, localePath, stripLocale, type Locale } from "@/lib/i18n";

/** MN | EN toggle. Links to the same sub-path in the other locale and remembers the choice. */
export function LangSwitch({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? "/";
  const sub = stripLocale(pathname);

  return (
    <div className="flex items-center font-mono text-sm" role="group" aria-label="Language">
      {LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center">
          {index > 0 && <span className="mx-1.5 h-3 w-px bg-white/15" aria-hidden="true" />}
          {locale === lang ? (
            <span className="text-fg" aria-current="true">
              {locale.toUpperCase()}
            </span>
          ) : (
            <Link
              href={localePath(locale, sub)}
              hrefLang={locale}
              lang={locale}
              className="text-muted transition-colors hover:text-fg"
              onClick={() => {
                try {
                  localStorage.setItem("locale", locale);
                } catch {
                  // storage may be unavailable (private mode); the link still works
                }
              }}
            >
              {locale.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
