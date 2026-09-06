import type { Locale } from "@/lib/i18n";
import { formatPeriod } from "@/lib/dates";
import { experience, ui, type Experience as ExperienceEntry } from "@/content";
import { Section } from "./Section";
import { Chip } from "./Chip";
import { Icon } from "./Icon";

/** Current roles first (latest start first), then finished roles (latest end first). */
export function sortExperience(list: ExperienceEntry[]): ExperienceEntry[] {
  return [...list].sort((a, b) => {
    if (a.period.to === null && b.period.to !== null) return -1;
    if (a.period.to !== null && b.period.to === null) return 1;
    if (a.period.to === null && b.period.to === null) return b.period.from.localeCompare(a.period.from);
    return (b.period.to as string).localeCompare(a.period.to as string);
  });
}

export function Experience({ lang }: { lang: Locale }) {
  const t = ui[lang];

  return (
    <Section id="experience" title={t.sections.experience}>
      <ol className="relative border-l border-border pl-6">
        {sortExperience(experience).map((entry) => (
          <li key={entry.id} className="relative pb-10 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute top-1.5 -left-[29px] h-3 w-3 rounded-full border-2 border-accent bg-canvas ${
                entry.period.to === null ? "animate-pulse-ring" : ""
              }`}
            />
            <p className="font-mono text-xs text-muted">{formatPeriod(entry.period, lang, t.cv.present)}</p>
            <h3 className="mt-1 text-lg font-semibold text-fg">
              {entry.url ? (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-accent"
                >
                  {entry.company[lang]}
                  <Icon name="external" className="h-3.5 w-3.5 text-muted" />
                </a>
              ) : (
                entry.company[lang]
              )}
            </h3>
            <p className="font-mono text-sm text-accent">{entry.role[lang]}</p>
            <p className="mt-2 text-muted">{entry.summary[lang]}</p>
            {entry.highlights[lang].length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {entry.highlights[lang].map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.stack.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
