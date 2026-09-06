import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { formatPeriod } from "@/lib/dates";
import { ui, type Project } from "@/content";
import { Chip } from "./Chip";
import { Icon } from "./Icon";

const MAX_HIGHLIGHTS = 3;

export function ProjectCard({ project, lang }: { project: Project; lang: Locale }) {
  const t = ui[lang];
  const highlights = project.highlights[lang].slice(0, MAX_HIGHLIGHTS);

  return (
    // The lift is a compositor transition; the deeper hover shadow is a
    // static ::after crossfaded by opacity (box-shadow is a paint property,
    // animating it on six cards is not). `isolate` keeps the -z ::after
    // inside the card's own stacking context, behind its content.
    <article className="relative isolate flex h-full flex-col rounded-xl bg-surface/80 p-6 shadow-card transition-[translate] duration-200 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-xl after:opacity-0 after:shadow-card-hover after:transition-opacity after:duration-200 hover:-translate-y-0.5 hover:after:opacity-100 motion-reduce:hover:translate-y-0">
      {project.logo && (
        <span className="mb-4 inline-flex h-9 w-fit items-center rounded-md bg-white/90 px-2.5 ring-1 ring-inset ring-black/10">
          <Image src={project.logo.src} alt="" width={project.logo.width} height={project.logo.height} className="h-5 w-auto" />
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg leading-snug font-semibold tracking-[-0.01em] text-balance text-fg">{project.name[lang]}</h3>
        <span className="shrink-0 font-mono text-xs text-muted">{formatPeriod(project.period, lang, t.cv.present)}</span>
      </div>
      <p className="mt-1 font-mono text-xs text-accent">{project.role[lang]}</p>
      <p className="mt-3 text-sm leading-relaxed text-fg-soft">{project.summary[lang]}</p>
      {highlights.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted marker:text-muted/50">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </div>
      {(project.liveUrl || project.repoUrl) && (
        <div className="mt-auto flex gap-4 pt-6 font-mono text-sm">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-fg transition-colors hover:text-accent"
            >
              {t.actions.live}
              <Icon name="external" className="h-3.5 w-3.5" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-fg transition-colors hover:text-accent"
            >
              {t.actions.source}
              <Icon name="external" className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
