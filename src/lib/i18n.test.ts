import { describe, it, expect } from "vitest";
import {
  LOCALES,
  DEFAULT_LOCALE,
  hasLocale,
  otherLocale,
  stripLocale,
  localePath,
} from "./i18n";

describe("LOCALES", () => {
  it("is mn then en, default mn", () => {
    expect([...LOCALES]).toEqual(["mn", "en"]);
    expect(DEFAULT_LOCALE).toBe("mn");
  });
});

describe("hasLocale", () => {
  it("accepts supported locales only", () => {
    expect(hasLocale("mn")).toBe(true);
    expect(hasLocale("en")).toBe(true);
    expect(hasLocale("de")).toBe(false);
    expect(hasLocale("")).toBe(false);
    expect(hasLocale("MN")).toBe(false);
  });
});

describe("otherLocale", () => {
  it("flips between mn and en", () => {
    expect(otherLocale("mn")).toBe("en");
    expect(otherLocale("en")).toBe("mn");
  });
});

describe("stripLocale", () => {
  it.each([
    ["/en/cv/", "/cv/"],
    ["/en/cv", "/cv/"],
    ["/mn/", "/"],
    ["/mn", "/"],
    ["/", "/"],
    ["/cv", "/cv/"],
    ["/english/", "/english/"],
  ])("%s -> %s", (input, expected) => {
    expect(stripLocale(input)).toBe(expected);
  });
});

describe("localePath", () => {
  it.each([
    ["en", "/cv", "/en/cv/"],
    ["en", "/cv/", "/en/cv/"],
    ["en", "cv", "/en/cv/"],
    ["mn", "/", "/mn/"],
    ["mn", undefined, "/mn/"],
  ] as const)("(%s, %s) -> %s", (locale, sub, expected) => {
    expect(localePath(locale, sub)).toBe(expected);
  });
});
