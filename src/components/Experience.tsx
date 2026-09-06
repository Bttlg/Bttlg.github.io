import type { Locale } from "@/lib/i18n";
import { formatPeriod } from "@/lib/dates";
import { experience, ui, type Experience as ExperienceEntry } from "@/content";
import { Section } from "./Section";
import { Chip } from "./Chip";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

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
            {/* No stagger: each entry is taller than a stagger step and crosses
                the trigger line by itself, so a delay would read as lag. */}
            <Reveal>
              <span
                aria-hidden="true"
                // Rail centre is 24.5px left of the entry (1px rail + 24px
                // padding); 12px dot -> -30.5px. top-0.5 puts the dot's centre
                // on the first line's (16px) centre. Current roles are filled
                // with a static soft ring instead of a looping pulse.
                className={`timeline-dot absolute top-0.5 -left-[30.5px] h-3 w-3 rounded-full border-2 border-accent ${
                  entry.period.to === null ? "bg-accent ring-4 ring-accent/20" : "bg-canvas"
                }`}
              />
              <p className="font-mono text-xs text-muted">{formatPeriod(entry.period, lang, t.cv.present)}</p>
              <h3 className="mt-1 text-lg leading-snug font-semibold tracking-[-0.01em] text-fg">
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
                  >
                    {entry.company[lang]}
                    <Icon name="external" className="h-3.5 w-3.5 text-muted" />
                  </a>
                ) : (
                  entry.company[lang]
                )}
              </h3>
              <p className="font-mono text-sm text-accent">{entry.role[lang]}</p>
              <p className="mt-2 leading-relaxed text-fg-soft">{entry.summary[lang]}</p>
              {entry.highlights[lang].length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted marker:text-muted/50">
                  {entry.highlights[lang].map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.stack.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
