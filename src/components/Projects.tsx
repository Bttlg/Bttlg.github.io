import type { Locale } from "@/lib/i18n";
import { projects, ui, type Project } from "@/content";
import { Section } from "./Section";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";

/** Stable sort: featured projects first, original order otherwise. */
export function sortFeaturedFirst(list: Project[]): Project[] {
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
}

function Group({ id, title, items, lang }: { id: string; title: string; items: Project[]; lang: Locale }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={`${id}-title`} className="mt-10 first:mt-0">
      <Reveal>
        <h3 id={`${id}-title`} className="font-mono text-sm text-muted">
          {title}
        </h3>
      </Reveal>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((project, index) => (
          <Reveal key={project.slug} delay={staggerDelay(index)} className="h-full">
            <ProjectCard project={project} lang={lang} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Projects({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const work = sortFeaturedFirst(projects.filter((p) => p.kind === "work"));
  const personal = sortFeaturedFirst(projects.filter((p) => p.kind === "personal"));

  return (
    <Section id="projects" title={t.sections.projects}>
      <Group id="projects-work" title={t.sections.work} items={work} lang={lang} />
      <Group id="projects-personal" title={t.sections.personal} items={personal} lang={lang} />
    </Section>
  );
}
