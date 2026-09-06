import type { Locale } from "@/lib/i18n";
import { yearsSince } from "@/lib/dates";
import { profile, ui, experienceStart } from "@/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";

/** `now` is injectable for tests; at build time it is the build date. */
export function About({ lang, now = new Date() }: { lang: Locale; now?: Date }) {
  const t = ui[lang];
  const years = yearsSince(experienceStart, now);
  const facts = [
    { label: t.about.years, value: t.about.yearsValue.replace("{n}", String(years)) },
    ...profile.facts.map((f) => ({ label: f.label[lang], value: f.value[lang] })),
  ];

  return (
    <Section id="about" title={t.sections.about}>
      <Reveal delay={staggerDelay(1)}>
        <div className="grid gap-8 md:grid-cols-[1fr_220px]">
          <div className="space-y-4 leading-relaxed text-fg-soft">
            {profile.about[lang].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="space-y-3 font-mono text-sm">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-muted">{fact.label}</dt>
                <dd className="text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </Section>
  );
}
