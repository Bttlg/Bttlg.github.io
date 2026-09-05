import type { Locale } from "./i18n";

/** "YYYY-MM" strings; `to: null` means "present". */
export interface Period {
  from: string;
  to: string | null;
}

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function split(ym: string): { year: number; month: number } {
  const [y, m] = ym.split("-");
  return { year: Number(y), month: Number(m) };
}

export function formatYearMonth(ym: string, locale: Locale): string {
  const { year, month } = split(ym);
  if (locale === "mn") return `${year}.${String(month).padStart(2, "0")}`;
  return `${EN_MONTHS[month - 1]} ${year}`;
}

export function formatPeriod(period: Period, locale: Locale, presentLabel: string): string {
  const from = formatYearMonth(period.from, locale);
  const to = period.to ? formatYearMonth(period.to, locale) : presentLabel;
  return `${from} – ${to}`;
}

/** Whole years elapsed between "YYYY-MM" and `now`, floored, never negative. */
export function yearsSince(from: string, now: Date): number {
  const { year, month } = split(from);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.max(0, Math.floor(months / 12));
}
