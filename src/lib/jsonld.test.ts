import { describe, it, expect } from "vitest";
import { personJsonLd } from "./jsonld";
import { profile } from "@/content";

describe("personJsonLd", () => {
  it("describes a Person with url and sameAs", () => {
    const ld = personJsonLd("en");
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe(profile.name.en);
    expect(ld.jobTitle).toBe(profile.title.en);
    expect(ld.url).toBe("https://bttlg.github.io/en/");
    expect(ld.email).toBe(`mailto:${profile.email}`);
    const sameAs = ld.sameAs as string[];
    expect(sameAs).toContain(profile.github);
    if (!profile.linkedin) expect(sameAs).toHaveLength(1);
    else expect(sameAs).toContain(profile.linkedin);
  });
});
