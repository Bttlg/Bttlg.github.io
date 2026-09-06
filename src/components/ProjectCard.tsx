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
    <article className="relative flex h-full flex-col rounded-lg border border-border bg-surface/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_12px_40px_-16px_rgba(52,211,153,0.35)]">
      {project.logo && (
        <span className="mb-3 inline-flex h-9 w-fit items-center rounded-md bg-white px-2.5 shadow-sm ring-1 ring-black/5">
          <Image src={project.logo.src} alt="" width={project.logo.width} height={project.logo.height} className="h-5 w-auto" />
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-fg">{project.name[lang]}</h3>
        <span className="shrink-0 font-mono text-xs text-muted">{formatPeriod(project.period, lang, t.cv.present)}</span>
      </div>
      <p className="mt-1 font-mono text-xs text-accent">{project.role[lang]}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary[lang]}</p>
      {highlights.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </div>
      {(project.liveUrl || project.repoUrl) && (
        <div className="mt-auto flex gap-5 pt-5 font-mono text-sm">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-fg hover:text-accent"
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
              className="inline-flex items-center gap-1 text-fg hover:text-accent"
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
