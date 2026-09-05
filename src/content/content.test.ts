import { describe, it, expect } from "vitest";
import { profile, experience, projects, skills, education, ui, experienceStart } from "./index";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function isLocalized(v: unknown): v is { mn: Json; en: Json } {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  const keys = Object.keys(v).sort();
  return keys.length === 2 && keys[0] === "en" && keys[1] === "mn";
}

/** Both locale values must have the same shape and no empty strings. */
function assertParallel(a: Json, b: Json, path: string): void {
  if (typeof a === "string" || typeof b === "string") {
    expect(typeof a, path).toBe("string");
    expect(typeof b, path).toBe("string");
    expect((a as string).trim(), `${path} (mn) is empty`).not.toBe("");
    expect((b as string).trim(), `${path} (en) is empty`).not.toBe("");
    return;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    expect(Array.isArray(a) && Array.isArray(b), path).toBe(true);
    expect((a as Json[]).length, `${path} length differs between mn and en`).toBe((b as Json[]).length);
    (a as Json[]).forEach((item, i) => assertParallel(item, (b as Json[])[i], `${path}[${i}]`));
    return;
  }
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    expect(ka, `${path} keys differ`).toEqual(kb);
    ka.forEach((k) => assertParallel((a as Record<string, Json>)[k], (b as Record<string, Json>)[k], `${path}.${k}`));
  }
}

/** Walk any content tree; every {mn, en} node is checked with assertParallel. */
function walk(node: unknown, path: string): void {
  if (isLocalized(node)) {
    assertParallel(node.mn, node.en, path);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${path}[${i}]`));
    return;
  }
  if (typeof node === "object" && node !== null) {
    Object.entries(node).forEach(([k, v]) => walk(v, `${path}.${k}`));
  }
}

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

function checkPeriod(period: { from: string; to: string | null }, path: string): void {
  expect(period.from, `${path}.from`).toMatch(YEAR_MONTH);
  if (period.to !== null) {
    expect(period.to, `${path}.to`).toMatch(YEAR_MONTH);
    expect(period.to >= period.from, `${path}: to is before from`).toBe(true);
  }
}

describe("content: every localized value exists in mn and en", () => {
  it("profile", () => walk(profile, "profile"));
  it("experience", () => walk(experience, "experience"));
  it("projects", () => walk(projects, "projects"));
  it("skills", () => walk(skills, "skills"));
  it("education", () => walk(education, "education"));
  it("ui", () => assertParallel(ui.mn as unknown as Json, ui.en as unknown as Json, "ui"));
});

describe("content: identifiers and URLs", () => {
  it("project slugs are unique and url-safe", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/));
  });
  it("experience ids are unique", () => {
    const ids = experience.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("all urls are https", () => {
    const urls = [
      profile.github,
      ...(profile.linkedin ? [profile.linkedin] : []),
      ...experience.flatMap((e) => (e.url ? [e.url] : [])),
      ...projects.flatMap((p) => [p.liveUrl, p.repoUrl].filter((u): u is string => Boolean(u))),
    ];
    urls.forEach((u) => expect(u).toMatch(/^https:\/\/[^\s]+$/));
  });
  it("email looks like an email", () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });
});

describe("content: periods and flags", () => {
  it("periods are YYYY-MM and ordered", () => {
    experience.forEach((e) => checkPeriod(e.period, `experience.${e.id}`));
    projects.forEach((p) => checkPeriod(p.period, `projects.${p.slug}`));
    education.forEach((e, i) => checkPeriod(e.period, `education[${i}]`));
  });
  it("has at least one featured project of each kind", () => {
    expect(projects.some((p) => p.featured && p.kind === "work")).toBe(true);
    expect(projects.some((p) => p.featured && p.kind === "personal")).toBe(true);
  });
  it("experienceStart is the earliest experience start", () => {
    const sorted = experience.map((e) => e.period.from).sort();
    expect(experienceStart).toBe(sorted[0]);
    expect(experienceStart).toMatch(YEAR_MONTH);
  });
  it("skill groups are non-empty with unique ids", () => {
    expect(skills.length).toBeGreaterThan(0);
    skills.forEach((g) => expect(g.items.length).toBeGreaterThan(0));
    expect(new Set(skills.map((g) => g.id)).size).toBe(skills.length);
  });
});
