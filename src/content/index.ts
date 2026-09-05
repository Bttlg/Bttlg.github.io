import { experience } from "./experience";

export { profile } from "./profile";
export { experience } from "./experience";
export { projects } from "./projects";
export { skills } from "./skills";
export { education } from "./education";
export { ui } from "./ui";
export type { Localized, Period, Profile, Experience, Project, SkillGroup, Education, UiDict, Ui } from "./types";

/** Earliest "YYYY-MM" across all experience entries; drives the "N+ years" fact. */
export const experienceStart: string = experience.map((e) => e.period.from).sort()[0];
