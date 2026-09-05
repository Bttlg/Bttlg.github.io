import { describe, it, expect } from "vitest";
import { formatYearMonth, formatPeriod, yearsSince } from "./dates";

describe("formatYearMonth", () => {
  it("formats mn as YYYY.MM", () => {
    expect(formatYearMonth("2023-03", "mn")).toBe("2023.03");
  });
  it("formats en as Mon YYYY", () => {
    expect(formatYearMonth("2023-03", "en")).toBe("Mar 2023");
    expect(formatYearMonth("2021-10", "en")).toBe("Oct 2021");
  });
});

describe("formatPeriod", () => {
  it("uses the present label when to is null", () => {
    expect(formatPeriod({ from: "2023-03", to: null }, "mn", "одоог хүртэл")).toBe(
      "2023.03 – одоог хүртэл",
    );
    expect(formatPeriod({ from: "2023-03", to: null }, "en", "Present")).toBe(
      "Mar 2023 – Present",
    );
  });
  it("formats closed periods", () => {
    expect(formatPeriod({ from: "2021-10", to: "2026-08" }, "en", "Present")).toBe(
      "Oct 2021 – Aug 2026",
    );
  });
});

describe("yearsSince", () => {
  it("floors to whole years", () => {
    expect(yearsSince("2021-03", new Date(2026, 8, 5))).toBe(5); // 2026-09-05
    expect(yearsSince("2021-03", new Date(2026, 1, 1))).toBe(4); // 2026-02-01
    expect(yearsSince("2021-03", new Date(2026, 2, 1))).toBe(5); // 2026-03-01
  });
  it("never goes negative", () => {
    expect(yearsSince("2030-01", new Date(2026, 0, 1))).toBe(0);
  });
});
