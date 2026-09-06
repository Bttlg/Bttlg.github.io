import type { Locale } from "@/lib/i18n";
import type { Period } from "@/lib/dates";

export type { Period };

/** Every user-visible string exists in both locales; missing one fails `tsc`. */
export type Localized<T = string> = Record<Locale, T>;

export interface Profile {
  name: Localized;
  title: Localized;
  tagline: Localized;
  location: Localized;
  email: string;
  github: string;
  /** Empty string = not shown anywhere. */
  linkedin: string;
  /** Paragraphs. Same count in both locales. */
  about: Localized<string[]>;
  facts: { label: Localized; value: Localized }[];
}

export interface Experience {
  id: string;
  company: Localized;
  url?: string;
  role: Localized;
  period: Period;
  summary: Localized;
  highlights: Localized<string[]>;
  stack: string[];
}

export interface Project {
  slug: string;
  name: Localized;
  logo?: { src: string; width: number; height: number };
  kind: "work" | "personal";
  role: Localized;
  period: Period;
  summary: Localized;
  highlights: Localized<string[]>;
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export interface SkillGroup {
  id: string;
  label: Localized;
  items: string[];
}

export interface Education {
  school: Localized;
  degree: Localized;
  period: Period;
}

export interface UiDict {
  brand: string;
  langName: string;
  nav: Record<"label" | "about" | "skills" | "experience" | "projects" | "contact" | "cv", string>;
  sections: Record<
    "about" | "skills" | "experience" | "projects" | "work" | "personal" | "contact" | "education",
    string
  >;
  actions: Record<"viewProjects" | "viewCv" | "contactMe" | "live" | "source" | "print", string>;
  hero: Record<"prompt", string>;
  about: Record<"years" | "yearsValue", string>;
  contact: Record<"body" | "email", string>;
  cv: Record<"title" | "summary" | "featuredProjects" | "present", string>;
  notFound: Record<"title" | "body" | "home", string>;
  footer: Record<"builtWith", string>;
}

export type Ui = Record<Locale, UiDict>;
