export const LOCALES = ["mn", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "mn";

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "mn" ? "en" : "mn";
}

/** Always returns a path that starts and ends with "/". */
function normalize(path: string): string {
  let out = path.startsWith("/") ? path : `/${path}`;
  if (!out.endsWith("/")) out += "/";
  return out;
}

/** Remove a leading locale segment: "/en/cv/" -> "/cv/", "/mn" -> "/". */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(mn|en)(?=\/|$)/);
  const rest = match ? pathname.slice(match[0].length) : pathname;
  return normalize(rest);
}

/** Build a locale-prefixed path with trailing slash: ("en", "/cv") -> "/en/cv/". */
export function localePath(locale: Locale, sub: string = "/"): string {
  const normalized = normalize(sub);
  return normalized === "/" ? `/${locale}/` : `/${locale}${normalized}`;
}
