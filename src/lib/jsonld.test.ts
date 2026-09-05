import { describe, it, expect } from "vitest";
import { personJsonLd, serializeJsonLd } from "./jsonld";
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

describe("serializeJsonLd", () => {
  it("escapes < so embedded content can never close the script tag, while preserving it through JSON.parse", () => {
    const value = { a: "</script><b>" };
    const serialized = serializeJsonLd(value);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized).a).toContain("</script>");
  });

  it("round-trips through JSON.parse", () => {
    const value = { a: "</script><b>" };
    expect(JSON.parse(serializeJsonLd(value))).toEqual(value);
  });
});
