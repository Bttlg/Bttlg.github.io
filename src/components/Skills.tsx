import type { Locale } from "@/lib/i18n";
import { skills, ui } from "@/content";
import { Section } from "./Section";
import { Chip } from "./Chip";
import { Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";

export function Skills({ lang }: { lang: Locale }) {
  const t = ui[lang];

  return (
    <Section id="skills" title={t.sections.skills}>
      <dl className="space-y-6">
        {skills.map((group, index) => (
          <Reveal key={group.id} delay={staggerDelay(index)} className="grid gap-2 sm:grid-cols-[140px_1fr]">
            <dt className="font-mono text-sm text-fg">{group.label[lang]}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
