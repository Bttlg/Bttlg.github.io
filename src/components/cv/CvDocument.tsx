import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { formatPeriod } from "@/lib/dates";
import {
  profile,
  experience,
  projects,
  skills,
  education,
  ui,
  type Profile,
  type Experience,
  type Project,
  type SkillGroup,
  type Education,
} from "@/content";
import { sortFeaturedFirst } from "@/components/Projects";

export interface CvData {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
}

export const defaultCvData: CvData = { profile, experience, projects, skills, education };

const MAX_CV_PROJECTS = 6;
const MAX_CV_HIGHLIGHTS = 3;

function CvSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 break-inside-avoid">
      <h2 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function stripScheme(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

/**
 * Light "paper" document: white background and zinc text regardless of the
 * site's dark theme, so it prints correctly and reads like a CV on screen.
 */
export function CvDocument({ lang, data = defaultCvData }: { lang: Locale; data?: CvData }) {
  const t = ui[lang];
  const p = data.profile;
  const featured = sortFeaturedFirst(data.projects).slice(0, MAX_CV_PROJECTS);

  return (
    <article
      lang={lang}
      className="mx-auto max-w-[210mm] rounded-lg bg-white p-8 text-zinc-900 shadow-xl sm:p-12 print:max-w-none print:rounded-none print:p-0 print:shadow-none"
    >
      <header className="border-b border-zinc-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{p.name[lang]}</h1>
        <p className="mt-1 text-lg text-zinc-600">{p.title[lang]}</p>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-600">
          <span>{p.location[lang]}</span>
          <a href={`mailto:${p.email}`} className="underline-offset-2 hover:underline">
            {p.email}
          </a>
          <a href={p.github} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            {stripScheme(p.github)}
          </a>
          {p.linkedin && (
            <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
              {stripScheme(p.linkedin)}
            </a>
          )}
        </p>
      </header>

      <CvSection title={t.cv.summary}>
        <p>{p.about[lang][0]}</p>
      </CvSection>

      <CvSection title={t.sections.experience}>
        {data.experience.map((entry) => (
          <div key={entry.id} className="break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">
                {entry.company[lang]} <span className="font-normal text-zinc-600">· {entry.role[lang]}</span>
              </h3>
              <span className="font-mono text-xs text-zinc-500">{formatPeriod(entry.period, lang, t.cv.present)}</span>
            </div>
            <p className="mt-1 text-zinc-700">{entry.summary[lang]}</p>
            {entry.highlights[lang].length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-zinc-700">
                {entry.highlights[lang].slice(0, MAX_CV_HIGHLIGHTS).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            <p className="mt-1 font-mono text-xs text-zinc-500">{entry.stack.join(" · ")}</p>
          </div>
        ))}
      </CvSection>

      <CvSection title={t.cv.featuredProjects}>
        {featured.map((project) => (
          <div key={project.slug} className="break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">
                <span data-testid="cv-project">{project.name[lang]}</span>{" "}
                <span className="font-normal text-zinc-600">· {project.role[lang]}</span>
              </h3>
              <span className="font-mono text-xs text-zinc-500">{formatPeriod(project.period, lang, t.cv.present)}</span>
            </div>
            <p className="mt-1 text-zinc-700">{project.summary[lang]}</p>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              {project.stack.join(" · ")}
              {project.liveUrl && <> · {stripScheme(project.liveUrl)}</>}
              {project.repoUrl && <> · {stripScheme(project.repoUrl)}</>}
            </p>
          </div>
        ))}
      </CvSection>

      <CvSection title={t.sections.skills}>
        {data.skills.map((group) => (
          <p key={group.id}>
            <span className="font-semibold">{group.label[lang]}:</span> {group.items.join(", ")}
          </p>
        ))}
      </CvSection>

      {data.education.length > 0 && (
        <CvSection title={t.sections.education}>
          {data.education.map((entry) => (
            <div key={`${entry.school.en}-${entry.period.from}`} className="flex flex-wrap items-baseline justify-between gap-x-4">
              <p>
                <span className="font-semibold">{entry.school[lang]}</span>
                <span className="text-zinc-600"> · {entry.degree[lang]}</span>
              </p>
              <span className="font-mono text-xs text-zinc-500">{formatPeriod(entry.period, lang, t.cv.present)}</span>
            </div>
          ))}
        </CvSection>
      )}
    </article>
  );
}
